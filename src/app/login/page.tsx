"use client";

import { useActionState } from "react";
import { login } from "../actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, { error: null });
  return <main className="login"><form action={action} className="panel"><p className="eyebrow">Antonelly</p><h1>Nelly Import</h1><p>Acesse a fundação da V1.</p><label>E-mail<input name="email" type="email" required autoComplete="email" /></label><label>Senha<input name="password" type="password" required minLength={8} autoComplete="current-password" /></label>{state.error && <p className="error">{state.error}</p>}<button disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button></form></main>;
}
