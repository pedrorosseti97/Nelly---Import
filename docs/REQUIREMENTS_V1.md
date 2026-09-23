# Requisitos funcionais consolidados — V1

Este arquivo registra as decisões funcionais já fechadas para orientar a implementação. A fundação técnica não altera essas regras.

## Objetivo e fluxo

Gerenciar o ciclo da importação da demanda ao encerramento: demanda, cotação, Proforma, aprovação, pagamento, produção, Commercial Invoice, embarque, trânsito, chegada ao porto, BL, desembaraço, transporte interno, encerramento bancário e finalização.

## Papéis

- **Administrador:** acesso integral; administra usuários; exclui demandas; reabre processos finalizados.
- **Operador:** consulta e opera processos; edita valores validados; substitui documentos ativos; altera fornecedor, Proforma e Commercial Invoice após aprovação, sempre com histórico. Não exclui demandas nem reabre processos.
- **Visitante:** consulta, filtra, visualiza e baixa documentos e relatórios; não altera, aprova ou movimenta processos.

Reabertura exige justificativa, usuário, data e hora. Alterações posteriores à validação ou aprovação preservam valor/documento anterior e novo registro.

## Bloqueios obrigatórios

- aprovação somente com Proforma ativa;
- embarque somente com Commercial Invoice ativa;
- desembaraço somente com BL ativo;
- encerramento somente após baixa bancária;
- registros e documentos substituídos nunca perdem o histórico;
- custos são consolidados em BRL e vinculados a centro de custo por fornecedor.

## Dados e módulos

Usuários; parceiros/fornecedores; demandas; cotações e simulações; Proformas; aprovações; Commercial Invoices; processos; pagamentos e câmbio; licenças; embarques e contêineres; BLs; despesas, impostos e taxas; desembaraço; transporte interno; documentos e versões; calendário, alertas e lembretes; encerramento bancário; auditoria; dashboard e relatório final.

## Alertas

Incluem risco de demurrage, processo sem movimentação por mais de três dias, licença/pagamento/documento pendente, ETA alterada, frete reajustado, exigência aduaneira ou fiscal, baixa bancária pendente e retorno de fornecedor. Chegadas geram marcos de 15, 10 e 5 dias.

## Dashboard da Diretoria

Cards: importações ativas, demandas abertas, itens aguardando aprovação, pagamentos pendentes, próximas chegadas, processos com alerta, valor total comprometido e custo real acumulado. Deve incluir previsto x realizado, timeline das operações, alertas, aprovações, pagamentos, demandas/cotações e calendário.

Filtros globais: período, processo, status, fornecedor, responsável, origem, tipo de operação/produto, modal, porto, alerta, situação e faixa de ETA. Busca por processo, fornecedor, produto, Proforma, Commercial Invoice ou BL.

O modo Diretoria privilegia: valor, status, prazo, risco e próxima ação.

## Relatório final

Resumo executivo, custo estimado e real, variação, câmbio, impostos e taxas, despesas logísticas, custo nacionalizado por item, data de chegada e conclusão da operação.

## Princípios de interface

Responsiva, em português, visual e adequada tanto à operação quanto à leitura executiva rápida.
