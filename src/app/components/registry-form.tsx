"use client";
import { useActionState } from "react";
import { savePartner, saveUser } from "../actions/registry";
type Values = Record<string,string|boolean>;
export function RegistryForm({kind, values = {}}:{kind:"partner"|"user";values?:Values}) {
  const [state,action,pending] = useActionState(kind==="partner" ? savePartner : saveUser,{});
  const input = (name:string,label:string,type="text",required=false) => <label key={name}>{label}<input name={name} type={type} required={required} defaultValue={String(values[name] ?? "")} autoComplete={type==="password"?"new-password":undefined}/></label>;
  return <form action={action} className="registry-form">
    <input type="hidden" name="id" value={String(values.id ?? "")}/>
    {kind==="partner" ? <>
      {input("legalName","Razão social","text",true)}{input("tradeName","Nome fantasia")}
      {input("taxId","CNPJ / identificação fiscal")}{input("countryCode","País (ex.: BR, CN)")}
      {input("email","E-mail","email")}{input("phone","Telefone")}
    </> : <>
      {input("name","Nome","text",true)}{input("email","E-mail","email",true)}
      <label>Perfil<select name="role" defaultValue={String(values.role ?? "VISITOR")}><option value="VISITOR">Visitante</option><option value="OPERATOR">Operador</option><option value="ADMIN">Administrador</option></select></label>
      {!values.id ? input("password","Senha inicial (mínimo 12 caracteres)","password",true) : <input name="password" type="hidden" value=""/>}
    </>}
    <label className="check"><input type="checkbox" name="active" defaultChecked={values.active !== false}/>Cadastro ativo</label>
    {state.error && <p className="error" role="alert">{state.error}</p>}
    {state.success && <p className="success" role="status">{state.success}</p>}
    <button disabled={pending}>{pending?"Salvando…":"Salvar cadastro"}</button>
  </form>;
}
