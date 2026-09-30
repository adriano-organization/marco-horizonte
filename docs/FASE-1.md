# Fase 1 — Direção visual e dados

## Identidade atualizada — 30 de setembro de 2026

Logo e fotografias fornecidos pela marca integrados. Azul #1C3A7A e laranja #D3672E extraídos dos píxeis predominantes do logo raster; branco #FFFFFF. Manrope nos títulos e DM Sans no corpo. Fotografias de loja, linguagem direta, preços baixos e proximidade. Os filtros CSS tornam as fotografias mais vivas sem alterar os ficheiros originais.

| Variável | Hex | Uso |
|---|---|---|
| primaria | #1C3A7A | Marca e fundos azuis |
| secundaria / acento | #D3672E | Detalhes da marca |
| laranjaTexto | #AB4212 | Texto e botões acessíveis |
| neutro | #DFE5EF | Divisórias |
| fundo | #FFFFFF | Fundo |
| texto | #142B59 | Texto principal |
| muted | #52617B | Texto secundário |

Contrastes sobre branco: azul 10,85:1; laranja escuro 5,97:1; texto 13,82:1; secundário 6,26:1. Estes pares passam WCAG AA para texto normal. O laranja original fica reservado a detalhes gráficos. Não é uma auditoria WCAG integral.

Slogan: «Marco Horizonte, a fonte dos preços baixos». Nove lojas, incluindo Vila Boa de Quires. Serviços configurados por loja, sem atribuições inventadas. Dados públicos e fontes em `lojas.json`; horários de feriados, serviços e e-mails ainda precisam de confirmação. Só Boelhe dispõe de coordenadas verificadas. Ver README para limitações dos dados.

## Sitemap

- `/` — início, marca, folheto, nove lojas, serviços e contactos.
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
