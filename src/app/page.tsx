import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "./components/header";
export default async function Home() {
  const session = await readSession(); if (!session) redirect("/login");
  const [partners,users] = await Promise.all([db.partner.count({where:{active:true}}), session.role==="ADMIN" ? db.user.count({where:{active:true}}) : Promise.resolve(null)]);
  return <main><Header session={session}/><section className="section-heading"><p className="eyebrow">Visão geral</p><h2>Sua operação começa aqui.</h2><p>Cadastre parceiros e organize os acessos da equipe.</p></section><section className="cards"><article><span>Cadastros ativos</span><h3>{partners} parceiros</h3><p>Fornecedores e contatos da operação.</p><Link href="/parceiros">Abrir parceiros →</Link></article>{users!==null && <article><span>Equipe</span><h3>{users} usuários</h3><p>Perfis e permissões de acesso.</p><Link href="/usuarios">Gerenciar usuários →</Link></article>}{["Demandas e cotações","Importações e financeiro"].map(label=><article key={label}><span>Próximas entregas</span><h3>{label}</h3><p>Módulo em preparação.</p></article>)}</section></main>;
}
