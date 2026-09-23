# Plano incremental

Cada fase deve terminar com testes das regras novas, revisão das permissões e auditoria das mutações.

| Fase | Entrega | Critério de saída |
|---|---|---|
| 0 | Fundação técnica | build, tipos, lint e testes verdes; migration reproduzível |
| 1 | Acesso e cadastros | usuários e parceiros com RBAC e auditoria |
| 2 | Demanda e cotação | simulação, Proforma versionada e aprovação bloqueada corretamente |
| 3 | Processo de importação | conversão e timeline sem saltos de etapa |
| 4 | Financeiro | pagamentos, câmbio, custos em BRL e centro de custo |
| 5 | Operação documental | Invoice, licenças, embarque, BL, desembaraço e transporte |
| 6 | Controle | alertas, calendário, ETA e ausência de movimentação |
| 7 | Fechamento | baixa bancária, relatório final e reabertura administrativa |
| 8 | Diretoria | dashboard, filtros, busca e modo executivo |

## Definição de pronto transversal

- regra implementada no servidor;
- permissão testada para os três papéis;
- mutações críticas auditadas e versionadas;
- mensagens em português;
- estados vazio, carregando e erro tratados;
- migration e documentação atualizadas.
