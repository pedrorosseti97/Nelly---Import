import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { mkdtempSync, rmSync, openSync, closeSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { saveRegistry } from "./registry";
const dir = mkdtempSync(join(tmpdir(),"nelly-registry-"));
const url = "file:"+join(dir,"test.db");
const db = new PrismaClient({datasourceUrl:url});
let admin:string, operator:string, visitor:string;
beforeAll(async()=>{
  closeSync(openSync(join(dir,"test.db"),"a"));
  execFileSync(process.execPath,["node_modules/prisma/build/index.js","migrate","deploy","--schema","prisma/local/schema.prisma"],{env:{...process.env,DATABASE_URL:url}});
  for(const role of ["ADMIN","OPERATOR","VISITOR"] as const){
    const u=await db.user.create({data:{name:role,email:role+"@test.local",role,passwordHash:"fixture"}});
    if(role==="ADMIN") admin=u.id; else if(role==="OPERATOR") operator=u.id; else visitor=u.id;
  }
});
afterAll(async()=>{await db.$disconnect();rmSync(dir,{recursive:true,force:true});});
const partner = {id:"",legalName:"Fornecedor de teste",tradeName:"",taxId:"",countryCode:"br",email:"",phone:"",active:true};
describe("cadastros transacionais com SQLite",()=>{
  it("bloqueia visitante e operador na administração de usuários",async()=>{
    await expect(saveRegistry(db,visitor,"partner",partner)).rejects.toThrow("permissão");
    await expect(saveRegistry(db,operator,"user",{id:"",name:"Teste",email:"test@test.local",role:"ADMIN",active:true,password:"TestPassword123!"})).rejects.toThrow("permissão");
    expect(await db.partner.count()).toBe(0);
  });
  it("salva parceiro e versões antes/depois na mesma transação",async()=>{
    const id=await saveRegistry(db,operator,"partner",partner);
    await saveRegistry(db,operator,"partner",{...partner,id,legalName:"Fornecedor atualizado",active:false});
    const audits=await db.auditEvent.findMany({where:{entityId:id},orderBy:{occurredAt:"asc"}});
    expect(audits).toHaveLength(2);
    expect(audits[1].before).toMatchObject({legalName:partner.legalName});
    expect(audits[1].after).toMatchObject({legalName:"Fornecedor atualizado",active:false,countryCode:"BR"});
    expect(await db.entityVersion.count({where:{entityId:id}})).toBe(2);
  });
  it("cria usuário sem vazar senha no histórico e rejeita duplicação",async()=>{
    const input={id:"",name:"Pessoa Teste",email:"PERSON@test.local",role:"VISITOR",active:true,password:"TestPassword123!"};
    const id=await saveRegistry(db,admin,"user",input);
    expect(await db.user.findUnique({where:{id}})).toMatchObject({email:"person@test.local"});
    const audit=await db.auditEvent.findFirstOrThrow({where:{entityId:id}});
    expect(JSON.stringify(audit)).not.toContain("password");
    expect(JSON.stringify(audit)).not.toContain(input.password);
    await expect(saveRegistry(db,admin,"user",input)).rejects.toThrow();
    expect(await db.auditEvent.count({where:{entityId:id}})).toBe(1);
  });
  it("impede desativar o próprio administrador e bloqueia ator inativo",async()=>{
    await expect(saveRegistry(db,admin,"user",{id:admin,name:"Admin",email:"admin@test.local",role:"ADMIN",active:false,password:""})).rejects.toThrow("Outro administrador");
    await db.user.update({where:{id:operator},data:{active:false}});
    await expect(saveRegistry(db,operator,"partner",partner)).rejects.toThrow("permissão");
  });
});
