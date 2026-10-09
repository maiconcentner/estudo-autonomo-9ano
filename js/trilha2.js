// Trilha 2: relações métricas no triângulo retângulo (D27). Conteúdo a partir do diagnóstico de 08/10/2026,
// seção 5. Notação do livro (cap. 6, Movimento do aprender) e do projeto Relações Métricas Dinâmicas:
// a = BC (hipotenusa), b = AC, c = AB, h = AH, m = BH (projeção de c), n = HC (projeção de b).
// c² = a · m, b² = a · n, h² = m · n, a · h = b · c.
(function () {
  const EA = window.EA;
  const { sortear, escolher, num } = EA;

  const escolha = (html, opcoes, dicas, extra = {}) => ({ tipo: 'escolha', html, opcoes, dicas, ...extra });
  const numero = (html, resposta, extra = {}) => ({ tipo: 'numero', html, resposta, ...extra });
  const tri = (p) => ({ nome: 'triRet', p });

  // Cenas do projeto Relações Métricas Dinâmicas (mesmos nomes usados em sala)
  const CENAS = {
    telhado: {
      intro: 'A tesoura de um telhado tem dois caibros, AB e AC, que formam um ângulo reto no topo A. A viga BC fica embaixo e o pontalete AH vai do topo até a viga.',
      a: 'a viga BC', b: 'o caibro AC', c: 'o caibro AB', h: 'o pontalete AH', m: 'o trecho BH da viga', n: 'o trecho HC da viga', cena: 'telhado',
    },
    torre: {
      intro: 'Uma torre AH é presa por dois cabos, AB e AC, que formam um ângulo reto no alto da torre, em A. Os cabos chegam ao chão nos pontos B e C.',
      a: 'a distância BC entre as pontas dos cabos', b: 'o cabo AC', c: 'o cabo AB', h: 'a altura AH da torre', m: 'a distância BH', n: 'a distância HC', cena: 'torre',
    },
    praca: {
      intro: 'Uma praça tem a forma de um triângulo retângulo ABC, com ângulo reto no canto A. O lado BC fica na avenida. O caminho mais curto do canto A até a avenida é AH.',
      a: 'o lado BC, na avenida', b: 'o lado AC', c: 'o lado AB', h: 'o caminho AH', m: 'o trecho BH', n: 'o trecho HC',
    },
  };
  const maiusc = (t) => t.charAt(0).toUpperCase() + t.slice(1);

  // Retornos por papel do segmento (diagnóstico 5.6)
  const FB = {
    altura: 'Esse segmento é a <strong>altura</strong>: ele sai do ângulo reto e cai na hipotenusa fazendo 90°. Ele fica dentro do triângulo e não é um lado.',
    hipotenusa: 'Esse é a <strong>hipotenusa</strong>, o maior lado. Ela fica de frente para o ângulo reto.',
    catetoParaAltura: 'Esse é um <strong>cateto</strong>, um lado do triângulo. A altura sai do ângulo reto A e cai na hipotenusa.',
    catetoParaHip: 'Esse é um <strong>cateto</strong>: ele forma o ângulo reto. A hipotenusa fica de frente para o ângulo reto.',
    catetoParaProj: 'Esse é o próprio <strong>cateto</strong>. A projeção é a "sombra" dele, deitada em cima da hipotenusa.',
    outroCateto: 'Esse é o <strong>outro cateto</strong>. Compare os dois lados que formam o ângulo reto.',
    outraProj: 'Essa é a projeção do <strong>outro</strong> cateto. A sombra de um cateto fica colada nele: começa no mesmo vértice, B ou C.',
    alturaParaProj: 'Essa é a <strong>altura</strong>. As projeções ficam deitadas em cima da hipotenusa.',
  };

  // ------------------------------------------------------------------
  // 2A. Conhecer o triângulo (identificar por toque)
  // ------------------------------------------------------------------
  const TIPOS_TOQUE = ['hip', 'altura', 'catMenor', 'projMenor', 'telhado', 'catMaior', 'projAB', 'altura', 'catAC', 'projMaior', 'torre'];

  function gerarToque(i) {
    const tipo = i < TIPOS_TOQUE.length ? TIPOS_TOQUE[i] : escolher(TIPOS_TOQUE);
    let m = escolher([2.5, 3, 3.6]), n = escolher([6.4, 7, 7.5]);
    if (Math.random() < 0.5) [m, n] = [n, m];
    const cena = tipo === 'telhado' ? 'telhado' : tipo === 'torre' ? 'torre' : null;
    const giro = cena || i < 2 ? 0 : escolher([0, 90, 180, -90, 25, -30, 150, 200]);
    const espelhar = !cena && Math.random() < 0.4;
    const menor = m < n ? 'c' : 'b', maior = menor === 'c' ? 'b' : 'c';
    const proj = { c: 'm', b: 'n' };
    const lados = ['a', 'b', 'c', 'h'], comProj = ['m', 'n', 'b', 'c', 'h'];
    const fig = { m, n, giro, espelhar, cena, proj: false };
    let pergunta, alvo, alvos = lados, fb = {}, fbCerto, contexto;

    if (tipo === 'hip') {
      pergunta = 'Toque na <strong>hipotenusa</strong>.';
      alvo = 'a';
      fb = { b: FB.catetoParaHip, c: FB.catetoParaHip, h: FB.altura };
      fbCerto = 'A hipotenusa é o maior lado e fica de frente para o ângulo reto.';
    } else if (tipo === 'altura') {
      pergunta = 'Toque na <strong>altura relativa à hipotenusa</strong>.';
      alvo = 'h';
      fb = { a: FB.hipotenusa, b: FB.catetoParaAltura, c: FB.catetoParaAltura };
      fbCerto = 'A altura sai do ângulo reto e cai na hipotenusa fazendo 90°.';
    } else if (tipo === 'catMenor' || tipo === 'catMaior' || tipo === 'catAC') {
      alvo = tipo === 'catMenor' ? menor : tipo === 'catMaior' ? maior : 'b';
      pergunta = tipo === 'catAC' ? 'Toque no <strong>cateto AC</strong>.' : `Toque no <strong>cateto ${tipo === 'catMenor' ? 'menor' : 'maior'}</strong>.`;
      fb = { a: FB.hipotenusa, h: FB.altura, [alvo === 'b' ? 'c' : 'b']: tipo === 'catAC' ? 'Esse é o cateto AB. Veja as letras nas pontas: o cateto AC liga A até C.' : FB.outroCateto };
      fbCerto = 'Os catetos são os dois lados que formam o ângulo reto.';
    } else if (tipo === 'projMenor' || tipo === 'projMaior' || tipo === 'projAB') {
      const cat = tipo === 'projMenor' ? menor : tipo === 'projMaior' ? maior : 'c';
      alvo = proj[cat];
      alvos = comProj;
      pergunta = tipo === 'projAB' ? 'Toque na <strong>projeção do cateto AB</strong> sobre a hipotenusa.' : `Toque na <strong>projeção do cateto ${tipo === 'projMenor' ? 'menor' : 'maior'}</strong> sobre a hipotenusa.`;
      fb = { b: FB.catetoParaProj, c: FB.catetoParaProj, h: FB.alturaParaProj, [alvo === 'm' ? 'n' : 'm']: FB.outraProj };
      fbCerto = 'A projeção é a sombra do cateto em cima da hipotenusa, colada nele.';
      fig.proj = true;
    } else if (tipo === 'telhado' || tipo === 'torre') {
      const C = CENAS[tipo];
      contexto = C.intro;
      alvo = menor;
      pergunta = tipo === 'telhado' ? 'Toque no <strong>menor lado inclinado</strong> do telhado.' : 'Toque no <strong>cabo mais curto</strong>.';
      fb = {
        h: `Esse é ${C.h}, a altura. Ele não é inclinado: é ele que muita gente calcula no lugar do lado! O lado ${tipo === 'telhado' ? 'inclinado' : 'que a pergunta pede'} é um cateto.`,
        a: `Esse é ${C.a}, a hipotenusa. A pergunta pede um ${tipo === 'telhado' ? 'lado inclinado' : 'cabo'}.`,
        [maior]: tipo === 'telhado' ? 'Esse é o caibro maior. Compare os dois lados inclinados.' : 'Esse é o cabo mais comprido.',
      };
      fbCerto = `Isso: ${C[menor]} é um cateto. Para calcular ele, a relação usa a hipotenusa e a sombra dele.`;
    }
    return { fig, pergunta, alvo, alvos, fb, fbCerto, contexto };
  }

  const etapa2A = {
    id: '2A',
    titulo: 'Conhecer o triângulo',
    descritor: 'D27',
    minutos: '6 a 10',
    resumo: 'Hipotenusa, catetos, altura e projeções: achar cada um na figura.',
    telas: [
      {
        tipo: 'passos',
        titulo: 'Os nomes do triângulo retângulo',
        html: 'Toque em <strong>Mostrar o próximo</strong> para ver cada parte.',
        passos: [
          { titulo: 'O ângulo reto', html: 'O quadradinho marca o ângulo reto, de 90°. Aqui ele está no vértice $A$.', fig: tri({ h: false, vertices: true }) },
          { titulo: 'Hipotenusa: $a$', html: 'O <strong>maior lado</strong>. Fica de frente para o ângulo reto.', fig: tri({ h: false, destaque: ['a'], rotulos: { a: 'a' } }) },
          { titulo: 'Catetos: $b$ e $c$', html: 'Os dois lados que <strong>formam</strong> o ângulo reto.', fig: tri({ h: false, destaque: ['b', 'c'], rotulos: { b: 'b', c: 'c' } }) },
          { titulo: 'Altura: $h$', html: 'Sai do ângulo reto e cai na hipotenusa fazendo 90°. Fica <strong>dentro</strong> do triângulo: não é lado.', fig: tri({ destaque: ['h'], rotulos: { h: 'h' } }) },
          { titulo: 'Projeções: $m$ e $n$', html: 'A altura divide a hipotenusa em dois pedaços. Juntos, eles formam a hipotenusa: $a = m + n$.', fig: tri({ destaque: ['m', 'n'], rotulos: { m: 'm', n: 'n' } }) },
        ],
      },
      {
        tipo: 'anim',
        titulo: 'A sombra do cateto',
        fig: 'triRet',
        p: {
          rotulos: { a: 'a', b: 'b', c: 'c', h: 'h', m: 'm', n: 'n' },
          estados: [
            { h: false, rotulos: [] },
            { h: false, destaque: ['c'], rotulos: ['c'] },
            { destaque: ['c'], luz: true, rotulos: ['c'] },
            { destaque: ['c', 'm'], luz: true, rotulos: ['c', 'm'] },
            { destaque: ['b', 'n'], luz: true, rotulos: ['c', 'm', 'b', 'n'] },
            { destaque: ['h'], proj: true, rotulos: ['a', 'b', 'c', 'h', 'm', 'n'] },
          ],
        },
        passos: [
          'Este é um triângulo retângulo. O ângulo reto está em $A$.',
          'Olhe o cateto $AB$, que chamamos de $c$.',
          'Imagine uma luz caindo reto sobre a hipotenusa. Do ponto $A$, ela desce até $H$.',
          'A sombra do cateto $c$ é o pedaço $BH$. Essa sombra se chama <strong>projeção</strong> de $c$: é o $m$.',
          'Do mesmo jeito, a sombra do cateto $b$ (o $AC$) é o pedaço $HC$: a projeção $n$.',
          'E o segmento $AH$, por onde a luz desceu, é a <strong>altura</strong> $h$. Ele não é lado do triângulo.',
        ],
      },
      {
        tipo: 'toque',
        titulo: 'Toque no segmento certo',
        html: 'As figuras aparecem em posições diferentes. Não decore a posição: procure o <strong>ângulo reto</strong> primeiro.',
        meta: 3,
        gerar: gerarToque,
      },
      {
        tipo: 'item',
        titulo: 'Na prova: o que a pergunta pede?',
        item: {
          contexto: 'A tesoura de um telhado tem ângulo reto no topo $A$. A viga $BC$ mede $25$ m e o pontalete $AH$ divide a viga em $9$ m e $16$ m.',
          fig: tri({ m: 9, n: 16, cena: 'telhado', rotulos: { m: '9 m', n: '16 m' } }),
          partes: [
            escolha('A questão pede o <strong>menor lado inclinado</strong>. Qual segmento é esse?', [
              { t: 'O caibro AB, do lado do trecho de 9 m', txt: true, certo: true, fb: 'Isso. É um cateto: o lado inclinado do telhado.' },
              { t: 'O pontalete AH', txt: true, fb: 'O pontalete é a altura: ele é vertical, não inclinado. Calcular a altura no lugar do lado foi o erro mais comum do simulado.', fig: tri({ m: 9, n: 16, cena: 'telhado', destaque: ['h'], rotulos: { h: 'altura' } }) },
              { t: 'O trecho BH da viga, de 9 m', txt: true, fb: 'Esse trecho é a sombra do lado, em cima da viga. O lado inclinado sobe até o topo.', fig: tri({ m: 9, n: 16, cena: 'telhado', destaque: ['m'], rotulos: { m: 'sombra' } }) },
              { t: 'A viga BC inteira, de 25 m', txt: true, fb: 'A viga é a hipotenusa, deitada. A pergunta pede um lado inclinado.' },
            ], ['Os lados inclinados do telhado são os que sobem até o topo.', 'São os dois catetos, $AB$ e $AC$. O menor fica do lado do trecho menor da viga.', 'É o caibro $AB$.'], { resumo: 'Segmento pedido:' }),
            escolha('E o que é o segmento $AH$?', [
              { t: 'A altura', txt: true, certo: true, fb: 'Isso. Ele sai do ângulo reto e cai na viga fazendo 90°.' },
              { t: 'Um cateto', txt: true, fb: 'Os catetos formam o ângulo reto. $AH$ fica dentro do triângulo.' },
              { t: 'A hipotenusa', txt: true, fb: 'A hipotenusa é a viga $BC$, de frente para o ângulo reto.' },
            ], null, { resumo: '$AH$ é' }),
          ],
        },
      },
      {
        tipo: 'fim',
        html: 'Agora você acha hipotenusa, catetos, altura e projeções em qualquer posição. Próxima parada: de onde vêm as relações.',
      },
    ],
  };

  // ------------------------------------------------------------------
  // 2B. De onde vêm as relações (três triângulos semelhantes) e escolher a relação
  // ------------------------------------------------------------------
  const tres = (par1, par2) => ({ nome: 'tresTri', p: { destaque: { par1, par2 } }, larga: true });

  const etapa2B = {
    id: '2B',
    titulo: 'De onde vêm as relações',
    descritor: 'D27',
    minutos: '8 a 12',
    resumo: 'Três triângulos semelhantes e como escolher a relação certa.',
    telas: [
      {
        tipo: 'texto',
        titulo: 'Uma altura, três triângulos',
        fig: tri({ dois: true }),
        html: 'A altura $AH$ corta o triângulo em dois triângulos menores: o <strong>azul</strong> $ABH$ e o <strong>laranja</strong> $AHC$.<br><br>Os três têm a <strong>mesma forma</strong>: só muda o tamanho. É daí que saem todas as relações.',
      },
      {
        tipo: 'anim',
        titulo: 'Três triângulos semelhantes',
        fig: 'tresTri',
        passos: [
          'Este é o triângulo grande $ABC$, com ângulo reto em $A$.',
          'A altura $AH$ divide ele em dois: o azul ($ABH$) e o laranja ($AHC$). Os dois também têm ângulo reto, em $H$.',
          'Olhe os ângulos: $β$ (um arco) e $γ$ (dois arcos). O grande tem $β$ e $γ$. O azul também. O laranja também!',
          'Separe os triângulos menores.',
          'Gire o azul até a hipotenusa dele ficar deitada.',
          'Vire o azul, como uma página: o ângulo reto fica em cima.',
          'Gire o laranja até a hipotenusa dele ficar deitada.',
          'Vire o laranja também.',
          'Os três estão na mesma posição e têm os mesmos ângulos: são <strong>semelhantes</strong>. As letras mostram o nome de cada lado.',
        ],
      },
      {
        tipo: 'item',
        titulo: 'Você entendeu o movimento?',
        item: {
          partes: [
            escolha('Por que os três triângulos são semelhantes?', [
              { t: 'Têm os mesmos ângulos: 90°, β e γ', txt: true, certo: true, fb: 'Isso. Mesmos ângulos garantem a mesma forma (caso AA).' },
              { t: 'Têm os mesmos lados', txt: true, fb: 'Os lados são diferentes: um triângulo é maior que o outro. O que é igual são os ângulos.' },
              { t: 'Porque todo triângulo é semelhante', txt: true, fb: 'Não é verdade. Precisa ter os mesmos ângulos.' },
            ], null, { resumo: 'São semelhantes porque' }),
            escolha('No triângulo azul, qual lado é a hipotenusa?', [
              { t: 'c (o AB)', txt: true, certo: true, fb: 'Isso. No azul, o ângulo reto está em $H$, e de frente para ele fica $AB$.' },
              { t: 'm', txt: true, fb: '$m$ é um lado do azul que forma o ângulo reto em $H$.' },
              { t: 'h', txt: true, fb: '$h$ forma o ângulo reto do azul. A hipotenusa fica de frente para ele.' },
            ], null, { resumo: 'Hipotenusa do azul:' }),
          ],
        },
      },
      {
        tipo: 'passos',
        titulo: 'As relações saem das proporções',
        html: 'Em triângulos semelhantes, lados que ocupam o mesmo lugar são proporcionais. Um passo por toque.',
        passos: [
          { titulo: 'Azul e grande', html: 'A linha cheia liga base com base; a tracejada, lado esquerdo com lado esquerdo: $c ÷ a = m ÷ c$. Multiplicando cruzado: $c² = a · m$.', fig: tres(['G:a', 'Z:c'], ['G:c', 'Z:m']) },
          { titulo: 'Laranja e grande', html: 'Linha cheia: base com base. Tracejada: lado direito com lado direito. $b ÷ a = n ÷ b$. Então $b² = a · n$.', fig: tres(['G:a', 'O:b'], ['G:b', 'O:n']) },
          { titulo: 'Azul e laranja', html: 'Linha cheia: lado esquerdo com lado esquerdo. Tracejada: lado direito com lado direito. $m ÷ h = h ÷ n$. Então $h² = m · n$.', fig: tres(['Z:m', 'O:h'], ['Z:h', 'O:n']) },
          { titulo: 'A área de dois jeitos', tipo: 'ok', marca: '✓', html: 'Área do grande com os catetos: $b · c ÷ 2$. Com a hipotenusa e a altura: $a · h ÷ 2$. Então $a · h = b · c$.', fig: tri({ destaque: ['h'], rotulos: { a: 'a', b: 'b', c: 'c', h: 'h' } }) },
        ],
      },
      {
        tipo: 'passos',
        titulo: 'Qual relação usar?',
        html: 'Não decore uma lista: olhe <strong>o que a pergunta pede</strong> e o que você já tem.',
        passos: [
          { titulo: '$h² = m · n$', html: 'Quer a <strong>altura</strong> e conhece as duas projeções.' },
          { titulo: '$c² = a · m$  e  $b² = a · n$', html: 'Quer um <strong>cateto</strong> e conhece a hipotenusa e a sombra <strong>desse</strong> cateto.' },
          { titulo: '$a · h = b · c$', html: 'Conhece os dois catetos e a hipotenusa, e quer a altura.' },
          { titulo: '$a² = b² + c²$ (Pitágoras)', html: 'Conhece dois lados de um triângulo retângulo. Serve também para <strong>conferir</strong> a resposta.' },
          { titulo: 'Atenção', tipo: 'atencao', marca: '!', html: 'Antes de escolher a fórmula, marque no desenho o segmento que a pergunta pede. Altura e cateto são coisas diferentes!' },
        ],
      },
      {
        tipo: 'item',
        titulo: 'Escolha a relação',
        item: {
          tags: ['escolher'],
          partes: [
            escolha('Quero a <strong>altura</strong> $h$. Sei que $m = 4$ e $n = 9$. Qual relação?', [
              { t: 'h² = m · n', certo: true, fb: 'Altura com as duas projeções.' },
              { t: 'c² = a · m', fb: 'Essa dá um cateto, e a pergunta pede a altura.' },
              { t: 'a² = b² + c²', fb: 'Você não conhece os catetos.' },
            ], null, { resumo: 'Altura com $m$ e $n$:' }),
            escolha('Quero o <strong>cateto</strong> $c$. Sei que $a = 25$ e $m = 9$. Qual relação?', [
              { t: 'c² = a · m', certo: true, fb: 'Cateto com a hipotenusa e a sombra dele.' },
              { t: 'h² = m · n', fb: 'Essa dá a <strong>altura</strong>, não o cateto. Esse é o erro mais comum!' },
              { t: 'a · h = b · c', fb: 'Você não conhece $h$ nem $b$.' },
            ], null, { resumo: 'Cateto com $a$ e $m$:' }),
            escolha('Quero a <strong>altura</strong> $h$. Sei que $a = 10$, $b = 8$ e $c = 6$. Qual relação?', [
              { t: 'a · h = b · c', certo: true, fb: 'Com os três lados, a área de dois jeitos dá a altura.' },
              { t: 'h² = m · n', fb: 'Você ainda não conhece $m$ e $n$.' },
              { t: 'a² = b² + c²', fb: 'Essa relaciona só os lados. Não aparece $h$.' },
            ], null, { resumo: 'Altura com $a$, $b$ e $c$:' }),
            escolha('Quero o <strong>cateto</strong> $b$. Sei que $a = 20$ e $n = 16$. Qual relação?', [
              { t: 'b² = a · n', certo: true, fb: 'A sombra de $b$ é $n$.' },
              { t: 'c² = a · m', fb: '$c$ usa a sombra $m$. Para $b$, use a sombra dele: $n$.' },
              { t: 'h² = m · n', fb: 'Essa dá a altura.' },
            ], null, { resumo: 'Cateto $b$ com $a$ e $n$:' }),
            escolha('Telhado: a viga de 50 m é dividida em 18 m e 32 m. Quero o <strong>menor lado inclinado</strong>. Qual relação?', [
              { t: 'c² = a · m, com m = 18', certo: true, fb: 'O lado inclinado é um cateto. A sombra dele é o trecho de 18 m.' },
              { t: 'h² = m · n', fb: 'Essa dá o pontalete, a altura. O lado inclinado é um cateto!', fig: tri({ m: 18, n: 32, cena: 'telhado', destaque: ['h'], rotulos: { h: 'altura' } }) },
              { t: 'a = m + n', fb: 'Essa dá só a viga inteira.' },
            ], ['O lado inclinado é cateto ou altura?', 'É cateto. Cateto usa a hipotenusa e a sombra dele.', '$c² = a · m$.'], { resumo: 'Lado inclinado:' }),
          ],
        },
      },
      {
        tipo: 'fim',
        html: 'Você viu de onde vêm as relações e como escolher a certa. Próxima parada: calcular e conferir.',
      },
    ],
  };

  // ------------------------------------------------------------------
  // 2C. Calcular e conferir (escada e domínio)
  // ------------------------------------------------------------------
  const ponte = tri({ m: 18, n: 32, rotulos: { m: '18 m', n: '32 m', c: '?' }, destaque: ['c'] });

  const etapa2C = {
    id: '2C',
    titulo: 'Calcular e conferir',
    descritor: 'D27',
    minutos: '10 a 15',
    resumo: 'A armadilha da altura e a conferência por Pitágoras.',
    telas: [
      {
        tipo: 'passos',
        titulo: 'Exemplo resolvido: a altura',
        html: 'As projeções medem $m = 4$ e $n = 9$. Quanto mede a altura? Um passo por toque.',
        passos: [
          { titulo: 'O que a pergunta pede?', html: 'A altura $h$.', fig: tri({ m: 4, n: 9, rotulos: { m: '4', n: '9', h: '?' }, destaque: ['h'] }) },
          { titulo: 'Qual relação?', html: 'Altura com as duas projeções: $h² = m · n$.' },
          { titulo: 'A conta', html: '$h² = 4 · 9 = 36$.' },
          { titulo: 'Atenção', tipo: 'atencao', marca: '!', html: '$36$ é $h²$, não $h$. Falta a raiz: que número vezes ele mesmo dá $36$?' },
          { titulo: 'Resposta', tipo: 'ok', marca: '✓', html: '$h = 6$, porque $6 · 6 = 36$.' },
        ],
      },
      {
        tipo: 'item',
        titulo: 'Você completa: a altura',
        item: {
          contexto: 'As projeções medem $m = 2$ e $n = 8$.',
          fig: tri({ m: 2, n: 8, rotulos: { m: '2', n: '8', h: '?' }, destaque: ['h'] }),
          partes: [
            escolha('Qual relação dá a altura?', [
              { t: 'h² = m · n', certo: true }, { t: 'h = m + n', fb: '$m + n$ é a hipotenusa inteira.' }, { t: 'h = n − m', fb: 'A diferença das projeções não é lado de nada.' },
            ], null, { resumo: 'Relação:' }),
            numero('Quanto é $m · n = 2 · 8$?', 16, { resumo: '$h² =$', dicas: ['Multiplique.', '$2 · 8$.', '$16$.'] }),
            numero('Então quanto mede $h$?', 4, {
              resumo: '$h =$',
              fbCerto: '$4 · 4 = 16$. Isso!',
              erros: { 16: '$16$ é $h²$. Falta a raiz: que número vezes ele mesmo dá $16$?', 8: 'Não é a metade. Que número vezes ele mesmo dá $16$?' },
              dicas: ['Que número vezes ele mesmo dá 16?', '$4 · 4 = ?$', '$4$.'],
            }),
          ],
        },
      },
      {
        tipo: 'passos',
        titulo: 'Exemplo resolvido: o cateto',
        html: 'A hipotenusa mede $a = 10$ e a projeção do cateto $c$ mede $m = 3,6$. Quanto mede $c$?',
        passos: [
          { titulo: 'O que a pergunta pede?', html: 'Um <strong>cateto</strong>, não a altura.', fig: tri({ m: 3.6, n: 6.4, rotulos: { a: '10', m: '3,6', c: '?' }, destaque: ['c'] }) },
          { titulo: 'Qual relação?', html: 'Cateto com a hipotenusa e a sombra dele: $c² = a · m$.' },
          { titulo: 'A conta', html: '$c² = 10 · 3,6 = 36$, então $c = 6$.' },
          { titulo: 'Confira por Pitágoras', tipo: 'ok', marca: '✓', html: 'A outra projeção é $n = 10 − 3,6 = 6,4$. A altura: $h² = 3,6 · 6,4 = 23,04$, então $h = 4,8$. No triângulo azul: $4,8² + 3,6² = 23,04 + 12,96 = 36 = 6²$. Bateu!' },
        ],
      },
      {
        tipo: 'item',
        titulo: 'Você completa: o cateto',
        item: {
          tags: ['cateto'],
          contexto: 'A hipotenusa mede $25$ e a projeção do cateto $c$ mede $9$.',
          fig: tri({ m: 9, n: 16, rotulos: { a: '25', m: '9', c: '?' }, destaque: ['c'] }),
          partes: [
            escolha('A pergunta pede o quê?', [
              { t: 'Um cateto', txt: true, certo: true }, { t: 'A altura', txt: true, fb: 'Olhe o segmento marcado com ?: ele forma o ângulo reto. É um cateto.' }, { t: 'Uma projeção', txt: true, fb: 'A projeção é o 9, que já foi dado.' },
            ], null, { resumo: 'Pede:' }),
            escolha('Qual relação?', [
              { t: 'c² = a · m', certo: true }, { t: 'h² = m · n', fb: 'Essa dá a altura, não o cateto!' }, { t: 'a · h = b · c', fb: 'Você não conhece $h$ nem $b$.' },
            ], null, { resumo: 'Relação:' }),
            numero('Quanto é $a · m = 25 · 9$?', 225, { resumo: '$c² =$', dicas: ['$25 · 9$.', '$25 · 9 = 25 · 10 − 25$.', '$225$.'] }),
            numero('Então quanto mede $c$?', 15, {
              resumo: '$c =$',
              erros: { 225: '$225$ é $c²$. Falta a raiz.', 112.5: 'Não é a metade. Que número vezes ele mesmo dá $225$?' },
              dicas: ['Que número vezes ele mesmo dá 225?', 'Termina em 5: tente $15$.', '$15 · 15 = 225$.'],
            }),
            numero('Agora confira. A outra projeção é $n = 25 − 9$. Quanto dá?', 16, { resumo: '$n =$' }),
            numero('A altura: $h² = 9 · 16 = 144$. Quanto mede $h$?', 12, { resumo: '$h =$', erros: { 144: 'Falta a raiz de $144$.' } }),
            escolha('$12² + 9² = 144 + 81 = 225$. E $15² = 225$. Bateu?', [
              { t: 'Sim: o cateto 15 está certo', txt: true, certo: true, fb: 'Pitágoras no triângulo azul confirmou a resposta.' },
              { t: 'Não', txt: true, fb: '$225 = 225$. Bateu!' },
            ], null, { fixo: true, resumo: 'Conferência:' }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Sozinho: a ponte',
        item: {
          tags: ['cateto'],
          contexto: 'Uma ponte de madeira tem a forma de um triângulo com ângulo reto no topo. A base, de $50$ m, é dividida em $18$ m e $32$ m pela coluna que desce do topo até a base.',
          fig: ponte,
          partes: [
            escolha('Quanto mede o <strong>menor lado inclinado</strong> da ponte?', [
              { t: '30 m', certo: true, fb: 'Isso. $c² = 50 · 18 = 900$, então $c = 30$.' },
              { t: '24 m', fb: '$24$ é a <strong>altura</strong> (a coluna): $√(18 · 32) = 24$. Esse segmento é o lado inclinado? Não: a pergunta pede um cateto.', fig: tri({ m: 18, n: 32, destaque: ['h'], rotulos: { h: '24 é este' } }) },
              { t: '14 m', fb: '$14 = 32 − 18$. A diferença entre os trechos da base não é lado de nada.', fig: tri({ m: 18, n: 32, destaque: ['m', 'n'], rotulos: { m: '18', n: '32' } }) },
              { t: '18 m', fb: '$18$ é o trecho da base, a sombra do lado. Marque no desenho: o lado inclinado sobe até o topo.', fig: tri({ m: 18, n: 32, destaque: ['m'], rotulos: { m: '18 é este' } }) },
              { t: '50 m', fb: '$50$ é a base inteira, a hipotenusa. O lado inclinado é menor que ela.' },
            ], ['O lado inclinado é um cateto. A sombra dele é o trecho de 18 m.', '$c² = a · m = 50 · 18$.', '$c² = 900$, $c = 30$.'], { resumo: 'Menor lado inclinado:' }),
            numero('Confira por Pitágoras. A coluna (altura) mede $24$ m. Quanto dá $24² + 18²$?', 900, {
              resumo: '$24² + 18² =$',
              fbCerto: '$576 + 324 = 900 = 30²$. Bateu!',
              erros: { 42: 'Eleve cada um ao quadrado antes de somar.', 1800: '$24² = 576$ e $18² = 324$.' },
              dicas: ['$24² = 576$.', '$18² = 324$.', '$576 + 324 = 900$.'],
            }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Investigue o erro',
        item: {
          tags: ['conferencia', 'cateto'],
          contexto: 'Bruno resolveu a questão da ponte e respondeu que o menor lado inclinado mede $24$ m.',
          fig: tri({ m: 18, n: 32, rotulos: { m: '18 m', n: '32 m' } }),
          partes: [
            escolha('O que Bruno calculou?', [
              { t: 'A altura (a coluna)', txt: true, certo: true, fb: 'Isso: $√(18 · 32) = 24$. Ele acertou a conta, mas calculou o segmento errado.' },
              { t: 'O lado inclinado', txt: true, fb: 'O lado inclinado mede $30$. Bruno usou $h² = m · n$, que dá a altura.' },
              { t: 'A diferença dos trechos', txt: true, fb: 'A diferença seria $14$.' },
            ], null, { resumo: 'Bruno calculou' }),
            numero('Bruno pode aproveitar a conta dele. Com a altura $24$ e o trecho $18$, use Pitágoras: quanto é $24² + 18²$?', 900, { resumo: '$24² + 18² =$', dicas: ['$576 + 324$.', '$900$.', '$900$.'] }),
            numero('Então o lado inclinado mede quanto?', 30, { resumo: 'Lado:', erros: { 900: 'Falta a raiz de $900$.' } }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'O caminho ao contrário',
        item: {
          contexto: 'Um açaizeiro está preso por dois cabos que formam ângulo reto no ponto $A$ da árvore, a $12$ m do chão. Um cabo chega ao chão a $9$ m da base da árvore.',
          fig: tri({ m: 9, n: 16, cena: 'torre', rotulos: { h: '12', m: '9', n: '?' }, destaque: ['n'] }),
          partes: [
            numero('A altura é $12$. Quanto é $h²$?', 144, { resumo: '$h² =$' }),
            escolha('Como $h² = m · n$, temos $144 = 9 · n$. Como achar $n$?', [
              { t: 'n = 144 ÷ 9', certo: true }, { t: 'n = 144 − 9', fb: 'É uma multiplicação: o caminho de volta é dividir.' }, { t: 'n = 12 − 9', fb: 'Use a relação $144 = 9 · n$.' },
            ], null, { resumo: 'Achar $n$:' }),
            numero('Quanto mede $n$, a distância do outro cabo até a árvore?', 16, { resumo: '$n =$', erros: { 3: '$12 − 9$ não. Divida: $144 ÷ 9$.', 135: 'Divida, não subtraia: $144 ÷ 9$.' } }),
            numero('E a distância entre as pontas dos cabos no chão, $a = m + n$?', 25, { resumo: '$a =$', erros: { 16: '$16$ é só a outra projeção. Some: $9 + 16$.' } }),
          ],
        },
      },
      {
        tipo: 'item',
        titulo: 'Com vírgula: a mão francesa',
        item: {
          tags: ['cateto', 'conferencia'],
          contexto: 'Uma mão francesa (o suporte de uma prateleira) tem a forma de um triângulo retângulo. O lado maior mede $5$ dm e o reforço, perpendicular a ele, divide esse lado em $1,8$ dm e $3,2$ dm.',
          fig: tri({ m: 1.8, n: 3.2, rotulos: { a: '5', m: '1,8', n: '3,2' } }),
          partes: [
            numero('Quanto mede o reforço (a altura)? Primeiro, $h² = 1,8 · 3,2$. Quanto dá?', 5.76, { resumo: '$h² =$', dicas: ['$18 · 32 = 576$.', 'São duas casas depois da vírgula.', '$5,76$.'] }),
            numero('Então $h$ mede quanto? (Use vírgula.)', 2.4, { resumo: '$h =$', erros: { 5.76: 'Falta a raiz de $5,76$.' }, dicas: ['Que número vezes ele mesmo dá 5,76?', '$24 · 24 = 576$.', '$2,4$.'] }),
            numero('E o lado menor da mão francesa? $c² = 5 · 1,8$. Quanto mede $c$?', 3, { resumo: '$c =$', erros: { 9: '$9$ é $c²$. Falta a raiz.', 2.4: 'Esse é o reforço, a altura. O lado é um cateto.' } }),
            escolha('Confira: $2,4² + 1,8² = 5,76 + 3,24 = 9 = 3²$. Bateu?', [
              { t: 'Sim', txt: true, certo: true, fb: 'É o triângulo 3, 4, 5 com a altura 2,4.' }, { t: 'Não', txt: true, fb: '$9 = 9$. Bateu!' },
            ], null, { fixo: true, resumo: 'Conferência:' }),
          ],
        },
      },
      {
        tipo: 'passos',
        titulo: 'Antes do treino',
        html: 'Em toda questão, siga estes passos.',
        passos: [
          { titulo: 'Marque o que a pergunta pede', html: 'É a altura, um cateto ou uma projeção?' },
          { titulo: 'Escolha a relação', html: 'Altura: $h² = m · n$. Cateto: $c² = a · m$ (a sombra dele). Três lados: $a · h = b · c$.' },
          { titulo: 'Não esqueça a raiz', tipo: 'atencao', marca: '!', html: 'A conta dá o quadrado. A resposta é a raiz.' },
          { titulo: 'Confira', tipo: 'ok', marca: '✓', html: 'Use Pitágoras num dos triângulos.' },
        ],
      },
      {
        tipo: 'dominio',
        titulo: 'Treino misto',
        html: '',
        gerar: gerar2C,
        criterios(j) {
          const certos = j.filter((r) => r.ok).length;
          const catetos = j.filter((r) => r.tags.includes('cateto')).length;
          return [
            { ok: j.length === 5 && certos >= 4, txt: '4 acertos nas últimas 5 questões' },
            { ok: catetos >= 2, txt: 'pelo menos 2 questões pedindo um cateto' },
          ];
        },
      },
      {
        tipo: 'fim',
        html: 'Você concluiu a trilha de relações métricas! Agora você marca o que a pergunta pede, escolhe a relação e confere por Pitágoras.',
      },
    ],
  };

  // ---------- Geradores do treino misto (2C) ----------
  // Família 3, 4, 5: a = 5k, c = 3k, b = 4k, m = 1,8k, n = 3,2k, h = 2,4k
  const KS = [2, 5, 10, 15, 20];
  const r2 = (x) => Math.round(x * 100) / 100;
  function familia() {
    const k = escolher(KS);
    return { a: 5 * k, c: 3 * k, b: 4 * k, m: r2(1.8 * k), n: r2(3.2 * k), h: r2(2.4 * k) };
  }
  // Monta alternativas numéricas sem repetir valores
  function alternativas(certo, erradas, un = '') {
    const vistos = new Set([certo]);
    const ops = [{ t: num(certo) + un, certo: true }];
    erradas.forEach((e) => {
      if (e.v > 0 && !vistos.has(r2(e.v))) {
        vistos.add(r2(e.v));
        ops.push({ t: num(r2(e.v)) + un, fb: e.fb, fig: e.fig });
      }
    });
    return ops.slice(0, 5);
  }

  const gerador2C = {
    altura() {
      const [m, n] = escolher([[4, 9], [2, 8], [3, 12], [4, 16], [1, 9], [9, 16], [8, 18], [4, 25], [5, 20], [6, 24]]);
      const h = Math.sqrt(m * n);
      const f = { m, n, rotulos: { m: num(m), n: num(n), h: '?' }, destaque: ['h'] };
      return { tags: ['altura'], fig: tri(f), partes: [escolha(`As projeções medem $m = ${num(m)}$ e $n = ${num(n)}$. Quanto mede a altura $h$?`, alternativas(h, [
        { v: m * n, fb: `$${num(m * n)}$ é $h²$. Falta a raiz.` },
        { v: n - m, fb: 'A diferença das projeções não é lado de nada.' },
        { v: m + n, fb: `$${num(m + n)}$ é a hipotenusa inteira, $m + n$.` },
        { v: (m + n) / 2, fb: 'Não é a média. Use $h² = m · n$.' },
      ]), ['Altura: $h² = m · n$.', `$h² = ${num(m * n)}$.`, `$h = ${num(h)}$.`])] };
    },
    cateto() {
      const t = familia();
      const nomeCena = escolher(['telhado', 'torre', 'praca', null]);
      const C = nomeCena ? CENAS[nomeCena] : null;
      const f = { m: t.m, n: t.n, cena: C && C.cena, rotulos: { a: num(t.a), m: num(t.m), c: '?' }, destaque: ['c'] };
      const fE1 = Object.assign({}, f, { destaque: ['h'], rotulos: { h: 'altura' } });
      const pergunta = C
        ? `${C.intro} ${maiusc(C.a)} mede $${num(t.a)}$ m e ${C.m} mede $${num(t.m)}$ m. Quanto mede ${C.c}?`
        : `A hipotenusa mede $${num(t.a)}$ e a projeção do cateto $c$ mede $${num(t.m)}$. Quanto mede $c$?`;
      return { tags: ['cateto'], fig: tri(f), partes: [escolha(pergunta, alternativas(t.c, [
        { v: t.h, fb: `$${num(t.h)}$ é a <strong>altura</strong> ($h² = m · n$). Esse segmento é o que a pergunta pede? Não: é um cateto.`, fig: tri(fE1) },
        { v: t.n - t.m, fb: 'A diferença entre os trechos da hipotenusa não é lado de nada.' },
        { v: t.m, fb: `$${num(t.m)}$ é a sombra do cateto, não o cateto.` },
        { v: t.a, fb: 'Essa é a hipotenusa inteira. O cateto é menor que ela.' },
      ], C ? ' m' : ''), ['Cateto: $c² = a · m$.', `$c² = ${num(t.a)} · ${num(t.m)} = ${num(t.c * t.c)}$.`, `$c = ${num(t.c)}$.`])] };
    },
    catetoMaior() {
      const t = familia();
      const f = { m: t.m, n: t.n, rotulos: { a: num(t.a), n: num(t.n), b: '?' }, destaque: ['b'] };
      return { tags: ['cateto'], fig: tri(f), partes: [escolha(`A hipotenusa mede $${num(t.a)}$ e a projeção do cateto $b$ mede $${num(t.n)}$. Quanto mede $b$?`, alternativas(t.b, [
        { v: t.c, fb: 'Esse é o outro cateto. Para $b$, use a sombra dele: $n$.' },
        { v: t.h, fb: 'Essa é a altura.', fig: tri(Object.assign({}, f, { destaque: ['h'], rotulos: { h: 'altura' } })) },
        { v: t.n, fb: 'Essa é a sombra de $b$, não o próprio $b$.' },
        { v: t.a * t.n, fb: 'Esse é $b²$. Falta a raiz.' },
      ]), ['$b² = a · n$.', `$b² = ${num(t.b * t.b)}$.`, `$b = ${num(t.b)}$.`])] };
    },
    inversa() {
      const t = familia();
      const f = { m: t.m, n: t.n, rotulos: { h: num(t.h), m: num(t.m), n: '?' }, destaque: ['n'] };
      return { tags: ['inversa'], fig: tri(f), partes: [escolha(`A altura mede $${num(t.h)}$ e a projeção $m$ mede $${num(t.m)}$. Quanto mede a outra projeção $n$?`, alternativas(t.n, [
        { v: t.h - t.m, fb: `Use $h² = m · n$: $${num(t.h * t.h)} = ${num(t.m)} · n$. Divida.` },
        { v: t.a, fb: 'Essa é a hipotenusa inteira, $m + n$.' },
        { v: t.h * t.h, fb: 'Esse é $h²$. Agora divida por $m$.' },
        { v: t.c, fb: 'Esse é um cateto.' },
      ]), ['$h² = m · n$.', `$${num(t.h * t.h)} = ${num(t.m)} · n$.`, `$n = ${num(t.n)}$.`])] };
    },
    ah() {
      const t = familia();
      const f = { m: t.m, n: t.n, rotulos: { a: num(t.a), b: num(t.b), c: num(t.c), h: '?' }, destaque: ['h'] };
      return { tags: ['altura'], fig: tri(f), partes: [escolha(`Os catetos medem $${num(t.b)}$ e $${num(t.c)}$, e a hipotenusa mede $${num(t.a)}$. Quanto mede a altura?`, alternativas(t.h, [
        { v: t.b * t.c, fb: 'Faltou dividir pela hipotenusa: $a · h = b · c$.' },
        { v: (t.b + t.c) / 2, fb: 'Não é a média. Use $a · h = b · c$.' },
        { v: t.b - t.c, fb: 'Use $a · h = b · c$.' },
        { v: t.c, fb: 'Esse é um cateto.' },
      ]), ['$a · h = b · c$.', `$${num(t.a)} · h = ${num(t.b * t.c)}$.`, `$h = ${num(t.h)}$.`])] };
    },
    pitagoras() {
      const t = familia();
      const f = { m: t.m, n: t.n, rotulos: { h: num(t.h), m: num(t.m), c: '?' }, destaque: ['c'] };
      return { tags: ['cateto', 'conferencia'], fig: tri(f), partes: [escolha(`A altura mede $${num(t.h)}$ e a projeção $m$ mede $${num(t.m)}$. Quanto mede o cateto $c$? (Use Pitágoras no triângulo azul.)`, alternativas(t.c, [
        { v: t.h + t.m, fb: 'Não se somam os lados. Pitágoras soma os quadrados: $h² + m²$.' },
        { v: t.h, fb: 'Essa é a altura, já dada.' },
        { v: t.h * t.h + t.m * t.m, fb: 'Esse é $c²$. Falta a raiz.' },
        { v: t.a, fb: 'Essa é a hipotenusa do triângulo grande.' },
      ]), ['No azul, a hipotenusa é $c$: $c² = h² + m²$.', `$c² = ${num(t.h * t.h)} + ${num(t.m * t.m)} = ${num(t.c * t.c)}$.`, `$c = ${num(t.c)}$.`])] };
    },
  };

  function gerar2C(hist) {
    const ult = hist.slice(-4);
    let tipo;
    if (hist.length === 0) tipo = 'cateto';
    else if (hist.length >= 2 && ult.filter((r) => r.tags.includes('cateto')).length < 2) tipo = escolher(['cateto', 'catetoMaior', 'pitagoras']);
    else {
      const recentes = hist.slice(-2).map((r) => r.tipo);
      tipo = escolher(Object.keys(gerador2C).filter((t) => !recentes.includes(t)));
    }
    const item = gerador2C[tipo]();
    item.tipo = tipo;
    return item;
  }

  EA.registrarTrilha({
    id: 'T2',
    titulo: 'Relações métricas no triângulo retângulo',
    descricao: 'Altura, catetos e projeções: achar cada um, escolher a relação e conferir por Pitágoras.',
    etapas: [etapa2A, etapa2B, etapa2C],
  });
  EA.gerador2C = gerador2C;
})();
