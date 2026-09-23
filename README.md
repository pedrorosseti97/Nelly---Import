# Nelly Import

Base técnica da V1 do sistema de gestão de importações da Antonelly.

## Stack

- Next.js 16 com App Router e TypeScript
- PostgreSQL com Prisma ORM
- Sessões próprias assinadas em cookie HTTP-only
- RBAC com os perfis `ADMIN`, `OPERATOR` e `VISITOR`
- Vitest para regras de domínio e bloqueios críticos

As decisões desta fundação estão em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e os requisitos consolidados em [`docs/REQUIREMENTS_V1.md`](docs/REQUIREMENTS_V1.md).

## Desenvolvimento local

### Sem Docker (prévia local)

Execute `pnpm local`. O comando gera o cliente SQLite, aplica as migrations locais,
cria o administrador se necessário e abre o servidor em http://localhost:3000.
Os dados persistem em `prisma/local/nelly.db` (ignorado pelo Git).
Login: `admin@nelly.local` / `ChangeMe123!`.
A chave de sessão é renovada ao reiniciar: basta entrar novamente.
Este modo usa SQLite para desenvolvimento; validações financeiras de precisão e
concorrência de produção devem continuar sendo verificadas no PostgreSQL.

### PostgreSQL

1. Copie `.env.example` para `.env`.
2. Inicie o PostgreSQL: `docker compose up -d db`.
3. Instale as dependências: `pnpm install`.
4. Aplique as migrations: `pnpm db:migrate`.
5. Crie o usuário inicial: `pnpm db:seed`.
6. Inicie: `pnpm dev`.

Credenciais locais do seed: `admin@nelly.local` / `ChangeMe123!`. Troque-as no primeiro acesso.

## Verificações

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Regras críticas já protegidas

- aprovação exige Proforma ativa;
- embarque exige Commercial Invoice ativa;
- desembaraço exige BL ativo;
- finalização exige baixa bancária;
- exclusão de demanda e reabertura são exclusivas do Administrador;
- alteração de registros críticos preserva versões e auditoria.
