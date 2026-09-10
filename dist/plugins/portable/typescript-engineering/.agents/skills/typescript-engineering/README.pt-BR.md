# TypeScript Engineering

**Engenharia TypeScript prática para o seu assistente de programação.**

![Exemplos TypeScript](https://img.shields.io/badge/exemplos-TypeScript_5.9.3-3178C6?logo=typescript&logoColor=white)
![Agent Skills](https://img.shields.io/badge/formato-Agent_Skills-5B21B6)
![Independente de framework](https://img.shields.io/badge/core-framework_independent-0F766E)

[English](README.md) · [Instalação](integrations/README.pt-BR.md) · [Exemplos](examples/README.md) · [Contribuições](CONTRIBUTING.md)

> Contratos claros. Entradas validadas. Arquitetura proporcional. Verificação com evidências.
>
> Uma única skill mantida para frontend, backend e bibliotecas. As referências opcionais são carregadas conforme a tarefa.

## Comece aqui

Na raiz deste repositório, instale a skill em um **projeto existente**:

```
node scripts/install-skill.mjs --target codex --project ../meu-app
```

Substitua `../meu-app` pelo caminho do seu projeto. Os destinos são `codex`, `claude`, `copilot`, `cursor`, `antigravity`, `opencode` e `portable`. O script usa Node.js 24, sem instalação de dependências. Ele copia a skill completa, preserva instruções existentes e recusa uma instalação que já exista. Configurações globais permanecem intactas.

Abra uma nova sessão do assistente no projeto e peça:

```
Use typescript-engineering para revisar esta alteração TypeScript.
Preserve a API pública, siga as convenções do projeto e informe o que verificou.
```

Confira se o assistente descobriu a skill e consegue abrir suas referências. A cópia dos arquivos, por si só, não comprova ativação no aplicativo.

<details>
<summary><strong>Prefere instalar como plugin ou extensão do Gemini CLI?</strong></summary>

Execute na raiz do repositório:

```
# Claude Code: carregar nesta sessão
claude --plugin-dir ./dist/plugins/claude/typescript-engineering

# Copilot CLI: instalar o plugin local
copilot plugin install ./dist/plugins/copilot/typescript-engineering

# Gemini CLI: instalar a extensão e reiniciar
gemini extensions install ./dist/plugins/gemini/typescript-engineering
```

No Claude Code, invoque `/typescript-engineering:typescript-engineering`. Consulte o [guia por plataforma](integrations/README.pt-BR.md) para Cursor, Antigravity, atualização e remoção. Escolha uma rota por ferramenta para evitar duplicatas.

</details>

## Escolha seu assistente

| Assistente | Rota disponível | Local da skill no projeto |
| --- | --- | --- |
| **Codex** | Skill nativa disponível; plugin aguarda autoria aprovada | `.agents/skills/typescript-engineering/` |
| **Claude Code** | Plugin ou skill nativa | `.claude/skills/typescript-engineering/` |
| **GitHub Copilot** | Plugin no CLI; skill nas interfaces com suporte | `.github/skills/typescript-engineering/` |
| **Cursor** | Plugin ou skill nativa | `.cursor/skills/typescript-engineering/` |
| **Antigravity** | Plugin ou skill nativa | `.agents/skills/typescript-engineering/` |
| **OpenCode** | Skill nativa; dispensa plugin JavaScript | `.opencode/skills/typescript-engineering/` |
| **Gemini CLI** | Extensão contendo a skill | Comando de extensão acima |
| **Outros assistentes** | Agent Skills ou anexação manual | Consulte a documentação da ferramenta |

**Estado da verificação:** testes automatizados de empacotamento e instalação passaram. O validador do Claude aprovou o manifesto com aviso de autoria. Sessões nativas com modelos nessas ferramentas não foram testadas. Veja os [resultados reais](integrations/RESULTS.md).

## O que a skill orienta

| Área | Comportamento esperado |
| --- | --- |
| **Tipos e contratos** | Inferência útil, narrowing, unions discriminadas e generics com propósito. |
| **Entradas e segurança** | Validação em execução, autorização por recurso e proteção de dados sensíveis. |
| **Configuração e módulos** | Versões instaladas e alinhamento entre TypeScript, ESM/CommonJS, runtime e build. |
| **Arquitetura e UI** | Convenções existentes, responsabilidades coesas, composição e estados explícitos. |
| **Performance** | Separação entre execução e compilação; medição antes de afirmar ganhos. |
| **Verificação** | Testes relevantes e registro exato do que foi executado e do que continua incerto. |

A IA diferencia comportamento da linguagem, recomendação contextual e convenção do projeto. As instruções estão em inglês; a resposta segue o idioma do usuário. Uma alteração pequena deve continuar pequena.

## Como funciona

1. **Entender:** requisitos, código, versões e restrições.
2. **Consultar:** apenas as referências pertinentes à tarefa.
3. **Implementar:** a solução mais simples que atende ao contrato.
4. **Revisar:** entradas inválidas, estados ausentes, autorização e complexidade desnecessária.
5. **Verificar:** executar checks disponíveis, corrigir problemas e relatar evidências e limites.

A ferramenta descobre a skill pelo nome e pela descrição. A invocação explícita ajuda quando a seleção automática não acontece. Este fluxo especializado não exige hook de início de sessão, servidor MCP ou subagentes.

## Experimente estes pedidos

```
Valide esta resposta unknown da API antes do cálculo de cobrança.
Melhore este any legado sem habilitar strict em todo o projeto de uma vez.
Investigue este erro ESM/CommonJS com as versões instaladas.
Revise esta tabela reutilizável: quais props representam responsabilidades distintas?
O endpoint está lento. Proponha medições antes de alterar a implementação.
```

Os [exemplos executáveis](examples/README.md) mostram validação, autorização por proprietário e tenant, erros e contratos públicos de tipos. Os [oito cenários de avaliação](evaluations/scenarios.md) exercitam decisões em situações reais.

## Organização do repositório

```
SKILL.md                  Instruções centrais — fonte mantida
references/               Guias temáticos e registro de fontes
examples/                 Exemplo completo e testes de comportamento/tipos
evaluations/              Cenários e observações registradas
integrations/             Formatos, instalação, análise e verificação
scripts/                  Validação, instalação no projeto e empacotamento
tests/                    Testes de empacotamento e instalação
dist/plugins/             Cópias distribuíveis versionáveis, geradas da fonte
```

Edite a fonte, não cada cópia distribuível. Consulte as [fontes das plataformas](integrations/SOURCES.md) ao atualizar integrações.

## Verificar e manter

```
npm ci --ignore-scripts
npm run validate
npm run typecheck
npm test
npm run test:packaging
npm run check:packages
```

No PowerShell com execução de scripts desabilitada, use `npm.cmd`. `npm test` compila o exemplo e testa comportamento; a checagem de tipos inclui contratos negativos. `check:packages` detecta cópias desatualizadas ou recursos distribuídos alterados.

Para gerar uma distribuição nova sem autoria:

```
node scripts/package-plugins.mjs --targets claude,copilot,cursor,antigravity,opencode,gemini,portable --out dist/plugins-next
```

O gerador recusa uma saída já existente. Revise os artefatos antes de substituir `dist/plugins/`. A pasta `dist/plugins-next/` continua ignorada; `dist/plugins/` está liberada no Git. O plugin Codex exige também `--author` aprovado pelo responsável; a skill nativa no Codex independe desse campo.

## Solução de problemas

| Sintoma | O que conferir |
| --- | --- |
| A skill não aparece | Caminho do projeto, nova sessão e configurações/políticas da ferramenta. |
| As referências não abrem | Copie a pasta completa, não apenas `SKILL.md`. |
| A skill aparece duplicada | Mantenha uma rota de instalação por ferramenta/projeto. |
| O instalador recusa a pasta | Revise a instalação existente antes de substituí-la. |
| O check aponta arquivos desatualizados | Gere novamente da fonte atual e revise os pacotes. |
| Não há navegador ou terminal | Anexe instruções e referências; registre testes como não executados. |

## Contribuições e limites

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para contribuir, atualizar fontes e avaliar mudanças. Referências oficiais de TypeScript, runtimes e segurança estão no [registro de fontes](references/sources.md), com data de consulta.

A skill não substitui auditoria de segurança nem garante correção absoluta. O exemplo não inclui integração de produção com HTTP, banco ou provedor de identidade. Não houve publicação externa nem inclusão em marketplaces públicos. **A licença de distribuição deve ser escolhida pelo responsável antes da publicação para a comunidade.**
