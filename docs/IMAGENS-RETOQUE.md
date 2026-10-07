# Retoque editorial das fotografias fornecidas — 07/10/2026

## Decisão e uso

As três imagens finais são **reconstruções / retoques editoriais com IA a partir de fotografias reais fornecidas pela marca**. Não são fotografias inalteradas, não representam ofertas atuais e não devem ser atribuídas a uma loja específica sem confirmação da marca.

Legenda recomendada na galeria: **Tratamento ilustrativo a partir de fotografias fornecidas pela marca.**

Usar os JPEG finais no site. Os PNG nativos finais são guardados para arquivo. Os ficheiros originais `assets/interior-loja.png`, `assets/fruta-loja.png` e `assets/garrafeira-loja.png` permanecem intactos.

## Ferramenta e processo

Modo: **built-in edit**, ferramenta nativa `image_gen.imagegen`, pela skill `imagegen`. Cada fotografia foi inspecionada localmente antes da edição e enviada como alvo explícito através de `referenced_image_paths`; `transparent_background=false`. Não se usou CLI, API key, edição manual de píxeis, remoção de elementos através de Python nem fotografias novas para substituir os interiores reais.

Houve duas rondas, uma chamada por fotografia em cada ronda. A primeira pretendia preservar todo o texto comercial e foi rejeitada por alterar preços/rótulos. A única iteração seguinte tornou os cartões comerciais existentes deliberadamente ilegíveis, mantendo as folhas, sombras e cores no mesmo local. Esta segunda ronda foi aprovada apenas como tratamento editorial ilustrativo. Não há preços inventados legíveis nas versões finais.

Depois da inspeção visual dos resultados, os PNG aprovados foram copiados para o projeto e convertidos para JPEG com qualidade 88, sem recorte nem alteração adicional de píxeis. Os resultados rejeitados não foram integrados no site e continuam no diretório original da ferramenta.

## Ficheiros finais

| Fotografia | Original | Final | JPEG (bytes) | PNG (bytes) |
|---|---:|---:|---:|---:|
| interior | 816 × 574 | 1495 × 1052 | 574 058 | 2 397 175 |
| fruta | 892 × 556 | 1589 × 990 | 655 638 | 2 759 560 |
| garrafeira | 888 × 628 | 1491 × 1055 | 480 986 | 2 023 679 |

- JPEG: `assets/interior-retocada-v3.jpg`; PNG nativo: `assets/interior-retocada-v3.png`.
- JPEG: `assets/fruta-retocada-v3.jpg`; PNG nativo: `assets/fruta-retocada-v3.png`.
- JPEG: `assets/garrafeira-retocada-v3.jpg`; PNG nativo: `assets/garrafeira-retocada-v3.png`.

## Inspeção visual e invariantes

- Interior: conserva o corredor, prateleiras laterais, grupos de garrafas e mercearia, água empilhada, frigorífico ao fundo, piso, teto e iluminação. Foram retirados a seta sobreposta, os pontos inferiores e a borda de interface.
- Fruta: conserva a parede de granito, banca, disposição dos grupos de fruta, caixas, grades, estrutura metálica, toldo e espaço exterior. Foram retiradas as duas setas de interface. Folhetos e cartões físicos mantêm-se, com informação comercial ilegível.
- Garrafeira: conserva mobiliário preto e madeira, ilhas de exposição, grupos de garrafas e caixas, parede, chão e luzes. Foi retirada a seta de interface. Os cabeçalhos reais **VINHO DO PORTO**, **DOURO**, **ALENTEJO** e **VINHO VERDE** foram preservados.
- Os espaços são reconhecivelmente os das referências. A IA pode reinterpretar pequenos detalhes das embalagens; por isso a legenda editorial é obrigatória na utilização destas versões. As imagens não documentam inventário, identidade fina de produtos, preços nem promoções.
- Nenhuma das imagens foi usada para confirmar moradas, coordenadas ou atribuição a um estabelecimento individual.

## Resultados rejeitados

A primeira versão da fruta alterou valores legíveis dos cartões frontais para `1,50 €`, em vez dos diferentes valores presentes na referência. A primeira versão do interior reinterpretou pelo menos um cartão de preço. A versão inicial da garrafeira reconstruiu tipografia fina de embalagens. Estes resultados foram rejeitados para impedir que uma edição fosse apresentada como fotografia comercial fiel.

- interior: `/Users/adrianocouto/.codex/generated_images/01a11273-b1b9-76c0-9908-2428084fffbd/exec-6b73a47c-81a9-43d0-b085-859e13b33d15.png`.
- fruta: `/Users/adrianocouto/.codex/generated_images/01a11273-b1b9-76c0-9908-2428084fffbd/exec-495119e3-4c7f-4464-b40c-17615205fe50.png`.
- garrafeira: `/Users/adrianocouto/.codex/generated_images/01a11273-b1b9-76c0-9908-2428084fffbd/exec-3ffd3424-0b0e-4e1c-a480-2ee6a33cf80c.png`.

