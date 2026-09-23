import { redirect } from "next/navigation";
import { logout } from "./actions/auth";
import { readSession } from "@/lib/auth";

export default async function Home() {
  const session = await readSession();
  if (!session) redirect("/login");
  return <main><header><div><p className="eyebrow">Antonelly</p><h1>Nelly Import</h1></div><form action={logout}><button type="submit" className="secondary">Sair</button></form></header><section className="hero"><p>Fundação V1</p><h2>O fluxo de importação, com controle e rastreabilidade.</h2><p>Autenticado como {session.name} · {session.role}</p></section><section className="cards">{["Demandas", "Importações", "Pagamentos", "Alertas"].map((label) => <article key={label}><span>Em preparação</span><h3>{label}</h3><p>A estrutura de dados e as regras críticas já estão protegidas.</p></article>)}</section></main>;
}
