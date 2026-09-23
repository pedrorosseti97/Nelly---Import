"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/auth";
import { db } from "@/lib/db";

const loginSchema = z.object({ email: z.email(), password: z.string().min(8) });
export type LoginState = { error: string | null };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Informe e-mail e senha válidos." };
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user?.active || !(await compare(parsed.data.password, user.passwordHash))) return { error: "Credenciais inválidas." };
  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
  await db.auditEvent.create({ data: { actorId: user.id, action: "LOGIN", entityType: "User", entityId: user.id } });
  redirect("/");
}

export async function logout() { await destroySession(); redirect("/login"); }
