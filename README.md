# Estudo Autônomo 9º ano

Site de estudo autônomo de Matemática para o 9º ano (9A, 9B e 9C, SESI Jaú), feito a partir do diagnóstico dos simulados semanais da Etapa 3 do Avalia+ 2026. O aluno estuda sozinho, principalmente pelo celular. Cada tela explica, mostra, pede uma ação e responde ao erro específico que o aluno cometeu.

Segue os princípios dos projetos *Relações Métricas Dinâmicas* e *Fábrica de Funções*: HTML, CSS e JavaScript puros, sem etapa de build e sem dependências externas.

## Trilhas

| Trilha | Etapa | Descritor | Foco |
|---|---|---|---|
| 1. Produtos notáveis | 1A | D14 | Quadrado da soma e da diferença: as duas peças do meio (erro de 54% na Semana 2). Começa com números e quadradinhos, depois letras; exemplo resolvido, você completa, sozinho. Teste de entrada com 3 itens; quem acerta tudo pula. |
| | 1B | D09 | Diferença de quadrados (erro de 52% na Semana 3): pátio com canteiro, explorador com tabela dos valores testados, o L que vira retângulo em 9 passos com as medidas, cartões de contraste um por vez, exemplo resolvido, você completa e escada de prática. |
| | 1C | D09 e D14 | Questões misturadas e geradas na hora. Termina com 4 acertos de primeira nas últimas 5, incluindo 1 questão de comparar e 1 conferência com número. |
| 2. Relações métricas | em breve | D27 | |

A conferência de cada ponto do diagnóstico está em [`docs/analise-didatica.md`](docs/analise-didatica.md).

## Como funciona para o aluno

- Uma ideia por tela, texto curto e botões grandes na parte de baixo da tela. Perguntas com várias partes aparecem uma por vez.
- No notebook, a figura fica ao lado do texto, e as setas do teclado avançam e voltam.
- As figuras se movem um passo por toque em **Próximo passo**, com **Rever movimento**. Nada exige arrastar.
- Cada alternativa errada tem um retorno próprio, às vezes com figura (por exemplo, o L comparado com o quadrado de lado 12 − x).
- Dicas em três degraus: pista, pista maior e solução comentada. Dicas não tiram pontos.
- Respostas certas pedem uma conferência com número, que é o hábito que derruba o erro principal.
- No fim de cada etapa aparece um **código de conclusão** (por exemplo, `1B-0910-MA`) para mostrar ao professor.

## Área do professor

Em `#/professor` (link no rodapé da página inicial), dá para conferir se um código é válido. Os dois últimos caracteres conferem a etapa e o dia. É uma checagem simples: não existe login e nenhum dado sai do aparelho do aluno.

## Privacidade e acessibilidade

- Sem login e sem coleta de dados. O progresso fica só no aparelho (localStorage), e o site funciona mesmo sem ele.
- Celular primeiro (referência de 390 px), texto de no mínimo 16 px e alvos de toque de 44 px ou mais.
- Nada depende só de cor: as peças têm textura (listras, pontos) e as respostas têm ✓, ✗ e traço diferente.
- Tema claro, escuro ou automático. Respeita a preferência por menos movimento.

## Publicar no GitHub Pages

1. No repositório, abra **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**, depois o branch e a pasta `/ (root)`.
3. O endereço fica `https://maiconcentner.github.io/estudo-autonomo-9ano/`.

## Estrutura

```
index.html
css/style.css
js/core.js      progresso no aparelho, código de conclusão, utilidades
js/figuras.js   figuras SVG animadas (peças, pátio, L que vira retângulo)
js/item.js      itens com retorno por erro e dicas
js/licao.js     motor das etapas e tipos de tela
js/trilha1.js   conteúdo da trilha 1 e geradores de questões da 1C
js/app.js       página inicial, área do professor e rotas
```

Para criar uma nova trilha, escreva um arquivo como `js/trilha1.js` e chame `EA.registrarTrilha({...})` com as etapas e as telas. Tipos de tela disponíveis: `texto`, `regra`, `anim`, `passos`, `item`, `widget`, `teste`, `cartoes`, `dominio` e `fim`.

## Testar localmente

```
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.
