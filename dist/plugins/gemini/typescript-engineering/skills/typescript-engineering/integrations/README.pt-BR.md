# Plugins e integrações

O conteúdo original da skill continua sendo a única fonte mantida. O gerador cria pacotes independentes, com referências relativas completas, sem links simbólicos e sem duplicação manual. Os arquivos gerados ficam em `dist/plugins/`.

## Gerar

Para instalar diretamente a skill, use `node scripts/install-skill.mjs --target codex --project ../meu-app`, substituindo o caminho por um projeto existente. Destinos: codex, claude, copilot, cursor, antigravity, opencode e portable. Todas as referências são copiadas; instalações existentes são recusadas. A skill nativa do Codex não exige autoria de plugin. Para Gemini, use a extensão abaixo.

Para gerar os sete pacotes distribuíveis em uma pasta nova:

```sh
node scripts/package-plugins.mjs --targets claude,copilot,cursor,antigravity,opencode,gemini,portable --out dist/plugins-next
```

A geração de todos os destinos com `npm run package:plugins -- --out dist/plugins-next` exige também autoria aprovada em `package.json` ou `--author` para o plugin Codex. Consulte `node scripts/package-plugins.mjs --help`.

O diretório de saída precisa ser novo: use `--out dist/plugins-next` para outra geração. O comando não instala plugins, não altera perfis de usuário e não publica conteúdo. Preserve as pastas ocultas dos manifestos ao copiar ou compactar.

## Instalar e usar

Os comandos abaixo partem da raiz do repositório. Se recebeu um pacote separado, use o caminho real da pasta extraída.

| Ferramenta | Pacote | Ação |
| --- | --- | --- |
| Codex | Skill disponível; plugin ainda não gerado | Use o instalador de skill acima. Após informar autoria, gere o plugin e registre-o no marketplace escolhido antes de usar seu identificador real de instalação. |
| Claude Code | `dist/plugins/claude/typescript-engineering` | Teste na sessão: `claude --plugin-dir ./dist/plugins/claude/typescript-engineering`; invoque `/typescript-engineering:typescript-engineering`. |
| Copilot CLI | `dist/plugins/copilot/typescript-engineering` | `copilot plugin install ./dist/plugins/copilot/typescript-engineering`. |
| Cursor | `dist/plugins/cursor/typescript-engineering` | Copie a pasta inteira para `~/.cursor/plugins/local/` e confira Customize → Plugins. |
| Antigravity | `dist/plugins/antigravity/typescript-engineering` | Copie a pasta inteira para `.agents/plugins/` no projeto ou `~/.gemini/config/plugins/` globalmente. |
| OpenCode | `dist/plugins/opencode/typescript-engineering/.opencode/skills/typescript-engineering` | Copie esta pasta interna para `.opencode/skills/` no projeto de destino. |
| Gemini CLI | `dist/plugins/gemini/typescript-engineering` | `gemini extensions install ./dist/plugins/gemini/typescript-engineering`; reinicie a sessão. |
| Outros | `dist/plugins/portable/typescript-engineering/.agents/skills/typescript-engineering` | Copie a pasta interna para o local de skills documentado pelo assistente. |

No Copilot sem instalação de plugins, use a skill portátil em `.github/skills/typescript-engineering/`. No OpenCode, o pacote usa skills nativas; plugins JavaScript servem para extensões executáveis e não são necessários para estas instruções.

Depois da instalação, peça: “Use typescript-engineering para revisar esta alteração TypeScript e informe quais verificações executou.” Confira se a ferramenta descobriu a skill; gerar arquivos não comprova ativação no aplicativo.

Para atualizar, altere a fonte, gere em uma nova pasta, compare e use os controles de atualização/recarregamento da ferramenta. Para cópias manuais, substitua ou remova somente a pasta instalada deste pacote. Evite instalar a mesma skill por duas rotas no mesmo assistente.

Execute `npm run check:packages` no checkout fonte para detectar diferenças entre a fonte e os pacotes versionados. A skill instalada isoladamente não contém essa árvore de distribuição. Consulte [fontes](SOURCES.md) e [resultados reais](RESULTS.md). A licença ainda precisa ser escolhida antes da publicação. O gerador não inventa autoria nem concede permissões de distribuição.
