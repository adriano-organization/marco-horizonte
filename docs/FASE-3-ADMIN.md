# Fase 3 — Folheto e painel futuro

## Folheto integrado

PDF.js 4.10.38 e StPageFlip 2.0.7 por CDN, carregados apenas ao abrir o visualizador. Botões, teclado, swipe nativo da biblioteca, zoom, modo de ecrã inteiro e download. Em ecrãs estreitos o livro apresenta uma página; em ecrãs largos apresenta duas. O modo de movimento reduzido elimina a animação programática de virar e as animações do site. O PDF original é disponibilizado como alternativa ao canvas; a acessibilidade do conteúdo depende também de o PDF oficial conter texto e etiquetas.

O PDF real está configurado como `data/folheto.pdf`, mas não existe porque o anexo não foi recebido. Datas nulas, futuras ou expiradas tornam o folheto indisponível. A validade é inclusiva, em Europe/Lisbon. A demonstração tem um botão separado e não tem validade comercial. Para ativar o real:

```json
{
  "caminho": "data/folheto.pdf",
  "inicio": "2026-10-01",
  "fim": "2026-10-07",
  "titulo": "Folheto da semana",
  "exemplo": false,
  "demo": null
}
```

Datas acima são um exemplo, não uma campanha confirmada. O exemplo incluído tem quatro páginas sem produtos ou preços. O visualizador renderiza sequencialmente as páginas quando aberto; adequado a folhetos curtos. Para PDFs extensos, implementar cache limitada e renderização por proximidade da página atual. O servidor estático não arquiva ficheiros: a expiração apenas impede a abertura do folheto real pelo botão; o arquivo automático pertence ao painel.

Documentação: [PDF.js](https://mozilla.github.io/pdf.js/examples/) e [StPageFlip](https://nodlik.github.io/StPageFlip/).

## Recomendação: Next.js + Supabase

Proposta técnica para uma fase futura, não implementada neste protótipo.

| Opção | Vantagens | Custos e limites |
|---|---|---|
| Next.js + Supabase | Edição à medida, PostgreSQL, autenticação e armazenamento integráveis; páginas e metadados renderizados no servidor | Exige desenvolver e manter o painel, permissões e tarefas agendadas |
| Directus + front-end | Painel editorial, biblioteca de ficheiros e coleções prontos; modelação visual | Personalizações específicas de horários/pré-visualização e operação do CMS; rever termos e custos do serviço escolhido |

Recomendo Next.js + Supabase se o objetivo for um painel simples desenhado especificamente para esta equipa. Directus é uma alternativa se a prioridade for reduzir desenvolvimento de formulários administrativos.

Base documental: [metadados em Next.js](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [permissões de ficheiros Supabase](https://supabase.com/docs/guides/storage/security/access-control), [coleções Directus](https://docs.directus.io/app/data-model/collections), [biblioteca de ficheiros Directus](https://docs.directus.io/user-guide/file-library/files). A recomendação e as comparações de esforço são avaliação técnica para este projeto.

## Implementação proposta

1. **Login:** contas por convite, recuperação de acesso, perfis administrador/editor, sessão segura e ações de escrita verificadas no servidor. RLS em tabelas e Storage. A chave de serviço nunca vai para o navegador.
2. **Dados:** `stores`, `store_hours`, `store_exceptions`, `services`, `store_services`, `store_photos`, `leaflets`, `site_config`, `audit_log`. IDs estáveis e slugs únicos; rascunho/publicado; ordem explícita de fotografias. Validar coordenadas, contactos e intervalos, rejeitar sobreposições.
3. **CRUD de lojas:** contactos, morada, ponto no mapa, horários por dia, pausas, exceções por data, serviços confirmados e fotos com texto alternativo. Ocultar lojas por estado, preservando histórico.
4. **Folhetos:** upload autenticado, extensão/MIME/cabeçalho PDF e limite de tamanho; validar início ≤ fim e impedir campanhas sobrepostas. Guardar ficheiro versionado, autor e estado. Miniatura gerada fora do pedido de publicação.
5. **Publicação:** pré-visualização autenticada de rascunhos; confirmar publicação na interface. Apenas registos publicados são públicos. Revalidar páginas e exportar JSON com o mesmo contrato durante a migração.
6. **Arquivo:** tarefa diária e à mudança de validade marca expirados como `archived` em Europe/Lisbon. Não apaga o PDF. A consulta pública aplica sempre o intervalo de datas, mesmo se a tarefa falhar. Guardar logs, alertar falhas e permitir restauro.
7. **Operação:** cópias de segurança de dados e ficheiros, histórico de edições, monitorização, testes de permissões e de limites de data. Testar recuperação antes de colocar em produção.

## Checklist de substituição

- [ ] Logo oficial em SVG/PNG, `marca.logo`, cores extraídas e nova medição de contraste.
- [ ] Rever textos com os screenshots do Instagram e aprovação da marca.
- [ ] Fotografias próprias com direitos e textos alternativos; substituir fotografia ilustrativa.
- [ ] Moradas, lat/lng, telefones e emails das oito lojas.
- [ ] Horário de todos os dias, pausas, exceções e feriados; confirmar os indicadores.
- [ ] Apenas serviços efetivamente confirmados por loja.
- [ ] Contactos gerais e ligação oficial do Instagram.
- [ ] PDF real, título, início e fim; remover `demo` quando não for necessário.
- [ ] Domínio `seo.siteUrl` e imagem social `seo.imagem` absolutos/resolúveis.
- [ ] Remover `noindex,nofollow` só depois de rever o conteúdo de produção.
- [ ] Testar leitor de ecrã, teclado, PDF acessível, telemóveis reais, CDN indisponível e datas limite.

## SEO: limite do protótipo estático

Título, descrição, Open Graph e GroceryStore são produzidos pelos JSON em JavaScript. Não são garantidos para crawlers de redes sociais que não executam JS. No site de produção, renderizar estes metadados por rota no servidor (ou gerar páginas HTML estáticas durante a publicação do painel), com canonical e sitemap. Isso mantém os dados como fonte única. Não publicar dados fictícios em schema; aqui, os campos desconhecidos são omitidos.
