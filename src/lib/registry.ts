import { Prisma, type PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { partnerInput, userInput } from "@/domain/registry";
import { recordMutation } from "./audit";

const publicUser = { id: true, name: true, email: true, role: true, active: true } as const;
type RegistryKind = "partner" | "user";
export async function saveRegistry(client: PrismaClient, actorId: string, kind: RegistryKind, raw: unknown) {
  const input = kind === "partner" ? partnerInput.parse(raw) : userInput.parse(raw);
  const passwordHash = "password" in input && !input.id ? await hash(input.password, 12) : undefined;
  return client.$transaction(async tx => {
    // Read current permissions within the same transaction as the write.
    const actor = await tx.user.findUnique({where:{id:actorId}, select:publicUser});
    if (!actor?.active || (kind === "user" ? actor.role !== "ADMIN" : actor.role === "VISITOR")) throw new Error("Você não tem permissão para esta alteração.");
    if (kind === "partner") {
      const data = partnerInput.parse(input);
      const before = data.id ? await tx.partner.findUnique({where:{id:data.id}}) : null;
      if (data.id && !before) throw new Error("Parceiro não encontrado.");
      const {id, ...fields} = data;
      const after = id ? await tx.partner.update({where:{id},data:fields}) : await tx.partner.create({data:fields});
      await recordMutation(tx,{actorId, action:before ? "UPDATE" : "CREATE", entityType:"Partner", entityId:after.id, before:before ? JSON.parse(JSON.stringify(before)) : undefined, after:JSON.parse(JSON.stringify(after))});
      return after.id;
    }
    const data = userInput.parse(input);
    const before = data.id ? await tx.user.findUnique({where:{id:data.id},select:publicUser}) : null;
    if (data.id && !before) throw new Error("Usuário não encontrado.");
    if (before?.id === actorId && (!data.active || data.role !== "ADMIN")) throw new Error("Outro administrador deve alterar seu acesso.");
    if (before?.active && before.role === "ADMIN" && (!data.active || data.role !== "ADMIN")) {
      if (await tx.user.count({where:{role:"ADMIN",active:true}}) <= 1) throw new Error("Mantenha ao menos um administrador ativo.");
    }
    const fields = {name:data.name,email:data.email,role:data.role,active:data.active};
    const after = data.id
      ? await tx.user.update({where:{id:data.id},data:fields,select:publicUser})
      : await tx.user.create({data:{...fields,passwordHash:passwordHash!},select:publicUser});
    // Audit snapshots never include passwords or password hashes.
    await recordMutation(tx,{actorId,action:before ? "UPDATE" : "CREATE",entityType:"User",entityId:after.id,before:before ?? undefined,after});
    return after.id;
  }, {isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
}
