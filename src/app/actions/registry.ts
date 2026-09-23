"use server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { readSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveRegistry } from "@/lib/registry";
export type SaveState = {error?:string; success?:string};
export async function savePartner(_: SaveState, form: FormData): Promise<SaveState> {
  return save("partner",form);
}
export async function saveUser(_: SaveState, form: FormData): Promise<SaveState> {
  return save("user",form);
}
async function save(kind:"partner"|"user", form:FormData):Promise<SaveState> {
  const session = await readSession();
  if (!session) return {error:"Sua sessão expirou. Entre novamente."};
  try {
    await saveRegistry(db, session.userId, kind, {...Object.fromEntries(form), active:form.get("active")==="on"});
  } catch (e) {
    if (e instanceof ZodError) return {error:e.issues[0].message};
    if (e instanceof Prisma.PrismaClientKnownRequestError) return {error:e.code==="P2002" ? "Já existe um cadastro com esse e-mail." : "Não foi possível salvar. Atualize a página e tente novamente."};
    return {error:e instanceof Error ? e.message : "Não foi possível salvar."};
  }
  revalidatePath("/");
  revalidatePath("/parceiros");
  revalidatePath("/usuarios");
  return {success:"Cadastro salvo com sucesso."};
}
