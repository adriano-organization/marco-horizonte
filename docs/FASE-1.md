# Fase 1 — Direção visual e dados

## O que foi possível analisar

Os anexos (logo, screenshots do Instagram e PDF) não estavam disponíveis na conversa nem na pasta. Por isso, não foi extraída uma paleta do logo e não foi inferido o estilo do Instagram. A assinatura tipográfica e o símbolo M são provisórios, não uma reprodução da identidade oficial. A única informação factual utilizada foi a marca, a região e a lista das oito lojas fornecidas.

Direção proposta: verde profundo, lima, fotografia de mercado, títulos grandes, composição espaçosa, cantos assimétricos na imagem principal e entradas suaves. Manrope nos títulos e DM Sans no texto; ambas têm fallback sans-serif. A fotografia é ilustrativa, não retrata instalações ou produtos confirmados da rede.

Referências consultadas: [Sincro](https://sincro.es/en/us/), [Alejandro HA](https://alejandroha.com) e [AltaMed Foundation](https://altamedfoundation.org). Foram usadas como orientação editorial; não é uma reprodução das suas animações.

## Paleta provisória

| Variável CSS | Hex | Aplicação |
|---|---|---|
| `--primaria` | `#183D32` | títulos, botões e blocos escuros |
| `--secundaria` | `#D5EB67` | realce |
| `--acento` | `#D5EB67` | ações em superfícies escuras |
| `--neutro` | `#E5E6DF` | divisórias |
| `--fundo` | `#F7F8F2` | fundo principal |
| `--texto` | `#183D32` | texto |
| `--muted` | `#58665E` | texto secundário |
| `--branco` | `#FFFFFF` | texto em fundo verde |

Os valores editáveis estão em `data/config.json`, aplicados como variáveis CSS. Valores iniciais em CSS evitam mudanças de cor durante o carregamento.

Contrastes calculados: verde/fundo **11,22:1**; verde/lima **9,08:1**; branco/verde **11,98:1**; texto secundário/fundo **5,66:1**; texto secundário/superfície `#E9EDDF` **5,07:1**. Estes pares passam AA para texto normal. Não usar branco sobre lima. Esta verificação não equivale a uma auditoria WCAG integral; revalidar após aplicar a marca real.

## Sitemap

- `/` — início, marca, folheto, oito lojas, serviços e contactos.
- `/?pagina=lojas` — pesquisa, filtro e mapa.
- `/?loja=lousada` — página própria; a mesma estrutura serve os oito slugs.
- Folheto — diálogo a ocupar o ecrã, acessível a partir do início.

As rotas por query string funcionam num servidor estático sem regras de reescrita.

## Modelo de dados

`lojas.json` contém os oito registos completos. `null` significa desconhecido, nunca zero ou encerrado. `servicos: []` significa nenhum serviço confirmado. `fotos: []` significa que faltam fotografias. O estado aberto/fechado é derivado, não persistido.

Exemplo de preenchimento **fictício**, apenas para explicar o formato:

```json
{
  "id": "1",
  "nome": "Lousada",
  "slug": "lousada",
  "morada": "[A PREENCHER]",
  "coordenadas": {"lat": null, "lng": null},
  "telefone": "[A PREENCHER]",
  "email": "[A PREENCHER]",
  "horario": {
    "fuso": "Europe/Lisbon",
    "semana": {"0": [], "1": [["09:00", "13:00"], ["14:00", "19:00"]], "2": null, "3": null, "4": null, "5": null, "6": null},
    "excecoes": {"2026-12-25": [], "2026-12-24": [["09:00", "13:00"]]},
    "feriadosConfirmados": false
  },
  "servicos": [],
  "descricao": "A sua loja Marco Horizonte em Lousada.",
  "fotos": [],
  "confirmada": false
}
```

Dias: 0 domingo a 6 sábado. `[]` = encerrado; `null` = por confirmar; intervalos múltiplos = pausa; fim anterior ao início = atravessa a meia-noite. As exceções por data sobrepõem-se à semana, incluindo feriados locais e nacionais. Introduzir explicitamente todas as exceções relevantes; não há importação automática de calendários de feriados. `feriadosConfirmados` controla a nota de confirmação, não altera o horário semanal. O relógio usa Europe/Lisbon e respeita automaticamente a hora de verão. Atualiza o estado a cada minuto.

Fotos: objetos `{"src":"assets/lojas/lousada-1.jpg","alt":"Descrição real da fotografia"}`. Serviços: IDs do catálogo em config, apenas após confirmação. Coordenadas WGS84 numéricas; nunca usar 0,0 como placeholder. Os oito marcadores surgem automaticamente quando os oito pares reais forem introduzidos.
