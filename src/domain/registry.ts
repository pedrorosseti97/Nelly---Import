import { z } from "zod";
export const partnerInput = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  legalName: z.string().trim().min(2, "Informe a razão social.").max(200),
  tradeName: z.string().trim().max(200),
  taxId: z.string().trim().max(60),
  countryCode: z.string().trim().refine(v => !v || /^[A-Za-z]{2}$/.test(v), "Use duas letras para o país, como BR ou CN.").transform(v => v.toUpperCase()),
  email: z.string().trim().toLowerCase().refine(v => !v || z.email().safeParse(v).success, "Informe um e-mail válido."),
  phone: z.string().trim().max(60),
  active: z.boolean(),
});
export const userInput = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  name: z.string().trim().min(2, "Informe o nome.").max(200),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido.")),
  role: z.enum(["ADMIN", "OPERATOR", "VISITOR"]),
  active: z.boolean(),
  password: z.string().max(72, "Senha deve ter no máximo 72 caracteres."),
}).superRefine((v, ctx) => {
  if (!v.id && v.password.length < 12) ctx.addIssue({code:"custom", message:"Use uma senha com pelo menos 12 caracteres.", path:["password"]});
  if (v.id && v.password) ctx.addIssue({code:"custom", message:"Alteração de senha não disponível neste formulário.", path:["password"]});
});
export const roleLabels = { ADMIN: "Administrador", OPERATOR: "Operador", VISITOR: "Visitante" };
