import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@/domain/permissions";
import { db } from "./db";

const COOKIE = "nelly_session";
const encoder = new TextEncoder();

export type Session = { userId: string; email: string; name: string; role: Role };

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET deve ter ao menos 32 caracteres.");
  return encoder.encode(value);
}

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}

export async function readSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.userId !== "string") return null;
    const user = await db.user.findUnique({where:{id:payload.userId},select:{id:true,email:true,name:true,role:true,active:true}});
    if (!user?.active) return null;
    return { userId:user.id, email:user.email, name:user.name, role:user.role };
  } catch { return null; }
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
