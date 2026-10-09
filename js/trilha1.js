// Trilha 1: produtos notáveis (D14 e D09). Conteúdo a partir do diagnóstico de 08/10/2026.
(function () {
  const EA = window.EA;
  const { sortear, escolher } = EA;

  // Atalho para item de uma parte só, de escolha
  const escolha = (html, opcoes, dicas, extra = {}) => ({ tipo: 'escolha', html, opcoes, dicas, ...extra });
  const numero = (html, resposta, extra = {}) => ({ tipo: 'numero', html, resposta, ...extra });

  const figSoma = (a, b, aa, ab, bb) => ({ nome: 'somaPecas', p: { rot: { a, b, aa, ab, bb } } });
  const figL = (a, b) => ({ nome: 'lVsQuadrado', p: { rot: { a: String(a), b: String(b) } } });
  const figCanteiro = (b) => ({ nome: 'canteiroArea', p: { rot: { b } } });

  // ------------------------------------------------------------------
  // 1A. Quadrado da soma e da diferença
  // ------------------------------------------------------------------
  const etapa1A = {
    id: '1A',
    titulo: 'Quadrado da soma e da diferença',
    descritor: 'D14',
    minutos: '5 a 8',
    resumo: 'Por que (a + b)² tem três termos, e não dois.',
    telas: [
      {
        tipo: 'teste',
        titulo: 'Teste rápido',
        html: 'São só 3 perguntas, uma tentativa em cada. Se acertar as três, você já domina esta etapa e pode pular.',
        seAcertarTudo: 'Muito bem! Você pode ir direto para a conclusão ou estudar a etapa assim mesmo.',
        seErrar: 'Sem problema. Agora vamos ver isso com peças, passo a passo.',
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
        tipo: 'anim',
        titulo: 'O quadrado de lado $a + b$',
        fig: 'somaPecas',
        passos: [
          'Este quadrado tem lado $a + b$. A área dele é $(a + b)²$. Vamos preencher com peças.',
          'Primeira peça: um quadrado de lado $a$. Área $a²$.',
          'Segunda peça: um quadrado de lado $b$. Área $b²$. Muita gente para aqui e escreve $a² + b²$. Mas olhe: ainda tem buraco!',
          'Faltam duas peças retangulares, cada uma de lados $a$ e $b$. Cada uma tem área $ab$.',
          'Somando as quatro peças: $a² + ab + ab + b² = a² + 2ab + b²$.',
        ],
      },
      {
        tipo: 'regra',
        titulo: 'Quadrado da soma',
        formula: '(a + b)² = a² + 2ab + b²',
        html: 'O quadrado do primeiro, mais duas vezes o primeiro vezes o segundo, mais o quadrado do segundo.<br><br>O $2ab$ são as <strong>duas peças do meio</strong>. Sem elas, o quadrado fica com buraco.',
      },
      {
        tipo: 'item',
        titulo: 'O piso do quarto',
        item: {
          contexto: 'O quarto da Ana é quadrado e tem lado $(x + 3)$ metros.',
          partes: [
            escolha('Qual é a área do piso?', [
              { t: 'x² + 6x + 9', certo: true, fb: 'Isso! Peça $x²$, duas peças $3x$ e a peça $9$.' },
              { t: 'x² + 9', fb: 'Faltaram as duas peças do meio. Veja: o quadrado de lado $x + 3$ tem quatro peças.', fig: figSoma('x', '3', 'x²', '3x', '9') },
              { t: 'x² + 3x + 9', fb: 'Você colocou só uma peça $3x$. São duas: $3x + 3x = 6x$.', fig: figSoma('x', '3', 'x²', '3x', '9') },
              { t: 'x² + 6x + 6', fb: 'A peça do canto é $3 · 3 = 9$, não $3 · 2$.' },
            ], [
              'Imagine o quadrado de lado $x + 3$ dividido em quatro peças.',
              'As peças são $x²$, $3x$, $3x$ e $3²$.',
              '$(x + 3)² = x² + 2 · 3 · x + 3² = x² + 6x + 9$.',
            ]),
            numero('Agora confira com um número. Com $x = 2$, o lado mede $5$ e a área é $25$. Quanto dá $x² + 6x + 9$ com $x = 2$?', 25, {
              fbCerto: '$4 + 12 + 9 = 25$. Bateu com a área! Conferir com um número é um ótimo hábito.',
              erros: { 13: 'Você fez $4 + 9$? Não esqueça do $6x = 6 · 2 = 12$.', 19: '$x² = 2 · 2 = 4$, não $2$. Refaça: $4 + 12 + 9$.' },
              fbPadrao: 'Troque $x$ por $2$: $2² + 6 · 2 + 9$.',
              dicas: ['Faça uma parte de cada vez: $x²$, depois $6x$, depois some $9$.', '$x² = 4$ e $6x = 12$.', '$4 + 12 + 9 = 25$.'],
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
          'Queremos só o quadrado tracejado, de lado $a − b$. Ele é o $(a − b)²$.',
          'Tire a faixa de cima: menos $ab$.',
          'Tire a faixa da direita: menos $ab$. Mas atenção: o cantinho $b²$ saiu nas duas faixas, ou seja, saiu duas vezes!',
          'Então devolva o cantinho uma vez: mais $b²$. Resultado: $a² − 2ab + b²$.',
        ],
      },
      {
        tipo: 'regra',
        titulo: 'Quadrado da diferença',
        formula: '(a − b)² = a² − 2ab + b²',
        html: 'Igual ao quadrado da soma, mas o termo do meio fica com sinal de menos.<br><br>O último termo, $b²$, continua <strong>positivo</strong>: $(−b) · (−b) = +b²$.',
      },
      {
        tipo: 'item',
        item: {
          partes: [
            escolha('Quanto é $(a − 5)²$?', [
              { t: 'a² − 10a + 25', certo: true, fb: '$a²$, menos $2 · 5 · a$, mais $5²$.' },
              { t: 'a² − 25', fb: '$a² − 25$ é o resultado de $(a − 5)(a + 5)$, outro produto. No quadrado aparece o termo do meio, $−10a$.' },
              { t: 'a² + 25', fb: 'Faltou o termo do meio. Lembre das duas faixas que saem.', fig: { nome: 'difPecas', p: { passo: 4 } } },
              { t: 'a² − 10a − 25', fb: '$(−5) · (−5) = +25$. O último termo é sempre positivo.' },
              { t: 'a² − 5a + 25', fb: 'O termo do meio é dobrado: $2 · 5 · a = 10a$.' },
            ], [
              'Use $(a − b)² = a² − 2ab + b²$ com $b = 5$.',
              'O meio é $2 · a · 5$, com sinal de menos.',
              '$(a − 5)² = a² − 10a + 25$.',
            ]),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'O azulejo',
        item: {
          contexto: 'Um azulejo quadrado tem lado $(2y + 1)$ decímetros.',
          partes: [
            escolha('Qual é a área do azulejo?', [
              { t: '4y² + 4y + 1', certo: true, fb: '$(2y)² = 4y²$, o meio é $2 · 2y · 1 = 4y$ e o canto é $1$.' },
              { t: '4y² + 1', fb: 'Faltaram as duas peças do meio, cada uma $2y · 1 = 2y$.', fig: figSoma('2y', '1', '4y²', '2y', '1') },
              { t: '2y² + 4y + 1', fb: 'O $2$ também vai ao quadrado: $(2y)² = 2y · 2y = 4y²$.' },
              { t: '4y² + 2y + 1', fb: 'São duas peças $2y$ no meio: $2y + 2y = 4y$.' },
            ], [
              'O primeiro termo é $2y$. Eleve ele todo ao quadrado.',
              '$(2y)² = 4y²$. O meio é $2 · 2y · 1$.',
              '$4y² + 4y + 1$.',
            ]),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'O caminho de volta',
        item: {
          contexto: 'Um adesivo quadrado tem área $x² + 10x + 25$.',
          partes: [
            escolha('Quanto mede o lado do adesivo?', [
              { t: 'x + 5', certo: true, fb: 'Isso. Confira: $(x + 5)² = x² + 10x + 25$.' },
              { t: 'x + 25', fb: '$25$ é a área da peça do canto. O lado dela é $5$, porque $5 · 5 = 25$.', fig: figSoma('x', '5', 'x²', '5x', '25') },
              { t: 'x² + 5', fb: '$x²$ é área. O lado da peça $x²$ é $x$.' },
              { t: 'x − 5', fb: 'O termo do meio é $+10x$, positivo. Então é soma.' },
              { t: 'Não dá para saber', txt: true, fb: 'Dá sim: $x²$ e $25$ são quadrados, e $10x = 2 · x · 5$. É um quadrado perfeito.' },
            ], [
              'Procure o lado de cada ponta: qual número vezes ele mesmo dá $x²$? E $25$?',
              'Os lados das pontas são $x$ e $5$. Confira o meio: $2 · x · 5 = 10x$.',
              'O lado é $x + 5$, porque $(x + 5)² = x² + 10x + 25$.',
            ]),
          ],
        },
      },
      {
        tipo: 'fim',
        html: 'Agora você sabe que $(a + b)²$ tem <strong>três termos</strong>. Próxima parada: a diferença de quadrados, o erro mais comum dos simulados.',
      },
    ],
  };

  // ------------------------------------------------------------------
  // 1B. Diferença de quadrados (foco principal)
  // ------------------------------------------------------------------
  const etapa1B = {
    id: '1B',
    titulo: 'Diferença de quadrados',
    descritor: 'D09',
    minutos: '6 a 8',
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
        item: {
          partes: [
            escolha('Qual expressão dá a área que continua com piso?', [
              { t: '144 − x²', certo: true, fb: 'Isso. Área do pátio menos área do canteiro: $12 · 12 − x · x$.' },
              { t: '144 − x', fb: 'O canteiro é um quadrado. A área dele é $x · x = x²$, não $x$.', fig: figCanteiro('x') },
              { t: '12 − x', fb: '$12 − x$ é um comprimento. Precisamos de área: pátio inteiro menos canteiro.' },
              { t: '(12 − x)²', fb: 'Vamos testar essa daqui a pouco. Por enquanto, pense: área do pátio menos área do canteiro.' },
            ], [
              'Área do pátio menos área do canteiro.',
              'Pátio: $12 · 12 = 144$. Canteiro: $x · x$.',
              '$144 − x²$.',
            ]),
          ],
        },
      },
      {
        tipo: 'widget',
        titulo: 'Mexa no canteiro',
        html: 'Use os botões $−$ e $+$ (ou deslize) para mudar o tamanho do canteiro. Compare as contas com o piso de verdade.',
        widget: 'patio',
        p: { x: 5 },
        item: {
          partes: [
            escolha('Qual expressão <strong>sempre</strong> dá o mesmo valor que $144 − x²$?', [
              { t: '(12 − x)(12 + x)', certo: true, fb: 'Isso! Para qualquer $x$, $(12 − x)(12 + x)$ bate com o piso.' },
              { t: '(12 − x)²', fb: 'Com $x = 5$: o piso é $144 − 25 = 119$, mas $(12 − 5)² = 49$. Não bate. Que figura sobra quando você tira o canteiro? Um L, e o L não é um quadrado.', fig: figL(12, 'x') },
              { t: 'As duas', txt: true, fb: 'Coloque $x = 5$ e compare: $119$, $49$ e $119$. Só uma acompanha.' },
            ], [
              'Escolha $x = 5$ e olhe os números.',
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
          'Este é o pátio com o canteiro no meio.',
          'Empurre o canteiro para o canto. A área de piso continua a mesma.',
          'O piso forma um <strong>L</strong>. O L não é um quadrado: o quadrado tracejado de lado $12 − x$ é menor que ele.',
          'Corte o L em duas partes.',
          'Gire a parte listrada e encaixe embaixo da outra.',
          'Virou um retângulo! Um lado mede $12 − x$ e o outro mede $12 + x$. Área: $(12 − x)(12 + x)$.',
        ],
      },
      {
        tipo: 'regra',
        titulo: 'Diferença de quadrados',
        formula: 'a² − b² = (a − b)(a + b)',
        html: 'Quando aparecem <strong>dois quadrados com subtração</strong> no meio, a forma fatorada é um produto: diferença vezes soma.<br><br>No pátio: $12² − x² = (12 − x)(12 + x)$.',
      },
      {
        tipo: 'cartoes',
        titulo: 'Três parecidos, três diferentes',
        html: 'Esses três se parecem, mas cada um dá uma coisa. Teste com $a = 5$ e $b = 2$.',
        cartoes: [
          { titulo: '(a + b)²', tom: 'soma', fig: { nome: 'somaPecas' }, resultado: '$= a² + 2ab + b²$', teste: '$7² = 49$' },
          { titulo: '(a − b)²', tom: 'dif', fig: { nome: 'difPecas', p: { passo: 1 } }, resultado: '$= a² − 2ab + b²$', teste: '$3² = 9$' },
          { titulo: '(a + b)(a − b)', tom: 'prod', fig: { nome: 'retangulo' }, resultado: '$= a² − b²$', teste: '$7 · 3 = 21 = 25 − 4$' },
        ],
        depois: 'Só o último tem <strong>dois termos</strong> quando expandido. Os dois quadrados têm três.',
      },
      {
        tipo: 'item',
        titulo: 'Reconhecer',
        item: {
          tags: ['contraste'],
          partes: [
            escolha('Qual destas é uma diferença de quadrados?', [
              { t: 'x² − 49', certo: true, fb: '$x²$ é quadrado, $49 = 7²$ é quadrado, e tem subtração.' },
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
        tipo: 'item',
        titulo: 'Fatorar',
        item: {
          partes: [
            escolha('Fatore $x² − 81$.', [
              { t: '(x − 9)(x + 9)', certo: true, fb: '$81 = 9²$, então $x² − 9² = (x − 9)(x + 9)$.' },
              { t: '(x − 9)²', fb: 'Teste com $x = 10$: $100 − 81 = 19$, mas $(10 − 9)² = 1$. Não bate.', fig: figL('x', 9) },
              { t: '(x + 9)²', fb: 'Esse é o quadrado da soma: dá $x² + 18x + 81$.' },
              { t: '(x − 81)(x + 81)', fb: 'Use o lado, não a área: $81 = 9²$, então o número é $9$.' },
              { t: 'x − 9', fb: 'Faltou um parêntese. Diferença de quadrados vira diferença vezes soma.' },
            ], [
              'Escreva $81$ como um número ao quadrado.',
              '$81 = 9²$. Use $a² − b² = (a − b)(a + b)$.',
              '$x² − 81 = (x − 9)(x + 9)$.',
            ]),
            numero('Confira com um número. Com $x = 10$, $x² − 81 = 100 − 81 = 19$. Quanto dá $(10 − 9)(10 + 9)$?', 19, {
              fbCerto: '$1 · 19 = 19$. Bateu! A fatoração está certa.',
              erros: { 1: 'Você calculou $(10 − 9)²$. Multiplique $(10 − 9)$ por $(10 + 9)$.', 361: '$19²$ não. É $1 · 19$.' },
              dicas: ['Calcule cada parêntese primeiro.', '$10 − 9 = 1$ e $10 + 9 = 19$.', '$1 · 19 = 19$.'],
            }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Com número na frente',
        item: {
          partes: [
            escolha('Fatore $16y² − 25$.', [
              { t: '(4y − 5)(4y + 5)', certo: true, fb: '$16y² = (4y)²$ e $25 = 5²$.' },
              { t: '(4y − 5)²', fb: 'Teste com $y = 2$: $64 − 25 = 39$, mas $(8 − 5)² = 9$. Não bate.' },
              { t: '(16y − 5)(16y + 5)', fb: '$16y²$ é o quadrado de $4y$, porque $4y · 4y = 16y²$.' },
              { t: '(8y − 5)(8y + 5)', fb: '$8y · 8y = 64y²$. O número que ao quadrado dá $16$ é $4$, não a metade de $16$.' },
              { t: '(4y − 25)(4y + 25)', fb: '$25 = 5²$. Use $5$.' },
            ], [
              'Qual expressão vezes ela mesma dá $16y²$?',
              '$4y · 4y = 16y²$ e $5 · 5 = 25$.',
              '$(4y − 5)(4y + 5)$.',
            ]),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'A quadra e a piscina',
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
            ]),
            numero('Confira com $y = 5$: a área é $400 − 25 = 375$. Quanto dá $(20 − 5)(20 + 5)$?', 375, {
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
              erros: { 43: '$m² = 3 · 3 = 9$, não $6$.', 46: '$m² = 3 · 3 = 9$, não $3$.', 16: 'Esse é o valor de $(7 − 3)²$. Aqui é $49 − 3²$.' },
              dicas: ['Primeiro $m² = 3 · 3$.', '$m² = 9$.', '$49 − 9 = 40$.'],
            }),
            numero('E quanto vale $(7 − m)²$ com $m = 3$?', 16, {
              erros: { 40: 'Primeiro faça $7 − 3$, depois eleve ao quadrado.', 8: '$4² = 4 · 4 = 16$, não $4 · 2$.', 4: 'Faltou elevar ao quadrado: $4 · 4$.' },
              dicas: ['Faça o parêntese primeiro: $7 − 3$.', '$7 − 3 = 4$. Agora $4²$.', '$4 · 4 = 16$.'],
            }),
            escolha('$40$ e $16$. Marina acertou?', [
              { t: 'Não, os valores são diferentes', txt: true, certo: true, fb: 'Isso. Se a fatoração estivesse certa, os dois lados dariam o mesmo número.' },
              { t: 'Sim', txt: true, fb: 'Se fossem iguais, $40$ teria que ser igual a $16$.' },
            ], null, { fixo: true }),
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
            numero('Sem calculadora: quanto é $61² − 59²$?<br><span class="nota">Use a regra $a² − b² = (a − b)(a + b)$.</span>', 240, {
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
        html: 'Na dúvida, substitua a letra por um número e calcule os dois lados. Se der diferente, a fatoração está errada.<br><br>Com $x = 5$: $144 − 25 = 119$, mas $(12 − 5)² = 49$. Então $144 − x²$ <strong>não</strong> é $(12 − x)²$.',
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
        { t: `${v}² + ${k * k}`, fb: 'Faltaram as duas peças do meio.', fig: figSoma(v, String(k), v + '²', k + v, String(k * k)) },
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
    minutos: '5 a 8',
    resumo: 'Questões misturadas, no formato da prova.',
    telas: [
      {
        tipo: 'texto',
        titulo: 'Agora é como na prova',
        html: 'As questões vêm <strong>misturadas</strong>: quadrado da soma, quadrado da diferença e diferença de quadrados.<br><br>Antes de responder, pergunte: <strong>quantos termos?</strong> Que sinal? Na dúvida, troque a letra por um número.<br><br>Para concluir: 4 acertos de primeira nas últimas 5 questões, com uma questão de comparar e uma conferência com número.',
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
