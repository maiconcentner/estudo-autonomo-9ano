// Trilha 1: produtos notáveis (D14 e D09). Conteúdo a partir do diagnóstico de 08/10/2026.
(function () {
  const EA = window.EA;
  const { sortear, escolher } = EA;

  // Atalho para item de uma parte só, de escolha
  const escolha = (html, opcoes, dicas, extra = {}) => ({ tipo: 'escolha', html, opcoes, dicas, ...extra });
  const numero = (html, resposta, extra = {}) => ({ tipo: 'numero', html, resposta, ...extra });

  const figSoma = (a, b, aa, ab, bb, faltam) => ({ nome: 'somaPecas', p: { rot: { a, b, aa, ab, bb }, faltam } });
  const figL = (a, b) => ({ nome: 'lVsQuadrado', p: { rot: { a: String(a), b: String(b) } } });
  const figCanteiro = (b) => ({ nome: 'canteiroArea', p: { rot: { b } } });

  // ------------------------------------------------------------------
  // 1A. Quadrado da soma e da diferença (D14)
  // Ordem: área do quadrado -> exemplo com números -> peças com letras -> regra
  // -> número na frente -> exemplo resolvido -> completar -> sozinho -> (a − b)² -> caminho de volta.
  // ------------------------------------------------------------------
  const etapa1A = {
    id: '1A',
    titulo: 'Quadrado da soma e da diferença',
    descritor: 'D14',
    minutos: '8 a 12',
    resumo: 'Por que (a + b)² tem três termos, e não dois.',
    telas: [
      {
        tipo: 'teste',
        titulo: 'Teste rápido',
        html: 'São só 3 perguntas, uma tentativa em cada. Se acertar as três, você já domina esta etapa e pode pular.',
        seAcertarTudo: 'Muito bem! Você pode ir direto para a conclusão ou estudar a etapa assim mesmo.',
        seErrar: 'Sem problema. Agora vamos ver isso com peças, um passo de cada vez.',
        itens: [
          { partes: [escolha('Quanto é $(x + 4)²$?', [
            { t: 'x² + 8x + 16', certo: true }, { t: 'x² + 16' }, { t: 'x² + 4x + 16' }, { t: 'x² − 8x + 16' },
          ])] },
          { partes: [escolha('Um quadrado tem lado $3m + 2$. Qual é a área dele?', [
            { t: '9m² + 12m + 4', certo: true }, { t: '9m² + 4' }, { t: '3m² + 12m + 4' }, { t: '9m² + 6m + 4' },
          ])] },
          { partes: [escolha('Um quadrado tem área $16t² + 24t + 9$. Quanto mede o lado?', [
            { t: '4t + 3', certo: true }, { t: '16t + 9' }, { t: '4t − 3' }, { t: '4t² + 3' },
          ])] },
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Antes de tudo: lado e área',
        html: 'Toque em <strong>Mostrar o próximo</strong> para ver cada passo.',
        passos: [
          { titulo: 'Um quadrado de lado 3', html: 'A área é lado vezes lado: $3 · 3 = 9$ quadradinhos.', fig: { nome: 'canteiroArea', p: { rot: { b: '3' }, n: 3, texto: '3 · 3 = 9', tipo: 'a' } } },
          { titulo: 'Um quadrado de lado x', html: 'Mesma coisa: a área é $x · x$. A gente escreve $x²$.', fig: { nome: 'canteiroArea', p: { rot: { b: 'x' }, tipo: 'a' } } },
          { titulo: 'Atenção', tipo: 'atencao', marca: '!', html: '$x$ é a medida do <strong>lado</strong>. $x²$ é a <strong>área</strong>. Elevar ao quadrado é multiplicar o número por ele mesmo.' },
        ],
      },
      {
        tipo: 'anim',
        titulo: 'Um quadro de lado 7',
        fig: 'somaPecas',
        p: { A: 8, B: 3.2, grade: 1.6, rot: { a: '5', b: '2', aa: '25', ab: '10', bb: '4' }, alt: 'Quadrado de lado 5 + 2 com 49 quadradinhos: peças de 25, 10, 10 e 4.' },
        passos: [
          'Um quadro quadrado tem lado 7. Vamos pensar no 7 como $5 + 2$. Ele tem $7 · 7 = 49$ quadradinhos.',
          'Uma peça de 5 por 5: <strong>25</strong> quadradinhos.',
          'Uma peça de 2 por 2: <strong>4</strong> quadradinhos. Se fosse só isso, daria $25 + 4 = 29$.',
          'Mas olhe: ainda tem dois buracos! Então 29 não é a área toda.',
          'Um buraco é uma peça de 5 por 2: <strong>10</strong> quadradinhos.',
          'O outro buraco também: mais <strong>10</strong>.',
          'Total: $25 + 10 + 10 + 4 = 49$. Sem as duas peças de 10, a conta dá errado.',
        ],
      },
      {
        tipo: 'item',
        titulo: 'Confira com os números',
        item: {
          contexto: 'O quadro tem lado $7 = 5 + 2$.',
          partes: [
            numero('Quanto é $7²$?', 49, {
              resumo: '$7² =$',
              erros: { 14: '$7²$ é $7 · 7$, não $7 · 2$.' },
              dicas: ['Elevar ao quadrado é multiplicar por ele mesmo.', '$7 · 7$.', '$7 · 7 = 49$.'],
            }),
            numero('E quanto é $5² + 2²$?', 29, {
              resumo: '$5² + 2² =$',
              erros: { 14: '$5² = 25$ e $2² = 4$. Some os dois.', 7: 'Faltou elevar ao quadrado: $5 · 5$ e $2 · 2$.', 49: '$49$ é $7²$. Aqui é $5² + 2²$, separado.' },
              dicas: ['Calcule $5²$ e depois $2²$.', '$5² = 25$ e $2² = 4$.', '$25 + 4 = 29$.'],
            }),
            escolha('Então $(5 + 2)²$ é igual a $5² + 2²$?', [
              { t: 'Não: 49 é diferente de 29', txt: true, certo: true, fb: 'Isso! Elevar a soma ao quadrado não é elevar cada parte.' },
              { t: 'Sim', txt: true, fb: '$(5 + 2)² = 49$ e $5² + 2² = 29$. São diferentes.' },
            ], null, { fixo: true, resumo: '$(5 + 2)² = 5² + 2²$?' }),
            numero('Quanto faltou de 29 até 49?', 20, {
              resumo: 'Faltou:',
              fbCerto: 'Faltaram as duas peças de 10: $10 + 10 = 20$. É o termo do meio, $2 · 5 · 2$.',
              dicas: ['Faça $49 − 29$.', 'É a área dos dois buracos.', '$49 − 29 = 20$.'],
            }),
          ],
        },
      },
      {
        tipo: 'anim',
        titulo: 'Agora com letras: lado $a + b$',
        fig: 'somaPecas',
        passos: [
          'Este quadrado tem lado $a + b$. A área dele é $(a + b)²$.',
          'Primeira peça: um quadrado de lado $a$. Área $a²$.',
          'Segunda peça: um quadrado de lado $b$. Área $b²$.',
          'Ainda tem dois buracos! Igual ao quadro de lado 7.',
          'Um buraco é um retângulo de lados $a$ e $b$. Área $ab$.',
          'O outro também: mais $ab$.',
          'Somando as quatro peças: $a² + ab + ab + b² = a² + 2ab + b²$.',
        ],
      },
      {
        tipo: 'regra',
        titulo: 'Quadrado da soma',
        formula: '(a + b)² = a² + 2ab + b²',
        html: 'São <strong>três termos</strong>. O $2ab$ são as duas peças do meio.',
      },
      {
        tipo: 'anim',
        titulo: 'E quando tem número na frente?',
        fig: 'coefQuadrado',
        p: { n: 2, v: 'y' },
        passos: [
          'Este quadrado tem lado $2y$.',
          '$2y$ é o mesmo que $y + y$. Cada lado se divide em dois pedaços $y$.',
          'Cortando, aparecem quadrados menores.',
          'Cada quadrado menor tem área $y²$. São 4.',
          'Então $(2y)² = 4y²$. O número também vai ao quadrado: $2 · 2 = 4$.',
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Exemplo resolvido: $(x + 3)²$',
        html: 'Um passo por toque. Siga a ordem.',
        passos: [
          { titulo: 'Primeiro termo ao quadrado', html: 'O primeiro termo é $x$. Ao quadrado: $x²$.' },
          { titulo: 'Segundo termo ao quadrado', html: 'O segundo termo é $3$. Ao quadrado: $3 · 3 = 9$.' },
          { titulo: 'Termo do meio', html: 'Duas vezes o primeiro vezes o segundo: $2 · x · 3 = 6x$.' },
          { titulo: 'Junte tudo', tipo: 'ok', marca: '✓', html: '$(x + 3)² = x² + 6x + 9$.', fig: figSoma('x', '3', 'x²', '3x', '9') },
        ],
      },
      {
        tipo: 'item',
        titulo: 'Agora você completa: $(y + 4)²$',
        item: {
          partes: [
            escolha('O primeiro termo é $y$. Quanto é ele ao quadrado?', [
              { t: 'y²', certo: true }, { t: '2y', fb: '$y²$ é $y · y$, não $y + y$.' }, { t: 'y', fb: 'Falta elevar ao quadrado.' },
            ], ['O primeiro termo é $y$.', '$y · y$.', '$y²$.'], { resumo: 'Primeiro ao quadrado:' }),
            numero('Segundo termo ao quadrado: quanto é $4²$?', 16, {
              resumo: 'Segundo ao quadrado:',
              erros: { 8: '$4² = 4 · 4$, não $4 · 2$.' },
              dicas: ['$4 · 4$.', 'Quatro vezes quatro.', '$16$.'],
            }),
            escolha('Termo do meio: quanto é $2 · y · 4$?', [
              { t: '8y', certo: true }, { t: '4y', fb: 'Faltou o 2: são duas peças.' }, { t: '6y', fb: '$2 · 4 = 8$, não $6$.' },
            ], ['São duas peças $4y$.', '$2 · 4 = 8$.', '$8y$.'], { resumo: 'Meio:' }),
            escolha('Então $(y + 4)² =$', [
              { t: 'y² + 8y + 16', certo: true, fb: 'Isso! Três termos.' },
              { t: 'y² + 16', fb: 'Faltou o termo do meio, $8y$.', fig: figSoma('y', '4', 'y²', '4y', '16', true) },
              { t: 'y² + 4y + 16', fb: 'O meio é $8y$, as duas peças.' },
            ], null, { resumo: '$(y + 4)² =$' }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Sozinho: o piso do quarto',
        item: {
          contexto: 'O quarto do Léo é quadrado e tem lado $(m + 6)$ metros.',
          partes: [
            escolha('Qual é a área do piso?', [
              { t: 'm² + 12m + 36', certo: true, fb: '$m²$, duas peças $6m$ e a peça $36$.' },
              { t: 'm² + 36', fb: 'Faltaram as duas peças do meio. Veja as peças que faltaram:', fig: figSoma('m', '6', 'm²', '6m', '36', true) },
              { t: 'm² + 6m + 36', fb: 'Você colocou só uma peça $6m$. São duas: $6m + 6m = 12m$.', fig: figSoma('m', '6', 'm²', '6m', '36', true) },
              { t: 'm² + 12m + 12', fb: 'A peça do canto é $6 · 6 = 36$, não $6 · 2$.' },
            ], [
              'Faça como no exemplo: primeiro ao quadrado, segundo ao quadrado, depois o meio.',
              '$m²$, $6² = 36$ e o meio $2 · m · 6$.',
              '$(m + 6)² = m² + 12m + 36$.',
            ], { resumo: 'Área:' }),
            numero('Confira com um número. Com $m = 1$, o lado mede 7 e a área é 49. Quanto dá $m² + 12m + 36$ com $m = 1$?', 49, {
              resumo: 'Com $m = 1$:',
              fbCerto: '$1 + 12 + 36 = 49$. Bateu com a área!',
              erros: { 37: 'Não esqueça do $12m = 12 · 1 = 12$.' },
              dicas: ['Troque $m$ por $1$ em cada termo.', '$1² = 1$, $12 · 1 = 12$.', '$1 + 12 + 36 = 49$.'],
            }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Sozinho: o azulejo',
        item: {
          contexto: 'Um azulejo quadrado tem lado $(2y + 1)$ decímetros.',
          partes: [
            escolha('Qual é a área do azulejo?', [
              { t: '4y² + 4y + 1', certo: true, fb: '$(2y)² = 4y²$, o meio é $2 · 2y · 1 = 4y$ e o canto é $1$.' },
              { t: '4y² + 1', fb: 'Faltaram as duas peças do meio, cada uma $2y · 1 = 2y$.', fig: figSoma('2y', '1', '4y²', '2y', '1', true) },
              { t: '2y² + 4y + 1', fb: 'O 2 também vai ao quadrado: $(2y)² = 2y · 2y = 4y²$. Lembra dos 4 quadradinhos?', fig: { nome: 'coefQuadrado', p: { n: 2, v: 'y' } } },
              { t: '4y² + 2y + 1', fb: 'São duas peças $2y$ no meio: $2y + 2y = 4y$.' },
            ], [
              'O primeiro termo é $2y$. Eleve ele todo ao quadrado.',
              '$(2y)² = 4y²$. O meio é $2 · 2y · 1$.',
              '$4y² + 4y + 1$.',
            ], { resumo: 'Área:' }),
            numero('Confira com $y = 1$: o lado mede 3 e a área é 9. Quanto dá $4y² + 4y + 1$ com $y = 1$?', 9, {
              resumo: 'Com $y = 1$:',
              fbCerto: '$4 + 4 + 1 = 9$. Bateu!',
              dicas: ['Troque $y$ por $1$.', '$4 · 1 + 4 · 1 + 1$.', '$9$.'],
            }),
          ],
        },
      },
      {
        tipo: 'anim',
        titulo: 'E o quadrado de lado $a − b$?',
        fig: 'difPecas',
        passos: [
          'Comece com um quadrado de lado $a$. Área $a²$.',
          'Queremos só o quadrado tracejado, de lado $a − b$.',
          'Tire a faixa de cima: menos $ab$.',
          'Tire a faixa da direita: menos $ab$.',
          'Atenção ao cantinho marcado: ele estava nas duas faixas. Saiu <strong>duas vezes</strong>!',
          'Então devolva o cantinho uma vez: mais $b²$. Resultado: $a² − 2ab + b²$.',
        ],
      },
      {
        tipo: 'regra',
        titulo: 'Quadrado da diferença',
        formula: '(a − b)² = a² − 2ab + b²',
        html: 'Igual ao quadrado da soma, mas o termo do meio fica <strong>negativo</strong>. O último termo, $b²$, é <strong>positivo</strong>.',
      },
      {
        tipo: 'item',
        titulo: 'Quadrado da diferença',
        item: {
          partes: [
            escolha('Quanto é $(a − 5)²$?', [
              { t: 'a² − 10a + 25', certo: true, fb: '$a²$, menos $2 · 5 · a$, mais $5²$.' },
              { t: 'a² − 25', fb: '$a² − 25$ é o resultado de $(a − 5)(a + 5)$, outro produto. No quadrado aparece o termo do meio, $−10a$.' },
              { t: 'a² + 25', fb: 'Faltou o termo do meio. Lembre das duas faixas que saem.', fig: { nome: 'difPecas', p: { passo: 5 } } },
              { t: 'a² − 10a − 25', fb: '$(−5) · (−5) = +25$. O último termo é sempre positivo.' },
              { t: 'a² − 5a + 25', fb: 'O termo do meio é dobrado: $2 · 5 · a = 10a$.' },
            ], [
              'Use $(a − b)² = a² − 2ab + b²$ com $b = 5$.',
              'O meio é $2 · a · 5$, com sinal de menos.',
              '$(a − 5)² = a² − 10a + 25$.',
            ], { resumo: '$(a − 5)² =$' }),
            numero('Confira com $a = 7$: $(7 − 5)² = 2² = 4$. Quanto dá $a² − 10a + 25$ com $a = 7$?', 4, {
              resumo: 'Com $a = 7$:',
              fbCerto: '$49 − 70 + 25 = 4$. Bateu!',
              erros: { 144: 'O meio é menos: $49 − 70 + 25$.', '-46': 'O último termo é $+25$: $49 − 70 + 25$.' },
              dicas: ['$a² = 49$ e $10a = 70$.', '$49 − 70 + 25$.', '$4$.'],
            }),
          ],
        },
      },
      {
        tipo: 'passos',
        titulo: 'O caminho de volta: da área para o lado',
        html: 'Às vezes a questão dá a área e pede o lado. Exemplo: área $x² + 6x + 9$.',
        passos: [
          { titulo: 'Lado da peça grande', html: 'A peça $x²$ tem lado $x$, porque $x · x = x²$.' },
          { titulo: 'Lado da peça pequena', html: 'A peça $9$ tem lado $3$, porque $3 · 3 = 9$. Não é $9$ e não é a metade de $9$.' },
          { titulo: 'Confira o meio', html: '$2 · x · 3 = 6x$. Bateu com o meio da área!' },
          { titulo: 'O lado', tipo: 'ok', marca: '✓', html: 'O lado é $x + 3$.', fig: figSoma('x', '3', 'x²', '3x', '9') },
        ],
      },
      {
        tipo: 'item',
        titulo: 'Você completa: área $4y² + 12y + 9$',
        item: {
          partes: [
            escolha('Qual é o lado da peça $4y²$?', [
              { t: '2y', certo: true, fb: '$2y · 2y = 4y²$.' },
              { t: '4y', fb: '$4y · 4y = 16y²$, grande demais.' },
              { t: '2y²', fb: 'O lado não tem quadrado: $2y · 2y = 4y²$.' },
            ], ['Qual expressão vezes ela mesma dá $4y²$?', '$2 · 2 = 4$ e $y · y = y²$.', '$2y$.'], { resumo: 'Lado de $4y²$:' }),
            numero('Qual é o lado da peça $9$?', 3, {
              resumo: 'Lado de $9$:',
              erros: { 9: '$9$ é a área. Qual número vezes ele mesmo dá $9$?', 4.5: 'Não é a metade: $3 · 3 = 9$.' },
              dicas: ['Qual número vezes ele mesmo dá 9?', '$3 · 3 = ?$', '$3$.'],
            }),
            escolha('Confira o meio: quanto é $2 · 2y · 3$?', [
              { t: '12y', certo: true, fb: 'Bateu com o meio da área!' }, { t: '6y', fb: 'Faltou o 2 da frente: $2 · 6y$.' }, { t: '5y', fb: 'É multiplicação: $2 · 2 · 3 = 12$.' },
            ], null, { resumo: 'Meio:' }),
            escolha('Então o lado é:', [
              { t: '2y + 3', certo: true, fb: 'Isso! $(2y + 3)² = 4y² + 12y + 9$.' },
              { t: '4y + 9', fb: 'Esses são as áreas das pontas. O lado usa os lados das peças: $2y$ e $3$.', fig: figSoma('2y', '3', '4y²', '6y', '9') },
              { t: '2y − 3', fb: 'O meio é $+12y$, positivo: é soma.' },
            ], null, { resumo: 'Lado:' }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Sozinho: o adesivo',
        item: {
          contexto: 'Um adesivo quadrado tem área $x² + 10x + 25$.',
          partes: [
            escolha('Quanto mede o lado do adesivo?', [
              { t: 'x + 5', certo: true, fb: 'Isso. $(x + 5)² = x² + 10x + 25$.' },
              { t: 'x + 25', fb: '$25$ é a área da peça do canto. O lado dela é $5$, porque $5 · 5 = 25$.', fig: figSoma('x', '5', 'x²', '5x', '25') },
              { t: 'x² + 5', fb: '$x²$ é área. O lado da peça $x²$ é $x$.' },
              { t: 'x − 5', fb: 'O termo do meio é $+10x$, positivo. Então é soma.' },
              { t: 'Não dá para saber', txt: true, fb: 'Dá sim: $x²$ e $25$ são quadrados, e $10x = 2 · x · 5$.' },
            ], [
              'Procure o lado de cada ponta: qual expressão vezes ela mesma dá $x²$? E $25$?',
              'Os lados das pontas são $x$ e $5$. Confira o meio: $2 · x · 5 = 10x$.',
              'O lado é $x + 5$.',
            ], { resumo: 'Lado:' }),
            numero('Confira com $x = 1$: a área é $1 + 10 + 25 = 36$. Quanto mede o lado $x + 5$ com $x = 1$?', 6, {
              resumo: 'Com $x = 1$:',
              fbCerto: '$6 · 6 = 36$. Bateu com a área!',
              dicas: ['Troque $x$ por $1$.', '$1 + 5$.', '$6$.'],
            }),
          ],
        },
      },
      {
        tipo: 'fim',
        html: 'Agora você sabe que $(a + b)²$ tem <strong>três termos</strong>, e sabe fazer o caminho de volta. Próxima parada: a diferença de quadrados.',
      },
    ],
  };

  // ------------------------------------------------------------------
  // 1B. Diferença de quadrados (D09, foco principal)
  // Ordem do diagnóstico: explorar -> ver -> nomear a regra -> contrastar -> praticar em escada -> hábito de conferir.
  // ------------------------------------------------------------------
  const etapa1B = {
    id: '1B',
    titulo: 'Diferença de quadrados',
    descritor: 'D09',
    minutos: '10 a 15',
    resumo: 'Tirar um quadrado de dentro de outro: o que sobra?',
    principal: true,
    telas: [
      {
        tipo: 'texto',
        titulo: 'O pátio e o canteiro',
        fig: { nome: 'patio', p: { x: 4 } },
        html: 'A escola tem um pátio quadrado de <strong>12 m</strong> de lado. No meio, vão fazer um canteiro quadrado de lado <strong>x</strong>.<br><br>O resto do pátio continua com piso. Quanto de piso sobra?',
      },
      {
        tipo: 'item',
        titulo: 'A área do piso',
        item: {
          partes: [
            numero('Primeiro: qual é a área do pátio inteiro, em m²?', 144, {
              resumo: 'Área do pátio:',
              erros: { 24: '$12 + 12$ não. Área é lado vezes lado: $12 · 12$.', 48: 'Isso é o contorno. Área é lado vezes lado: $12 · 12$.' },
              dicas: ['Área do quadrado: lado vezes lado.', '$12 · 12$.', '$144$.'],
            }),
            escolha('E a área do canteiro, que tem lado $x$?', [
              { t: 'x²', certo: true, fb: '$x · x = x²$.' },
              { t: 'x', fb: '$x$ é o lado. A área é $x · x$.', fig: figCanteiro('x') },
              { t: '2x', fb: '$x + x = 2x$. A área é $x · x$.', fig: figCanteiro('x') },
            ], null, { resumo: 'Área do canteiro:' }),
            escolha('Então qual expressão dá a área que continua com piso?', [
              { t: '144 − x²', certo: true, fb: 'Isso. Área do pátio menos área do canteiro.' },
              { t: '144 − x', fb: 'O canteiro tem área $x²$, não $x$.', fig: figCanteiro('x') },
              { t: '12 − x', fb: '$12 − x$ é um comprimento. Precisamos de área: $144$ menos a área do canteiro.' },
            ], null, { resumo: 'Piso:' }),
          ],
        },
      },
      {
        tipo: 'widget',
        titulo: 'Mexa no canteiro',
        html: 'Muitos alunos acham que o piso é $(12 − x)²$. Outros, que é $(12 − x)(12 + x)$. Vamos testar as duas com números.',
        widget: 'patio',
        p: { x: 4 },
        item: {
          partes: [
            escolha('Qual expressão <strong>sempre</strong> dá o mesmo valor que $144 − x²$?', [
              { t: '(12 − x)(12 + x)', certo: true, fb: 'Isso! Em todos os valores que você testou, $(12 − x)(12 + x)$ bateu com o piso.' },
              { t: '(12 − x)²', fb: 'Com $x = 5$: o piso é $144 − 25 = 119$, mas $(12 − 5)² = 49$. Não bate. O que sobra quando você tira o canteiro é um L, e o L não é um quadrado.', fig: figL(12, 'x') },
              { t: 'As duas', txt: true, fb: 'Olhe a tabela: a coluna $(12 − x)²$ tem ✗. Só uma acompanha o piso.' },
            ], [
              'Olhe a tabela: qual coluna tem só ✓?',
              'Com $x = 5$: piso $119$, $(12 − x)² = 49$, $(12 − x)(12 + x) = 119$.',
              'A que sempre bate é $(12 − x)(12 + x)$.',
            ]),
          ],
        },
      },
      {
        tipo: 'anim',
        titulo: 'Por que $(12 − x)(12 + x)$?',
        fig: 'lRetangulo',
        passos: [
          'Este é o pátio de 12 m com o canteiro de lado $x$ no meio.',
          'Empurre o canteiro para o canto. A área de piso não muda: o piso só trocou de lugar.',
          'Sem o canteiro, o piso forma uma figura em <strong>L</strong>.',
          'O L é um quadrado? <strong>Não!</strong> O quadrado tracejado de lado $12 − x$ cabe dentro dele e ainda sobram duas faixas. Por isso $(12 − x)²$ é menor que o piso.',
          'Corte o L em duas partes. A parte lisa mede $12 − x$ por $12$. A parte listrada mede $x$ por $12 − x$.',
          'Gire a parte listrada. Agora ela fica deitada: $12 − x$ de largura e $x$ de altura.',
          'Encaixe embaixo da parte lisa. As duas têm a mesma largura: $12 − x$.',
          'A altura total ficou $12 + x$: $12$ da parte lisa mais $x$ da parte listrada.',
          'Virou um retângulo de $12 − x$ por $12 + x$. Área: $(12 − x)(12 + x)$. Com $x = 4$: $8 · 16 = 128$, e $144 − 16 = 128$. Bateu!',
        ],
      },
      {
        tipo: 'item',
        titulo: 'Você entendeu o movimento?',
        item: {
          partes: [
            escolha('Por que um lado do retângulo mede $12 + x$?', [
              { t: 'É 12 da parte lisa mais x da parte listrada', txt: true, certo: true, fb: 'Isso. A parte listrada, deitada, tem altura $x$ e ficou embaixo da parte de altura $12$.' },
              { t: 'Porque o canteiro foi somado ao piso', txt: true, fb: 'O canteiro saiu. Só o piso foi rearrumado. Volte uma tela e veja o encaixe.' },
              { t: 'Porque 12 vezes x', txt: true, fb: 'É soma de comprimentos, uma parte em cima da outra: $12 + x$.' },
            ], null, { resumo: 'Lado $12 + x$:' }),
            escolha('E por que o outro lado mede $12 − x$?', [
              { t: 'É a largura das duas partes, que ficou igual', txt: true, certo: true, fb: 'Isso. O pátio tinha 12 de largura e o canteiro tirou $x$.' },
              { t: 'Porque o canteiro tem lado 12', txt: true, fb: 'O canteiro tem lado $x$. A largura que sobra é $12 − x$.' },
            ], null, { resumo: 'Lado $12 − x$:' }),
          ],
        },
      },
      {
        tipo: 'regra',
        titulo: 'Diferença de quadrados',
        formula: 'a² − b² = (a − b)(a + b)',
        html: 'Dois quadrados com <strong>menos</strong> no meio viram <strong>diferença vezes soma</strong>.<br>No pátio: $12² − x² = (12 − x)(12 + x)$.',
      },
      {
        tipo: 'cartoes',
        titulo: 'Três parecidos, três diferentes',
        html: 'Cuidado para não confundir. Veja um de cada vez, com $a = 5$ e $b = 2$.',
        cartoes: [
          { titulo: '(a + b)²', tom: 'soma', fig: { nome: 'somaPecas' }, resultado: '$= a² + 2ab + b²$ (três termos)', teste: '$7² = 49$' },
          { titulo: '(a − b)²', tom: 'dif', fig: { nome: 'difPecas', p: { passo: 1 } }, resultado: '$= a² − 2ab + b²$ (três termos)', teste: '$3² = 9$' },
          { titulo: '(a + b)(a − b)', tom: 'prod', fig: { nome: 'retangulo' }, resultado: '$= a² − b²$ (dois termos)', teste: '$7 · 3 = 21 = 25 − 4$' },
        ],
        depois: 'Só o último tem <strong>dois termos</strong> quando expandido. Os dois quadrados têm três.',
      },
      {
        tipo: 'item',
        titulo: 'Teste os três com números',
        item: {
          tags: ['contraste'],
          contexto: 'Use $a = 6$ e $b = 2$.',
          partes: [
            numero('Quanto é $a² − b²$, ou seja, $36 − 4$?', 32, { resumo: '$a² − b² =$', dicas: ['$36 − 4$.', 'Trinta e seis menos quatro.', '$32$.'] }),
            numero('Quanto é $(a − b)(a + b)$, ou seja, $4 · 8$?', 32, { resumo: '$(a − b)(a + b) =$', dicas: ['$6 − 2 = 4$ e $6 + 2 = 8$.', '$4 · 8$.', '$32$.'] }),
            numero('Quanto é $(a − b)²$, ou seja, $4²$?', 16, { resumo: '$(a − b)² =$', erros: { 8: '$4² = 4 · 4$.' }, dicas: ['$6 − 2 = 4$.', '$4 · 4$.', '$16$.'] }),
            escolha('Qual é igual a $a² − b²$?', [
              { t: '(a − b)(a + b)', certo: true, fb: '$32 = 32$. E $(a − b)² = 16$ não bate.' },
              { t: '(a − b)²', fb: 'Deu $16$, e $a² − b²$ deu $32$.' },
            ], null, { resumo: 'Igual a $a² − b²$:' }),
          ],
        },
      },
      {
        tipo: 'passos',
        titulo: 'Para fatorar, ache o lado',
        html: 'Em $a² − b²$, você precisa descobrir quem é $a$ e quem é $b$: o <strong>lado</strong> de cada quadrado.',
        passos: [
          { titulo: 'Números quadrados', html: 'Decore ou consulte:<div class="quadrados m"><span>1² = 1</span><span>2² = 4</span><span>3² = 9</span><span>4² = 16</span><span>5² = 25</span><span>6² = 36</span><span>7² = 49</span><span>8² = 64</span><span>9² = 81</span><span>10² = 100</span><span>11² = 121</span><span>12² = 144</span></div>' },
          { titulo: 'Com letra', html: '$x²$ tem lado $x$. $16y²$ tem lado $4y$, porque $4y · 4y = 16y²$.' },
          { titulo: 'Atenção', tipo: 'atencao', marca: '!', html: 'O lado de $49$ é $7$, <strong>não</strong> $49$ e <strong>não</strong> a metade de $49$.' },
        ],
      },
      {
        tipo: 'item',
        titulo: 'Reconhecer',
        item: {
          tags: ['contraste'],
          partes: [
            escolha('Qual destas é uma diferença de quadrados?', [
              { t: 'x² − 49', certo: true, fb: '$x²$ é quadrado, $49 = 7²$ é quadrado, e tem menos no meio.' },
              { t: 'x² + 49', fb: 'Tem soma, não subtração.' },
              { t: '(x − 7)²', fb: 'Esse é o quadrado de uma diferença. Ele vale $x² − 14x + 49$.' },
              { t: 'x² − 14x + 49', fb: 'Tem três termos. É o $(x − 7)²$ já expandido.' },
              { t: '2x² − 49', fb: '$2x²$ não é um quadrado perfeito: nenhum número inteiro vezes ele mesmo dá $2$.' },
            ], [
              'Procure dois termos, os dois quadrados, com sinal de menos entre eles.',
              '$49 = 7 · 7$. Qual opção tem exatamente $x²$ menos um quadrado?',
              '$x² − 49 = x² − 7²$.',
            ]),
          ],
        },
      },
      {
        tipo: 'passos',
        titulo: 'Exemplo resolvido: $x² − 49$',
        html: 'Um passo por toque.',
        passos: [
          { titulo: 'É diferença de quadrados?', html: 'Dois termos, os dois são quadrados, com menos no meio. Sim!' },
          { titulo: 'Ache os lados', html: 'Lado de $x²$: $x$. Lado de $49$: $7$.' },
          { titulo: 'Diferença vezes soma', html: '$x² − 49 = (x − 7)(x + 7)$.' },
          { titulo: 'Confira com um número', tipo: 'ok', marca: '✓', html: 'Com $x = 10$: $100 − 49 = 51$. E $(10 − 7)(10 + 7) = 3 · 17 = 51$. Bateu!' },
        ],
      },
      {
        tipo: 'item',
        titulo: 'Você completa: $x² − 81$',
        item: {
          partes: [
            numero('$81$ é o quadrado de qual número?', 9, {
              resumo: 'Lado de 81:',
              erros: { 81: '$81$ é a área. Qual número vezes ele mesmo dá $81$?', 40.5: 'Não é a metade: $9 · 9 = 81$.' },
              dicas: ['Qual número vezes ele mesmo dá 81?', 'Olhe a lista de números quadrados.', '$9 · 9 = 81$.'],
            }),
            escolha('Então $x² − 81 =$', [
              { t: '(x − 9)(x + 9)', certo: true, fb: 'Diferença vezes soma.' },
              { t: '(x − 9)²', fb: 'Teste com $x = 10$: $100 − 81 = 19$, mas $(10 − 9)² = 1$. Não bate.', fig: figL('x', 9) },
              { t: '(x − 81)(x + 81)', fb: 'Use o lado, $9$, não a área $81$.' },
            ], null, { resumo: '$x² − 81 =$' }),
            numero('Confira com $x = 10$: $100 − 81 = 19$. Quanto dá $(10 − 9)(10 + 9)$?', 19, {
              resumo: 'Conferência:',
              fbCerto: '$1 · 19 = 19$. Bateu!',
              erros: { 1: 'Você calculou $(10 − 9)²$. Multiplique $(10 − 9)$ por $(10 + 9)$.', 361: 'Não é $19²$. É $1 · 19$.' },
              dicas: ['Calcule cada parêntese primeiro.', '$10 − 9 = 1$ e $10 + 9 = 19$.', '$1 · 19 = 19$.'],
            }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Você completa: $16y² − 25$',
        item: {
          partes: [
            escolha('Qual é o lado de $16y²$?', [
              { t: '4y', certo: true, fb: '$4y · 4y = 16y²$.' },
              { t: '8y', fb: '$8y · 8y = 64y²$. Não é a metade de 16: é o número que vezes ele mesmo dá 16.' },
              { t: '16y', fb: '$16y$ é grande demais: $16y · 16y = 256y²$.' },
            ], ['Qual número vezes ele mesmo dá 16?', '$4 · 4 = 16$ e $y · y = y²$.', '$4y$.'], { resumo: 'Lado de $16y²$:' }),
            numero('Qual é o lado de $25$?', 5, {
              resumo: 'Lado de 25:',
              erros: { 25: '$25$ é a área. Qual número vezes ele mesmo dá 25?', 12.5: 'Não é a metade: $5 · 5 = 25$.' },
              dicas: ['Qual número vezes ele mesmo dá 25?', '$5 · 5$.', '$5$.'],
            }),
            escolha('Então $16y² − 25 =$', [
              { t: '(4y − 5)(4y + 5)', certo: true, fb: 'Diferença vezes soma, com os lados $4y$ e $5$.' },
              { t: '(4y − 5)²', fb: 'Esse é o quadrado da diferença, com três termos.' },
              { t: '(16y − 25)(16y + 25)', fb: 'Use os lados, $4y$ e $5$, e não as áreas.' },
            ], null, { resumo: '$16y² − 25 =$' }),
            numero('Confira com $y = 2$: $16 · 4 − 25 = 39$. Quanto dá $(8 − 5)(8 + 5)$?', 39, {
              resumo: 'Conferência:',
              fbCerto: '$3 · 13 = 39$. Bateu!',
              erros: { 9: 'Isso é $(8 − 5)²$. Multiplique $3$ por $13$.' },
              dicas: ['$8 − 5 = 3$ e $8 + 5 = 13$.', '$3 · 13$.', '$39$.'],
            }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Sozinho: a quadra e a piscina',
        item: {
          contexto: 'Um clube tem uma quadra quadrada de <strong>20 m</strong> de lado. No centro, vão construir uma piscina quadrada de lado <strong>y</strong>. O resto continua sendo quadra.',
          partes: [
            escolha('Qual é a forma fatorada da área que continua sendo quadra?', [
              { t: '(20 − y)(20 + y)', certo: true, fb: '$400 − y² = 20² − y² = (20 − y)(20 + y)$.' },
              { t: '(20 − y)²', fb: 'O que sobra é um L, e o L não é um quadrado. Teste com $y = 10$: $400 − 100 = 300$, mas $(20 − 10)² = 100$.', fig: figL(20, 'y') },
              { t: '(20 + y)²', fb: 'Esse fica maior que a quadra inteira! A área tem que diminuir quando a piscina cresce.' },
              { t: '400 − y', fb: 'A piscina é quadrada: a área dela é $y · y = y²$.', fig: figCanteiro('y') },
              { t: '(y − 20)(y + 20)', fb: 'Ordem trocada: isso dá $y² − 400$, que é negativo para $y$ menor que $20$. Área não pode ser negativa.' },
            ], [
              'Primeiro escreva a área: quadra menos piscina.',
              '$400 − y² = 20² − y²$. É diferença de quadrados.',
              '$(20 − y)(20 + y)$.',
            ], { resumo: 'Área da quadra:' }),
            numero('Confira com $y = 5$: a área é $400 − 25 = 375$. Quanto dá $(20 − 5)(20 + 5)$?', 375, {
              resumo: 'Conferência:',
              fbCerto: '$15 · 25 = 375$. Bateu!',
              erros: { 225: 'Isso é $15²$. Multiplique $15$ por $25$.', 625: 'Isso é $25²$. Multiplique $15$ por $25$.' },
              dicas: ['$20 − 5 = 15$ e $20 + 5 = 25$.', '$15 · 25 = 15 · 20 + 15 · 5$.', '$300 + 75 = 375$.'],
            }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Investigue o erro',
        item: {
          tags: ['conferencia'],
          contexto: 'Marina fatorou $49 − m²$ como $(7 − m)²$. Vamos testar com $m = 3$.',
          partes: [
            numero('Quanto vale $49 − m²$ com $m = 3$?', 40, {
              resumo: '$49 − m² =$',
              erros: { 43: '$m² = 3 · 3 = 9$, não $6$.', 46: '$m² = 3 · 3 = 9$, não $3$.', 16: 'Esse é o valor de $(7 − 3)²$. Aqui é $49 − 3²$.' },
              dicas: ['Primeiro $m² = 3 · 3$.', '$m² = 9$.', '$49 − 9 = 40$.'],
            }),
            numero('E quanto vale $(7 − m)²$ com $m = 3$?', 16, {
              resumo: '$(7 − m)² =$',
              erros: { 40: 'Primeiro faça $7 − 3$, depois eleve ao quadrado.', 8: '$4² = 4 · 4 = 16$, não $4 · 2$.', 4: 'Faltou elevar ao quadrado: $4 · 4$.' },
              dicas: ['Faça o parêntese primeiro: $7 − 3$.', '$7 − 3 = 4$. Agora $4²$.', '$4 · 4 = 16$.'],
            }),
            escolha('$40$ e $16$. Marina acertou?', [
              { t: 'Não, os valores são diferentes', txt: true, certo: true, fb: 'Isso. Se a fatoração estivesse certa, os dois lados dariam o mesmo número.' },
              { t: 'Sim', txt: true, fb: 'Se fossem iguais, $40$ teria que ser igual a $16$.' },
            ], null, { fixo: true, resumo: 'Marina acertou?' }),
            escolha('Qual é a fatoração certa de $49 − m²$?', [
              { t: '(7 − m)(7 + m)', certo: true, fb: 'Confira: $4 · 10 = 40$. Bateu!' },
              { t: '(m − 7)(m + 7)', fb: 'Ordem trocada: isso dá $m² − 49$.' },
              { t: '(7 + m)²', fb: 'Teste com $m = 3$: $10² = 100$, não $40$.' },
              { t: '(49 − m)(49 + m)', fb: '$49 = 7²$. Use $7$.' },
            ], ['$49 = 7²$.', 'Diferença vezes soma.', '$(7 − m)(7 + m)$.']),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Cálculo mental',
        item: {
          partes: [
            numero('Sem calculadora: quanto é $61² − 59²$?<br><span class="nota">Use $a² − b² = (a − b)(a + b)$.</span>', 240, {
              fbCerto: '$(61 − 59)(61 + 59) = 2 · 120 = 240$. Bem mais rápido que calcular $3721 − 3481$!',
              erros: { 4: 'Isso é $(61 − 59)²$. Use $(61 − 59) · (61 + 59)$.', 120: 'Faltou multiplicar por $61 − 59 = 2$.', 2: 'Faltou multiplicar por $61 + 59 = 120$.' },
              dicas: ['Calcule $61 − 59$ e $61 + 59$.', '$61 − 59 = 2$ e $61 + 59 = 120$.', '$2 · 120 = 240$.'],
            }),
          ],
        },
      },
      {
        tipo: 'regra',
        titulo: 'Seu novo hábito',
        formula: 'troque por um número e compare',
        html: 'Na dúvida, troque a letra por um número e calcule os dois lados. Se der diferente, está errado.<br>Com $x = 5$: $144 − 25 = 119$, mas $(12 − 5)² = 49$. Então $144 − x²$ <strong>não</strong> é $(12 − x)²$.',
      },
      {
        tipo: 'fim',
        html: 'Você viu que tirar um quadrado de dentro de outro deixa um L, e que o L vira o retângulo $(a − b)(a + b)$. Agora é hora de misturar tudo na etapa 1C.',
      },
    ],
  };

  // ------------------------------------------------------------------
  // 1C. Juntando tudo: itens gerados, critério de domínio
  // ------------------------------------------------------------------
  const letra = () => escolher(['x', 'a', 'm', 't', 'y']);
  const coef = (c, v) => (c === 1 ? v : c + v);

  const gerador = {
    dif() {
      const k = sortear(3, 12), K = k * k, t = k + 2;
      return { tags: [], partes: [escolha(`Fatore $x² − ${K}$.`, [
        { t: `(x − ${k})(x + ${k})`, certo: true, fb: `$${K} = ${k}²$, então $x² − ${k}² = (x − ${k})(x + ${k})$.` },
        { t: `(x − ${k})²`, fb: `Teste com $x = ${t}$: $${t * t} − ${K} = ${t * t - K}$, mas $(${t} − ${k})² = ${(t - k) ** 2}$. Não bate.`, fig: figL('x', k) },
        { t: `(x + ${k})²`, fb: `Esse é o quadrado da soma: dá $x² + ${2 * k}x + ${K}$.` },
        { t: `(${k} − x)(${k} + x)`, fb: `Ordem trocada: isso dá $${K} − x²$.` },
        { t: `x − ${k}`, fb: 'Diferença de quadrados vira um produto de dois parênteses: diferença vezes soma.' },
      ], [`Escreva $${K}$ como um número ao quadrado.`, `$${K} = ${k}²$. Use $a² − b² = (a − b)(a + b)$.`, `$(x − ${k})(x + ${k})$.`])] };
    },
    coef() {
      const p = sortear(2, 5), q = escolher([1, 3, 5, 7].filter((n) => n !== p)), P = p * p, Q = q * q;
      return { tags: [], partes: [escolha(`Fatore $${P}y² − ${Q}$.`, [
        { t: `(${p}y − ${q})(${p}y + ${q})`, certo: true, fb: `$${P}y² = (${p}y)²$ e $${Q} = ${q}²$.` },
        { t: `(${p}y − ${q})²`, fb: `Teste com $y = 1$: $${P} − ${Q} = ${P - Q}$, mas $(${p} − ${q})² = ${(p - q) ** 2}$.` },
        { t: `(${P}y − ${q})(${P}y + ${q})`, fb: `$${P}y²$ é o quadrado de $${p}y$, porque $${p}y · ${p}y = ${P}y²$.` },
        { t: `(${p}y + ${q})²`, fb: 'Esse é o quadrado da soma, com três termos.' },
        { t: `(${q} − ${p}y)(${q} + ${p}y)`, fb: `Ordem trocada: isso dá $${Q} − ${P}y²$.` },
      ], [`Qual expressão vezes ela mesma dá $${P}y²$?`, `$${p}y · ${p}y = ${P}y²$ e $${q} · ${q} = ${Q}$.`, `$(${p}y − ${q})(${p}y + ${q})$.`])] };
    },
    soma() {
      const v = letra(), k = sortear(2, 9);
      return { tags: [], partes: [escolha(`Quanto é $(${v} + ${k})²$?`, [
        { t: `${v}² + ${2 * k}${v} + ${k * k}`, certo: true, fb: `Quadrado do primeiro, duas peças $${k}${v}$, quadrado do segundo.` },
        { t: `${v}² + ${k * k}`, fb: 'Faltaram as duas peças do meio, marcadas na figura.', fig: figSoma(v, String(k), v + '²', k + v, String(k * k), true) },
        { t: `${v}² + ${k}${v} + ${k * k}`, fb: `São duas peças $${k}${v}$: o meio é $${2 * k}${v}$.` },
        { t: `${v}² − ${2 * k}${v} + ${k * k}`, fb: 'É uma soma: o termo do meio é positivo.' },
        { t: `${v}² + ${2 * k}${v} + ${2 * k}`, fb: `$${k}² = ${k} · ${k} = ${k * k}$, não $${k} · 2$.` },
      ], ['Imagine o quadrado em quatro peças.', `As peças são $${v}²$, $${k}${v}$, $${k}${v}$ e $${k * k}$.`, `$${v}² + ${2 * k}${v} + ${k * k}$.`])] };
    },
    difq() {
      const v = letra(), k = sortear(2, 9);
      return { tags: ['contraste'], partes: [escolha(`Quanto é $(${v} − ${k})²$?`, [
        { t: `${v}² − ${2 * k}${v} + ${k * k}`, certo: true, fb: `O meio fica negativo e o último, $${k * k}$, positivo.` },
        { t: `${v}² − ${k * k}`, fb: `Esse é o resultado de $(${v} − ${k})(${v} + ${k})$. No quadrado aparece o termo do meio.` },
        { t: `${v}² + ${k * k}`, fb: 'Faltou o termo do meio, com sinal de menos.' },
        { t: `${v}² − ${2 * k}${v} − ${k * k}`, fb: `$(−${k}) · (−${k}) = +${k * k}$. O último termo é positivo.` },
        { t: `${v}² − ${k}${v} + ${k * k}`, fb: `O meio é dobrado: $2 · ${k} · ${v} = ${2 * k}${v}$.` },
      ], ['Use $(a − b)² = a² − 2ab + b²$.', `O meio é $2 · ${v} · ${k}$ com sinal de menos.`, `$${v}² − ${2 * k}${v} + ${k * k}$.`])] };
    },
    tqp() {
      const a = sortear(2, 5), b = escolher([1, 3, 5, 7].filter((n) => n !== a));
      const area = `${a * a}x² + ${2 * a * b}x + ${b * b}`;
      return { tags: [], partes: [escolha(`Um quadrado tem área $${area}$. Quanto mede o lado?`, [
        { t: `${a}x + ${b}`, certo: true, fb: `$(${a}x + ${b})² = ${area}$.` },
        { t: `${a * a}x + ${b * b}`, fb: `Esses são as áreas das pontas. Os lados são $${a}x$ e $${b}$.`, fig: figSoma(a + 'x', String(b), a * a + 'x²', a * b + 'x', String(b * b)) },
        { t: `${a}x − ${b}`, fb: 'O termo do meio é positivo: é soma.' },
        { t: `${a}x² + ${b}`, fb: `O lado da peça $${a * a}x²$ é $${a}x$, sem o quadrado.` },
        { t: 'Não é possível saber', txt: true, fb: `É um quadrado perfeito: $${a * a}x² = (${a}x)²$, $${b * b} = ${b}²$ e $2 · ${a}x · ${b} = ${2 * a * b}x$.` },
      ], [`Qual expressão vezes ela mesma dá $${a * a}x²$? E $${b * b}$?`, `Os lados das pontas são $${a}x$ e $${b}$. Confira o meio: $2 · ${a}x · ${b}$.`, `O lado é $${a}x + ${b}$.`])] };
    },
    contraste() {
      const k = sortear(3, 9), K = k * k;
      if (Math.random() < 0.5) {
        return { tags: ['contraste'], partes: [escolha(`Qual expressão é igual a $(x − ${k})(x + ${k})$?`, [
          { t: `x² − ${K}`, certo: true, fb: `Diferença vezes soma dá diferença de quadrados: $x² − ${k}²$.` },
          { t: `x² − ${2 * k}x + ${K}`, fb: `Esse é $(x − ${k})²$. Aqui um parêntese tem menos e o outro tem mais, e os termos do meio se cancelam.` },
          { t: `x² + ${2 * k}x + ${K}`, fb: `Esse é $(x + ${k})²$.` },
          { t: `x² − ${k}`, fb: `$${k} · ${k} = ${K}$. O segundo termo é $${K}$.` },
          { t: `x² + ${K}`, fb: `O sinal fica negativo: $(−${k}) · (+${k}) = −${K}$.` },
        ], ['Multiplique termo a termo.', `$x · x − ${k}x + ${k}x − ${K}$. O que acontece com $−${k}x + ${k}x$?`, `Os termos do meio se cancelam: $x² − ${K}$.`])] };
      }
      return { tags: ['contraste'], partes: [escolha(`Qual destas é a forma fatorada de $x² − ${2 * k}x + ${K}$?`, [
        { t: `(x − ${k})²`, certo: true, fb: `Três termos com o meio negativo: quadrado da diferença.` },
        { t: `(x − ${k})(x + ${k})`, fb: `Esse dá $x² − ${K}$, só dois termos.` },
        { t: `(x + ${k})²`, fb: 'O meio é negativo, então é diferença.' },
        { t: `(x − ${K})²`, fb: `O lado da peça $${K}$ é $${k}$.` },
        { t: 'Não tem forma fatorada', txt: true, fb: `Tem: $x²$ e $${K}$ são quadrados e $${2 * k}x = 2 · x · ${k}$.` },
      ], ['Conte os termos: são três.', `Três termos, pontas quadradas, meio $2 · x · ${k}$ negativo.`, `$(x − ${k})²$.`])] };
    },
    contexto() {
      const L = escolher([10, 14, 15, 16, 18, 25, 30]);
      const c = escolher([
        { lugar: `uma quadra quadrada de <strong>${L} m</strong> de lado`, meio: 'uma piscina quadrada de lado <strong>y</strong>', resto: 'continua sendo quadra' },
        { lugar: `um terreno quadrado de <strong>${L} m</strong> de lado`, meio: 'uma casa de base quadrada de lado <strong>y</strong>', resto: 'vira quintal' },
        { lugar: `uma toalha de mesa quadrada de <strong>${L} dm</strong> de lado`, meio: 'um bordado quadrado de lado <strong>y</strong>', resto: 'fica sem bordado' },
        { lugar: `uma praça quadrada de <strong>${L} m</strong> de lado`, meio: 'um chafariz de base quadrada de lado <strong>y</strong>', resto: 'continua com grama' },
      ]);
      const L2 = L * L;
      return { tags: [], contexto: `Em ${c.lugar}, no centro, há ${c.meio}. O resto ${c.resto}.`, partes: [escolha('Qual é a forma fatorada da área que sobra?', [
        { t: `(${L} − y)(${L} + y)`, certo: true, fb: `$${L2} − y² = (${L} − y)(${L} + y)$.` },
        { t: `(${L} − y)²`, fb: `O que sobra é um L, e o L não é um quadrado. Teste com $y = 2$: $${L2} − 4 = ${L2 - 4}$, mas $(${L} − 2)² = ${(L - 2) ** 2}$.`, fig: figL(L, 'y') },
        { t: `(${L} + y)²`, fb: 'Fica maior que o todo! A área tem que diminuir quando o centro cresce.' },
        { t: `${L2} − y`, fb: 'O centro é quadrado: a área dele é $y · y = y²$.', fig: figCanteiro('y') },
        { t: `(y − ${L})(y + ${L})`, fb: `Ordem trocada: isso dá $y² − ${L2}$, que é negativo. Área não pode ser negativa.` },
      ], ['Área do todo menos área do centro.', `$${L2} − y² = ${L}² − y²$.`, `$(${L} − y)(${L} + y)$.`])] };
    },
    mental() {
      const d = escolher([1, 2, 2, 3]), N = sortear(31, 89), M = N - d, R = (N - M) * (N + M);
      const erros = { [d * d]: `Isso é $(${N} − ${M})²$. Use $(${N} − ${M}) · (${N} + ${M})$.` };
      if (d > 1) erros[N + M] = `Faltou multiplicar por $${N} − ${M} = ${d}$.`;
      return { tags: [], partes: [numero(`Sem calculadora: quanto é $${N}² − ${M}²$?`, R, {
        fbCerto: `$(${N} − ${M})(${N} + ${M}) = ${d} · ${N + M} = ${R}$.`,
        erros,
        dicas: [`Use $a² − b² = (a − b)(a + b)$.`, `$${N} − ${M} = ${d}$ e $${N} + ${M} = ${N + M}$.`, `$${d} · ${N + M} = ${R}$.`],
      })] };
    },
    conferir() {
      const k = sortear(3, 9), K = k * k, t = k + sortear(1, 3);
      const nome = escolher(['Lia', 'Davi', 'Caio', 'Bia', 'Rafa']);
      return { tags: ['conferencia'], contexto: `${nome} escreveu $x² − ${K} = (x − ${k})²$. Teste com $x = ${t}$.`, partes: [
        numero(`Quanto vale $x² − ${K}$ com $x = ${t}$?`, t * t - K, { dicas: [`$x² = ${t} · ${t}$.`, `$${t * t} − ${K}$.`, `$${t * t - K}$.`] }),
        numero(`E $(x − ${k})²$ com $x = ${t}$?`, (t - k) ** 2, {
          erros: { [2 * (t - k)]: `$${t - k}² = ${t - k} · ${t - k}$.` },
          dicas: [`Primeiro o parêntese: $${t} − ${k}$.`, `$${t - k}²$.`, `$${(t - k) ** 2}$.`],
        }),
        escolha(`Então ${nome} acertou?`, [
          { t: 'Não, os valores são diferentes', txt: true, certo: true, fb: 'Isso: lados diferentes, fatoração errada.' },
          { t: 'Sim', txt: true, fb: `$${t * t - K}$ e $${(t - k) ** 2}$ não são iguais.` },
        ], null, { fixo: true }),
        escolha('Qual é a fatoração certa?', [
          { t: `(x − ${k})(x + ${k})`, certo: true, fb: `Confira: $${t - k} · ${t + k} = ${t * t - K}$.` },
          { t: `(x + ${k})²`, fb: 'Quadrado da soma tem três termos.' },
          { t: `(x − ${K})(x + ${K})`, fb: `$${K} = ${k}²$. Use $${k}$.` },
        ], ['Diferença de quadrados.', 'Diferença vezes soma.', `$(x − ${k})(x + ${k})$.`]),
      ] };
    },
  };

  function gerar1C(hist) {
    const ult = hist.slice(-4);
    let tipo;
    if (hist.length === 0) tipo = 'contexto';
    else if (hist.length >= 2 && !ult.some((r) => r.ok && r.tags.includes('contraste'))) tipo = escolher(['contraste', 'difq']);
    else if (hist.length >= 3 && !ult.some((r) => r.tags.includes('conferencia'))) tipo = 'conferir';
    else {
      const recentes = ult.map((r) => r.tipo);
      tipo = escolher(Object.keys(gerador).filter((t) => !recentes.includes(t)));
    }
    const item = gerador[tipo]();
    item.tipo = tipo;
    return item;
  }

  const etapa1C = {
    id: '1C',
    titulo: 'Juntando tudo',
    descritor: 'D09 e D14',
    minutos: '6 a 10',
    resumo: 'Questões misturadas, no formato da prova.',
    telas: [
      {
        tipo: 'texto',
        titulo: 'Agora é como na prova',
        html: 'As questões vêm <strong>misturadas</strong>: quadrado da soma, quadrado da diferença e diferença de quadrados.<br><br>Antes de responder, pergunte: <strong>quantos termos?</strong> Que sinal? Na dúvida, troque a letra por um número.<br><br>Para concluir: 4 acertos de primeira nas últimas 5 questões, com uma questão de comparar e uma conferência com número.',
      },
      {
        tipo: 'passos',
        titulo: 'Como escolher o caminho',
        html: 'Antes de cada questão, faça estas perguntas. Um passo por toque.',
        passos: [
          { titulo: 'Tem parênteses ao quadrado?', html: 'Como $(x + 5)²$ ou $(x − 5)²$. Expanda com <strong>três termos</strong>: primeiro ao quadrado, $2 ·$ primeiro $·$ segundo, segundo ao quadrado.', fig: { nome: 'somaPecas' } },
          { titulo: 'Dois quadrados com menos no meio?', html: 'Como $x² − 36$. Ache os lados e faça <strong>diferença vezes soma</strong>: $(x − 6)(x + 6)$.', fig: { nome: 'retangulo' } },
          { titulo: 'Três termos com as pontas quadradas?', html: 'Como $x² + 12x + 36$. Ache o lado de cada ponta e confira o meio: $(x + 6)²$.' },
          { titulo: 'Na dúvida', tipo: 'ok', marca: '✓', html: 'Troque a letra por um número e compare os dois lados.' },
        ],
      },
      { tipo: 'dominio', titulo: 'Treino misto', html: '', gerar: gerar1C },
      {
        tipo: 'fim',
        html: 'Você concluiu a trilha de produtos notáveis! Agora você sabe escolher entre $(a + b)²$, $(a − b)²$ e $(a + b)(a − b)$, e conferir com um número.',
      },
    ],
  };

  EA.registrarTrilha({
    id: 'T1',
    titulo: 'Produtos notáveis',
    descricao: 'Quadrado da soma, quadrado da diferença e diferença de quadrados, com figuras que se movem.',
    etapas: [etapa1A, etapa1B, etapa1C],
  });
  EA.gerador1C = gerador;
})();