## Origens nativas dos finais aprovados

- interior: `/Users/adrianocouto/.codex/generated_images/01a11273-b1b9-76c0-9908-2428084fffbd/exec-b75fdb20-d263-4c48-af09-0e7974a25b10.png`.
- fruta: `/Users/adrianocouto/.codex/generated_images/01a11273-b1b9-76c0-9908-2428084fffbd/exec-07ebfc74-0658-45bd-96ee-39e442e2e457.png`.
- garrafeira: `/Users/adrianocouto/.codex/generated_images/01a11273-b1b9-76c0-9908-2428084fffbd/exec-b4991c0f-4292-43f0-b805-ba52a3626bbe.png`.

## Prompts exatos — primeira ronda rejeitada

### interior

Alvo: `/Users/adrianocouto/Faculdade/sites/marco-horizonte/assets/interior-loja.png`.

```text
Use case: precise-object-edit. Asset type: editorial website photograph for Marco Horizonte supermarkets. Input image: the attached image is the EDIT TARGET, a real supplied photograph, not inspiration. Primary request: perform a conservative faithful retouch of this exact photograph. Remove only the embedded carousel interface: the white circular right arrow over the shelf, the navigation dots along the bottom, and the thin blue bottom border. Correct exposure and white balance subtly, lift dark shelves slightly, reduce mild compression noise and apply very restrained natural sharpness. Preserve the original landscape framing and perspective; no extension or outpainting. Invariants: preserve the exact real store aisle, all shelves and their arrangement, bottles on the left, grocery packages on the right, stacked water bottles, the refrigerator and background, ceiling lamps, fixtures, floor and product placement. Preserve existing labels and price cards as close to the source as possible, including their softness; do not reconstruct, sharpen, rewrite or invent any text, price, brand, label, product or signage. Do not remove price cards. Do not stylize, modernize, remodel, add objects or generate a new supermarket. The result must still visibly be the same archival brand photo with only interface removal and subtle photographic finishing. Opaque background.
```

### fruta

Alvo: `/Users/adrianocouto/Faculdade/sites/marco-horizonte/assets/fruta-loja.png`.

```text
Use case: precise-object-edit. Asset type: editorial website photograph for Marco Horizonte supermarkets. Input image: the attached image is the EDIT TARGET, a real supplied photograph, not inspiration. Primary request: perform a conservative faithful retouch of this exact photograph. Remove only the two embedded white circular carousel arrows at the left and right edges. Correct exposure and white balance subtly, recover bright highlights a little, improve natural fruit colors gently and reduce mild compression noise. Preserve the original landscape framing and perspective; no extension or outpainting. Invariants: preserve the actual outdoor fruit stand, granite wall, original paper leaflets and price cards, cardboard boxes, pears, red and green apples, oranges, crates and metal stands; keep the trees, entrance, awning and street details in their real positions. Preserve existing labels and price cards as close to the source as possible, including their softness; do not reconstruct, sharpen, rewrite or invent any text, price, brand, label, product or signage. Do not remove price cards. Do not add fruit, products, people, new signs or fixtures. Do not stylize, modernize, remodel or generate a different stall. The result must still visibly be the same archival brand photo with only interface removal and subtle photographic finishing. Opaque background.
```

### garrafeira

Alvo: `/Users/adrianocouto/Faculdade/sites/marco-horizonte/assets/garrafeira-loja.png`.

```text
Use case: precise-object-edit. Asset type: editorial website photograph for Marco Horizonte supermarkets. Input image: the attached image is the EDIT TARGET, a real supplied photograph, not inspiration. Primary request: perform a conservative faithful retouch of this exact photograph. Remove only the embedded white circular carousel arrow at the right edge over the bottles. Correct exposure and white balance subtly, reduce yellow cast moderately, lift dark cabinets a little and reduce mild compression noise. Preserve the original landscape framing and perspective; no extension or outpainting. Invariants: preserve the exact real wine area, all black and wood shelving, foreground display islands, every bottle group and gift box in their actual positions, gray walls, ceiling lamps, exit sign and floor. Existing shelf category headings must stay verbatim as visible in the source: VINHO DO PORTO, DOURO, ALENTEJO, VINHO VERDE. Preserve all other existing product labels and price cards as close to the source as possible, including their softness; do not reconstruct, sharpen, rewrite or invent text, prices, brands or signs. Do not remove price cards. Do not add wine, products, people, new signs or fixtures. Do not stylize, modernize, remodel or generate a different wine shop. The result must still visibly be the same archival brand photo with only interface removal and subtle photographic finishing. Opaque background.
```

## Prompts exatos — última ronda editorial aprovada

### interior

Alvo: `/Users/adrianocouto/Faculdade/sites/marco-horizonte/assets/interior-loja.png`.

