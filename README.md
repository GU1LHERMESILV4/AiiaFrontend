# Hub Financeiro Móvel — MVP

  ## Resumo

  Este repositório contém o frontend do "Hub Financeiro Móvel" — um MVP desenvolvido para hackathon com foco em controle financeiro em tempo real, extrato inteligente e integração de serviços: PIX, Cashback e Recarga. A proposta prioriza UX/UI atraente, acessibilidade (comando de voz) e personalização básica.

  ## Links

  - Protótipo Figma: https://www.figma.com/design/X9MHpdGBR9t5SYMl69ud0I/rascunho-projeto-Aiia
  - Referência do desafio: https://aiialabs.com.br/fmu-hackathon/

  ## Pré-requisitos

  - Node.js (versão compatível)
  - npm ou yarn

  ## Instalação e execução

  1. Instalar dependências:
     `npm i`
  2. Iniciar servidor de desenvolvimento:
     `npm run dev`

  ## Visão do MVP

  - Serviços integrados: PIX, Cashback, Recarga.
  - Extrato inteligente com categorização automática e edição manual.
  - Dashboard personalizado com saldo, cashback e acesso rápido.
  - Acessibilidade por comando de voz para iniciar transações.

  ## Regras de Negócio Principais (resumo)

  - RN001: Validar formato de chave PIX (CPF/CNPJ, e-mail, telefone ou aleatória) e confirmar nome do recebedor.
  - RN002: Permitir configuração de limites de transação (diário/noturno) respeitando limites legais.
  - RN003/RN004: Calcular, acumular e permitir resgate de cashback com valor mínimo para saque.
  - RN005: Identificar automaticamente operadora ao informar número para recarga.
  - RN006: Categorização automática das transações por heurísticas (nome, valor, frequência).
  - RN007: Atualização de saldo/extrato em tempo real após transações.
  - RN008: Suporte a comando de voz para iniciar/concluir transações (acessibilidade).

  ## Módulos e Funcionalidades (resumo)

  - PIX
    - Enviar/Receber (QR Code), Copia e Cola, Gerenciar favoritos.
  - Cashback
    - Visualizar saldo, Resgatar, Ofertas e parceiros.
  - Recarga
    - Recarga de celular (identificação de operadora), Recargas recorrentes e serviços extras.
  - Extrato Inteligente
    - Extrato detalhado, gráficos por categoria, busca/filtro, edição manual de categoria.
  - Personalização / UX
    - Dashboard personalizado, Modo escuro/claro, Linguagem simples, Comando de voz (ativação e processamento).

  ## Arquitetura e Diagramas

  - Modelos principais: Usuario, Conta, Transacao, PIX, Cashback, Recarga, Extrato, Personalizacao.
  - Diagramas UML (Casos de Uso, Classes, Sequência) documentam cenários como envio de PIX, resgate de cashback e transação por voz. (Diagramas completos disponíveis na documentação do projeto / anexos do hackathon.)

  ## Considerações de UX e Acessibilidade

  - Priorizar fluxos simples e claros, ícones e tipografia legíveis.
  - Alternância de temas (claro/escuro).
  - Comando de voz para garantir inclusão de usuários com deficiência visual.

  ## Como contribuir

  - Abrir issues para bugs e melhorias.
  - Propor PRs com descrição clara das mudanças e testes manuais/automatizados quando aplicável.
  - Seguir padrões de código do projeto e validar build antes de submeter PR.

  ## Tecnologias

  - Node.js (runtime) — gerencia pacotes e scripts (npm / yarn).
  - React (web) ou React Native (mobile) — biblioteca principal para UI.
  - TypeScript — tipagem estática opcional para maior robustez.
  - Vite ou Next.js — ferramenta/bundler para desenvolvimento rápido (Web) / framework (SSR).
  - Expo — fluxo recomendado para protótipos em React Native (mobile).
  - Tailwind CSS ou Styled Components — para estilização e temas (claro/escuro).
  - Axios / fetch API — para comunicação com APIs (PIX, Cashback, Recarga).
  - Web Speech API (web) / react-native-voice (mobile) — para comando/processamento de voz (RN008).
  - Jest + React Testing Library / Detox — testes unitários e e2e.
  - ESLint + Prettier — linting e formatação.
  - Git — controle de versão.

  ## Referências

  1. Informações do Desafio Hackathon FMU — https://aiialabs.com.br/fmu-hackathon/
  2. Protótipo Figma — link acima.
  3. Diretrizes do Banco Central sobre PIX.
  4. Boas práticas de UX/UI para apps financeiros.

