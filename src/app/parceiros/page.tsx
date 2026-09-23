import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { readSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "../components/header";
import { RegistryForm } from "../components/registry-form";
export default async function Partners({searchParams}:{searchParams:Promise<{q?:string; edit?:string; status?:string}>}) {
  const session = await readSession(); if (!session) redirect("/login");
  const {q="",edit,status=""} = await searchParams;
  const where = { ...(q ? {OR:[{legalName:{contains:q}},{tradeName:{contains:q}},{taxId:{contains:q}}]} : {}), ...(status ? {active:status==="active"} : {}) };
  const partners = await db.partner.findMany({where,orderBy:{legalName:"asc"},take:100});
  const selected = edit ? await db.partner.findUnique({where:{id:edit}}) : null;
  if(edit && !selected) notFound();
  const values = selected ? Object.fromEntries(Object.entries(selected).filter(([k])=>!["createdAt","updatedAt"].includes(k)).map(([k,v])=>[k,v ?? ""])) as Record<string,string|boolean> : undefined;
  const history = edit ? await db.auditEvent.findMany({where:{entityType:"Partner",entityId:edit},include:{actor:{select:{name:true}}},orderBy:{occurredAt:"desc"},take:10}) : [];
  return <main><Header session={session}/><section className="section-heading"><p className="eyebrow">Cadastros</p><h2>Parceiros e fornecedores</h2><p>Organize os contatos de cada operação.</p></section>
    <form className="filters"><input aria-label="Buscar parceiros" name="q" placeholder="Razão social, nome ou documento" defaultValue={q}/><select name="status" aria-label="Situação" defaultValue={status}><option value="">Todos</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select><button>Buscar</button><Link href="/parceiros">Limpar</Link></form>
    <div className="workspace"><section><div className="table-wrap"><table><thead><tr><th>Parceiro</th><th>País</th><th>Contato</th><th>Situação</th><th>Ação</th></tr></thead><tbody>{partners.map(p=><tr key={p.id}><td>{p.legalName}<small>{p.tradeName || p.taxId}</small></td><td>{p.countryCode || "—"}</td><td>{p.email || p.phone || "—"}</td><td>{p.active?"Ativo":"Inativo"}</td><td><Link href={"/parceiros?edit="+p.id}>{session.role==="VISITOR"?"Ver histórico":"Editar"}</Link></td></tr>)}</tbody></table>{!partners.length && <p className="empty">Nenhum parceiro encontrado.</p>}</div><p className="muted">Até 100 resultados. Use a busca para refinar.</p>
    {edit && <article><h3>Histórico recente</h3>{history.length ? history.map(h=><p key={h.id}>{h.action==="CREATE"?"Cadastro criado":"Cadastro atualizado"} · {h.actor?.name ?? "Sistema"} · {h.occurredAt.toLocaleString("pt-BR",{timeZone:"America/Manaus"})}</p>) : <p>Nenhuma alteração registrada.</p>}</article>}
    </section>{session.role!=="VISITOR" && <article><h3>{selected?"Editar parceiro":"Novo parceiro"}</h3>{selected && <Link href="/parceiros">Voltar para novo cadastro</Link>}<RegistryForm key={edit ?? "new"} kind="partner" values={values}/></article>}</div></main>;
}
