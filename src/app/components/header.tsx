import Link from "next/link";
import { logout } from "../actions/auth";
import type { Session } from "@/lib/auth";
import { roleLabels } from "@/domain/registry";
export function Header({session}:{session:Session}) {
  return <><header><div><p className="eyebrow">Antonelly</p><h1>Nelly Import</h1></div><form action={logout}><button className="secondary">Sair</button></form></header>
  <nav aria-label="Navegação principal"><Link href="/">Visão geral</Link><Link href="/parceiros">Parceiros</Link>{session.role==="ADMIN" && <Link href="/usuarios">Usuários</Link>}<span>{session.name} · {roleLabels[session.role]}</span></nav></>;
}
