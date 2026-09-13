# Continuação do produto — 11/09/2026

Objetivo: produto comercial completo, com experiência refinada e validação funcional e visual por etapa. Nenhuma etapa seguinte deve ser considerada liberada enquanto o gate anterior estiver pendente.

## Etapas e critérios de saída

1. **Revalidar a base existente e corrigir acesso. Em andamento, bloqueada no banco local.** Executar migrations, integração PostgreSQL e os fluxos e2e existentes; conferir desktop/mobile, estados de falha, teclado e acessibilidade. Build e checagem de tipos aprovados. Correções de acesso descritas abaixo validadas no navegador.
2. **Validar atendimento real. Pendente.** Conectar WhatsApp por QR, receber e enviar texto e mídia, verificar recibos, retomada da sessão, fila após desconexão, concorrência de atendentes e isolamento de empresas. Confirmar anexos grandes na origem de produção. Requer aparelho/número real; simulação não aprova este gate.
3. **Produtividade e supervisão. Pendente.** Completar o escopo do estágio 3 do ROADMAP: notificações, presença e conflitos, menções, campos personalizados, supervisão por departamento, métricas e exportações. Cada entrega precisa de persistência, permissões, estados vazios/erro e testes de uso. Busca por protocolo/conteúdo e retornos básicos já existem; avaliar a implementação antes de duplicar.
4. **Plataforma e automações. Pendente.** Fluxos versionados, administração da plataforma com acesso excepcional auditado, planos/limites/bloqueios, saúde operacional e retenção. Definir contratos explícitos e testar isolamento antes de expor controles.
5. **Acabamento integral. Pendente.** Revisar cada jornada em desktop/mobile e quatro temas; melhorar hierarquia, densidade, navegação e movimento contextual, respeitando redução de movimento. Preservar a marca aprovada; evitar que ilustração domine telas operacionais. Evidenciar ações reais, sem indicadores ou resultados inventados.
6. **Liberação comercial. Pendente.** E-mail operacional verificado, carga, monitoramento externo, restauração ensaiada, revisão de segurança, retenção e planos comerciais; todos os fluxos contratados aprovados. Publicação só recebe status de pronta após validação do ambiente publicado.

## Entrega validada nesta sessão

- Recuperação de senha aguarda a consulta de disponibilidade; em falha, oferece nova tentativa sem exibir formulário que aparenta estar operacional.
- Links sem token de convite/redefinição mostram orientação e caminho de recuperação.
- Navegação entre telas de autenticação reinicia sucesso e visibilidade da senha.
- Oito testes de navegador passaram, distribuídos entre desktop e mobile. As respostas HTTP desta suíte são **simuladas**; não validam envio de e-mail, autenticação real ou banco.
- Axe sem violações nos estados de erro e link incompleto examinados; capturas em `.impeccable/review/access-*.png` abertas para inspeção visual.
- Build dos dois aplicativos aprovado. Detector da alteração visual sem achados.

Reproduzir a suíte independente do banco:

```powershell
node node_modules/@playwright/test/cli.js test --config playwright.access.config.ts
npm.cmd run build
```

## Bloqueio reproduzido

`node scripts/local.mjs test` falha em `os.userInfo()` da dependência embedded-postgres, com `uv_os_get_passwd returned ENOMEM`. Diagnóstico direto do executável PostgreSQL instalado confirmou `pg_ctl: could not create restricted token: error code 87`. O ambiente restrito não oferece elevação nesta sessão. Não houve alteração de permissões nem uso de banco de produção para contornar o bloqueio. A tentativa de adaptar o launcher foi revertida, pois não resolveu a restrição.

Frontend iniciado em `http://127.0.0.1:5173/entrar`. Sem API/banco local, isso permite inspeção das telas públicas, mas não operação de ponta a ponta. O processo pode encerrar junto com a sessão.

**Estado final desta execução: entrega parcial; etapa 1 não aprovada integralmente; produto não liberado para comercialização.**
