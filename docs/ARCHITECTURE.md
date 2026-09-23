# Arquitetura da V1

## Decisão

A V1 começa como um monólito modular em Next.js. Interface, operações do servidor e regras de aplicação vivem no mesmo produto implantável; PostgreSQL é a fonte de verdade. Isso reduz custo operacional e mantém fronteiras de domínio claras para uma futura separação, se o volume justificar.

## Componentes

- **Interface:** App Router, Server Components e Server Actions.
- **Domínio:** regras puras em `src/domain`, sem dependência de interface ou banco.
- **Aplicação:** casos de uso transacionais; toda mutação relevante grava auditoria e versão.
- **Persistência:** Prisma/PostgreSQL com valores financeiros em `Decimal`, datas em UTC e UUIDs.
- **Documentos:** o banco guarda metadados, versões, checksum e chave do objeto. O binário deverá ficar em storage S3 compatível; nenhum provedor foi imposto nesta fase.
- **Autenticação:** senha com bcrypt e sessão JWT assinada em cookie HTTP-only de oito horas.
- **Autorização:** permissões explícitas por papel, verificadas no servidor.

## Segurança e integridade

- segredos somente por variáveis de ambiente;
- autorização nunca depende apenas da interface;
- documentos substituídos continuam no histórico;
- exclusão funcional é lógica e auditável;
- ações administrativas exigem motivo quando aplicável;
- índice parcial garante só uma versão documental ativa;
- transições do processo são validadas no domínio antes da persistência.

## Limites desta entrega

Esta fundação não implementa ainda telas completas dos módulos, upload binário, notificações externas, extração de PDF por IA ou infraestrutura de produção. Ela estabelece os contratos, dados e bloqueios necessários para que esses módulos sejam adicionados incrementalmente sem redefinir a V1.

## Próxima sequência

1. CRUD de parceiros e usuários.
2. Demandas, cotações, Proformas e aprovação.
3. Conversão em processo e timeline operacional.
4. Financeiro, pagamentos, câmbio e centro de custo.
5. Licenças, logística, BL, desembaraço e transporte interno.
6. Alertas, calendário, encerramento, dashboard e relatório final.
