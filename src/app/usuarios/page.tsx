import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { readSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { roleLabels } from "@/domain/registry";
import { Header } from "../components/header";
import { RegistryForm } from "../components/registry-form";
export default async function Users({searchParams}:{searchParams:Promise<{edit?:string}>}) {
  const session = await readSession(); if (!session) redirect("/login"); if(session.role!=="ADMIN") redirect("/");
  const {edit} = await searchParams;
  const users = await db.user.findMany({select:{id:true,name:true,email:true,role:true,active:true},orderBy:{name:"asc"}});
  const selected = edit ? users.find(u=>u.id===edit) : undefined;
  if(edit && !selected) notFound();
  return <main><Header session={session}/><section className="section-heading"><p className="eyebrow">Administração</p><h2>Usuários e acessos</h2><p>Defina quem consulta e quem opera o sistema. Desativar um usuário encerra seu acesso.</p></section><div className="workspace"><section className="table-wrap"><table><thead><tr><th>Usuário</th><th>Perfil</th><th>Situação</th><th>Ação</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}<small>{u.email}</small></td><td>{roleLabels[u.role]}</td><td>{u.active?"Ativo":"Inativo"}</td><td><Link href={"/usuarios?edit="+u.id}>Editar</Link></td></tr>)}</tbody></table></section><article><h3>{selected?"Editar usuário":"Novo usuário"}</h3>{selected && <Link href="/usuarios">Voltar para novo cadastro</Link>}<RegistryForm key={edit ?? "new"} kind="user" values={selected}/></article></div></main>;
}