```text
Use case: precise-object-edit. Asset type: illustrative editorial retouch of a real supplied archival Marco Horizonte store photograph for a website gallery. Input image is the EDIT TARGET; reproduce this exact camera view and scene faithfully. This is a very conservative localized edit. Remove only embedded carousel UI arrows, any navigation dots and screenshot border. Apply subtle natural exposure and white balance correction. IMPORTANT commercial text rule: render every existing price card, shelf price strip and promotional leaflet as the SAME physical paper/sign in its exact location and size but with deliberately soft, indistinct low-contrast markings so that no price, number or promotional wording can be read. Preserve the paper shapes, shadows and original color patches; do not replace them with new offers or new text. Keep product packaging visually close to the original with labels soft as in the reference; do not reconstruct fine type or invent readable brands/logos. No legible prices anywhere. Preserve the actual fixtures, floor, walls, lighting, architectural layout, product groups, quantities and exact arrangement. No new products, people, decor, signage, shelf, crate, cabinet or architecture. Preserve the original landscape framing and perspective, no outpainting, no redesign, no glamorized new store. Output should be visibly the same source photograph with localized UI cleanup, subtle tonal finishing and non-readable archival commercial details. Opaque background. Scene invariants: wine bottles on the left shelving, grocery and pasta packets on the right shelving, stacked water bottles at bottom left, the narrow aisle and original refrigerator in back. Remove the single white circle right arrow, bottom carousel dots and thin blue border.
```

### fruta

Alvo: `/Users/adrianocouto/Faculdade/sites/marco-horizonte/assets/fruta-loja.png`.

```text
Use case: precise-object-edit. Asset type: illustrative editorial retouch of a real supplied archival Marco Horizonte store photograph for a website gallery. Input image is the EDIT TARGET; reproduce this exact camera view and scene faithfully. This is a very conservative localized edit. Remove only embedded carousel UI arrows, any navigation dots and screenshot border. Apply subtle natural exposure and white balance correction. IMPORTANT commercial text rule: render every existing price card, shelf price strip and promotional leaflet as the SAME physical paper/sign in its exact location and size but with deliberately soft, indistinct low-contrast markings so that no price, number or promotional wording can be read. Preserve the paper shapes, shadows and original color patches; do not replace them with new offers or new text. Keep product packaging visually close to the original with labels soft as in the reference; do not reconstruct fine type or invent readable brands/logos. No legible prices anywhere. Preserve the actual fixtures, floor, walls, lighting, architectural layout, product groups, quantities and exact arrangement. No new products, people, decor, signage, shelf, crate, cabinet or architecture. Preserve the original landscape framing and perspective, no outpainting, no redesign, no glamorized new store. Output should be visibly the same source photograph with localized UI cleanup, subtle tonal finishing and non-readable archival commercial details. Opaque background. Scene invariants: same granite wall and wall-mounted leaflets (deliberately unreadable), exact original outdoor fruit display with pears left, red and green apples center, oranges right, cardboard fruit boxes at rear, plastic crates and metal stands, tree-lined street and awning at right. Keep all original price cards physically present but deliberately unreadable. Remove the white circle arrow at each side.
```

### garrafeira

Alvo: `/Users/adrianocouto/Faculdade/sites/marco-horizonte/assets/garrafeira-loja.png`.

```text
Use case: precise-object-edit. Asset type: illustrative editorial retouch of a real supplied archival Marco Horizonte store photograph for a website gallery. Input image is the EDIT TARGET; reproduce this exact camera view and scene faithfully. This is a very conservative localized edit. Remove only embedded carousel UI arrows, any navigation dots and screenshot border. Apply subtle natural exposure and white balance correction. IMPORTANT commercial text rule: render every existing price card, shelf price strip and promotional leaflet as the SAME physical paper/sign in its exact location and size but with deliberately soft, indistinct low-contrast markings so that no price, number or promotional wording can be read. Preserve the paper shapes, shadows and original color patches; do not replace them with new offers or new text. Keep product packaging visually close to the original with labels soft as in the reference; do not reconstruct fine type or invent readable brands/logos. No legible prices anywhere. Preserve the actual fixtures, floor, walls, lighting, architectural layout, product groups, quantities and exact arrangement. No new products, people, decor, signage, shelf, crate, cabinet or architecture. Preserve the original landscape framing and perspective, no outpainting, no redesign, no glamorized new store. Output should be visibly the same source photograph with localized UI cleanup, subtle tonal finishing and non-readable archival commercial details. Opaque background. Scene invariants: black and wood wine shelves, exact bottle groups and gift box arrangement, black foreground display islands, gray wall, ceiling lamps, exit sign, original floor. Preserve ONLY these genuine large shelf category headings, verbatim and in original position: VINHO DO PORTO, DOURO, ALENTEJO, VINHO VERDE. All smaller packaging/price typography must remain soft and not reconstructed. Remove the white circle right arrow.
```


