# Correção de remoção e novo QR

## Diagnóstico no código

A rota DELETE apaga `whatsapp_connections`, porém as chaves estrangeiras de `conversations` e `messages` impediam a exclusão de uma conexão com histórico. O tratamento global traduz a violação para a mensagem genérica vista na captura. Não foi possível consultar os logs de produção nesta sessão para confirmar a ocorrência específica.

Além disso, `reconnect` reutilizava as chaves de uma sessão que o WhatsApp já havia rejeitado.

## Alterações

- Migration 009 permite remover a referência à sessão mantendo mensagens, conversas e empresa. Somente `whatsapp_connection_id` recebe NULL; `tenant_id` permanece obrigatório. Esse uso de lista de colunas em SET NULL está documentado no [PostgreSQL](https://www.postgresql.org/docs/18/ddl-constraints.html).
- Remoção marca mensagens ainda na fila como falhas; mensagens em envio ficam sem confirmação. Elas não são transferidas automaticamente para outro número.
- Novas respostas para atendimentos cuja conexão foi removida recebem erro específico, sem entrar em uma fila que nunca enviaria. Notas internas continuam permitidas.
- Reconectar após logout/sessão inválida/recusa apaga somente as chaves de autenticação e inicia o pareamento novamente, preservando o vínculo do histórico.
- Teste de regressão cobre histórico, isolamento, fila, limpeza das chaves, novo pareamento e liberação do limite de números.

## Validação e publicação

Typecheck e build aprovados. O teste PostgreSQL foi escrito, mas não executado: banco local bloqueado pelo ambiente; CLI Railway retorna `Unable to get home directory`; conector Railway rejeita chamadas porque requer aprovação e a política desta sessão é `never`. O usuário autorizou expressamente conectar localhost ao banco de produção, mas a ferramenta não permitiu obter as configurações.

**Correção ainda não aplicada ao banco de produção nem publicada.** Executar a suíte de integração em banco isolado, aplicar migration 009 e publicar a API antes de validar remoção/QR com o aparelho real. O script `scripts/with-db.mjs` exige túnel ativo em 15432; essa porta não estava disponível nesta sessão. Não iniciar esse script supondo que o túnel existe.

## Tentativa de publicação autorizada

Frontend publicado na Vercel em 11/09/2026: deployment `dpl_3Ens4XnoKKfUAyKcU9jMjVnYz8AT`, estado `READY`, alias `https://caju-one.vercel.app`. Inclui as correções das telas de acesso.

API e migration 009 continuam pendentes: `node scripts/release.mjs --api` passou typecheck/build, mas falhou ao consultar as variáveis Railway com `Unable to get home directory`, antes de qualquer alteração remota. O frontend publicado não contém a correção de backend do WhatsApp.
