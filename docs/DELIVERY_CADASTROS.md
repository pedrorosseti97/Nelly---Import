# Entrega incremental: cadastros e execução local

Disponível: parceiros (criação, edição, ativação/inativação, busca, filtro e histórico),
usuários (criação, edição de nome/e-mail/perfil, ativação/inativação) e navegação com
totais reais. Visitantes consultam parceiros; operadores os mantêm; somente
administradores gerenciam usuários. Senhas nunca integram os registros de auditoria.
O administrador não pode retirar o próprio acesso. Alterações de perfil e
inativação passam a valer na próxima requisição autenticada.

Cada gravação e sua auditoria/versionamento ocorrem na mesma transação.
Testes de integração usam um banco SQLite temporário, sem dados reais.

O modo `pnpm local` dispensa Docker. SQLite é destinado à prévia local; o schema
PostgreSQL e suas migrations permanecem separados. Após gerar o cliente para um
banco, gere-o novamente antes de trocar de modo.

Verificação: `pnpm test`, `pnpm test:integration`, `pnpm lint`,
`pnpm typecheck`, `pnpm build`. A integração gera o cliente SQLite.

Ainda pendentes: recuperação/troca de senha, módulos operacionais, documentos,
financeiro, calendário, dashboard executivo e confronto com o pacote mestre
original completo. O resumo recuperado da conversa não substitui esse pacote.
