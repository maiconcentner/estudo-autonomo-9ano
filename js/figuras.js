// Figuras em SVG. Cada figura tem criar(p) -> { svg, ir(passo, semAnimacao) }.
// Medidas do modelo (metros, lados) são multiplicadas por U para virar unidades do desenho.
(function () {
  const EA = window.EA;
  const NS = 'http://www.w3.org/2000/svg';
  const U = 20;
  let seq = 0;

  function s(tag, at = {}, filhos = []) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(at)) if (v != null) e.setAttribute(k, v);
    for (const f of [].concat(filhos)) if (f != null) e.append(typeof f === 'string' ? document.createTextNode(f) : f);
    return e;
  }

  // x, y, largura e altura em unidades do modelo
  function novoSvg(x, y, w, h, rotulo) {
    const id = 'f' + ++seq;
    const svg = s('svg', {
      viewBox: [x * U, y * U, w * U, h * U].join(' '),
      role: 'img',
      'aria-label': rotulo,
      class: 'fig',
      focusable: 'false',
    });
    svg.append(
      s('defs', {}, [
        s('pattern', { id: id + 'l', width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, [
          s('line', { x1: 0, y1: 0, x2: 0, y2: 9, class: 'hach' }),
        ]),
        s('pattern', { id: id + 'p', width: 10, height: 10, patternUnits: 'userSpaceOnUse' }, [
          s('circle', { cx: 5, cy: 5, r: 1.8, class: 'ponto' }),
        ]),
        s('pattern', { id: id + 'g', width: U, height: U, patternUnits: 'userSpaceOnUse' }, [
          s('path', { d: `M${U} 0V${U}H0`, class: 'grade' }),
        ]),
      ])
    );
    svg._id = id;
    return svg;
  }

  const R = (x, y, w, h, cls) => s('rect', { x: x * U, y: y * U, width: w * U, height: h * U, class: cls });
  const T = (x, y, t, cls = 'rot') =>
    s('text', { x: x * U, y: y * U, class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, t);

  // Peça de área: fundo colorido + textura (para não depender só da cor) + contorno + rótulo
  function peca(svg, x, y, w, h, tipo, rotulo) {
    const g = s('g', { class: 'peca peca-' + tipo });
    g.append(R(x, y, w, h, 'fundo'));
    const pad = { ab: 'l', b: 'p', canteiro: 'p', piso: 'g' }[tipo];
    if (pad) {
      const r = R(x, y, w, h, 'textura');
      r.setAttribute('fill', `url(#${svg._id}${pad})`);
      g.append(r);
    }
    g.append(R(x, y, w, h, 'contorno'));
    if (rotulo) g.append(T(x + w / 2, y + h / 2, rotulo));
    return g;
  }

  // Cota (medida) com tracinhos nas pontas. Na vertical, o texto fica girado.
  // outroLado: na horizontal, texto embaixo; na vertical, texto à direita.
  function cota(x1, y1, x2, y2, texto, outroLado) {
    const g = s('g', { class: 'cota' });
    const hor = y1 === y2;
    g.append(s('line', { x1: x1 * U, y1: y1 * U, x2: x2 * U, y2: y2 * U }));
    const t = 0.25;
    if (hor) {
      g.append(s('line', { x1: x1 * U, y1: (y1 - t) * U, x2: x1 * U, y2: (y1 + t) * U }));
      g.append(s('line', { x1: x2 * U, y1: (y1 - t) * U, x2: x2 * U, y2: (y1 + t) * U }));
      g.append(T((x1 + x2) / 2, outroLado ? y1 + 0.65 : y1 - 0.55, texto, 'cota-t'));
    } else {
      g.append(s('line', { x1: (x1 - t) * U, y1: y1 * U, x2: (x1 + t) * U, y2: y1 * U }));
      g.append(s('line', { x1: (x1 - t) * U, y1: y2 * U, x2: (x1 + t) * U, y2: y2 * U }));
      const dx = outroLado ? 0.6 : -0.55;
      const cx = (x1 + dx) * U, cy = ((y1 + y2) / 2) * U;
      const tx = T(x1 + dx, (y1 + y2) / 2, texto, 'cota-t');
      tx.setAttribute('transform', `rotate(${outroLado ? 90 : -90} ${cx} ${cy})`);
      g.append(tx);
    }
    return g;
  }

  // Aplica um estado. Sem animação: desliga as transições só durante a troca.
  function aplicar(svg, sem, fn) {
    if (sem || EA.reduzMovimento()) {
      svg.classList.add('sem-anim');
      fn();
      svg.getBoundingClientRect();
      requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('sem-anim')));
    } else fn();
  }
  const mostra = (el, sim) => el.classList.toggle('oculta', !sim);
  const mover = (el, dx, dy, giro) => {
    el.style.transform = dx || dy || giro ? `translate(${dx * U}px, ${dy * U}px)${giro ? ` rotate(${giro}deg)` : ''}` : '';
  };
  const grupo = (filhos, cls) => s('g', cls ? { class: cls } : {}, filhos);

  // Grade de quadradinhos (para contar a área) sobre um retângulo
  function grade(x, y, w, h, passo) {
    const g = s('g', { class: 'quadradinhos' });
    for (let i = passo; i < w - 1e-6; i += passo) g.append(s('line', { x1: (x + i) * U, y1: y * U, x2: (x + i) * U, y2: (y + h) * U }));
    for (let j = passo; j < h - 1e-6; j += passo) g.append(s('line', { x1: x * U, y1: (y + j) * U, x2: (x + w) * U, y2: (y + j) * U }));
    return g;
  }

  EA.fig = {};

  // (a + b)² em quatro peças, uma por passo
  // 0 contorno | 1 a² | 2 b² | 3 buracos com ? | 4 primeira ab | 5 segunda ab | 6 tudo, ab piscando
  EA.fig.somaPecas = {
    criar(p = {}) {
      const A = p.A || 8, B = p.B || 4, S = A + B;
      const r = Object.assign({ a: 'a', b: 'b', aa: 'a²', ab: 'ab', bb: 'b²' }, p.rot || {});
      const svg = novoSvg(-2, -2, S + 2.6, S + 2.6,
        p.alt || `Quadrado de lado ${r.a} + ${r.b} formado por quatro peças: ${r.aa}, duas peças ${r.ab} e ${r.bb}.`);
      const borda = R(0, 0, S, S, 'tracejado');
      const aa = peca(svg, 0, 0, A, A, 'a', r.aa);
      const ab1 = peca(svg, A, 0, B, A, 'ab', r.ab);
      const ab2 = peca(svg, 0, A, A, B, 'ab', r.ab);
      const bb = peca(svg, A, A, B, B, 'b', r.bb);
      const buracos = grupo([T(A + B / 2, A / 2, '?', 'rot interrog'), T(A / 2, A + B / 2, '?', 'rot interrog')]);
      svg.append(borda, aa, ab1, ab2, bb, buracos);
      if (p.grade) svg.append(grade(0, 0, S, S, p.grade));
      svg.append(cota(0, -0.9, A, -0.9, r.a), cota(A, -0.9, S, -0.9, r.b),
        cota(-0.9, 0, -0.9, A, r.a), cota(-0.9, A, -0.9, S, r.b));
      const ir = (k, sem) => aplicar(svg, sem, () => {
        mostra(aa, k >= 1);
        mostra(bb, k >= 2);
        mostra(buracos, k === 3);
        mostra(ab1, k >= 4);
        mostra(ab2, k >= 5);
        [ab1, ab2].forEach((x) => x.classList.toggle('pulsa', k === 6 || !!p.faltam));
        [ab1, ab2].forEach((x) => x.classList.toggle('falta', !!p.faltam));
      });
      ir(p.estatica ? 6 : 0, true);
      return { svg, ir };
    },
  };

  // (2y)²: o quadrado de lado 2y tem 4 quadrados y²
  // 0 lado 2y | 1 lado dividido | 2 cortes | 3 rótulos y² | 4 destaque
  EA.fig.coefQuadrado = {
    criar(p = {}) {
      const n = p.n || 2, v = p.v || 'y', C = n === 2 ? 4.5 : 3.2, S = n * C;
      const svg = novoSvg(-2, -2.6, S + 2.6, S + 3.2,
        `Quadrado de lado ${n}${v}. Ele se divide em ${n * n} quadrados de lado ${v}, cada um com área ${v}². Área total ${n * n}${v}².`);
      const base = peca(svg, 0, 0, S, S, 'a');
      const cortes = grupo([], 'cortes');
      for (let i = 1; i < n; i++) {
        cortes.append(s('line', { x1: i * C * U, y1: 0, x2: i * C * U, y2: S * U, class: 'corte' }));
        cortes.append(s('line', { x1: 0, y1: i * C * U, x2: S * U, y2: i * C * U, class: 'corte' }));
      }
      const rots = grupo([]);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) rots.append(T(i * C + C / 2, j * C + C / 2, v + '²'));
      const total = cota(0, -1.6, S, -1.6, n + v);
      const partes = grupo([]);
      for (let i = 0; i < n; i++) {
        partes.append(cota(i * C, -0.6, (i + 1) * C, -0.6, v));
        partes.append(cota(-0.9, i * C, -0.9, (i + 1) * C, v));
      }
      svg.append(base, cortes, rots, total, partes);
      const ir = (k, sem) => aplicar(svg, sem, () => {
        mostra(partes, k >= 1);
        mostra(cortes, k >= 2);
        mostra(rots, k >= 3);
        base.classList.toggle('pulsa', k === 4);
      });
      ir(p.estatica ? 4 : 0, true);
      return { svg, ir };
    },
  };

  // (a − b)²: tira duas faixas e devolve o cantinho
  // 0 quadrado a² | 1 divisão | 2 tira a de cima | 3 tira a da direita | 4 cantinho saiu duas vezes | 5 devolve b²
  EA.fig.difPecas = {
    criar(p = {}) {
      const A = p.A || 10, B = p.B || 3.5, D = A - B;
      const r = Object.assign({ a: 'a', b: 'b', amb: 'a − b', aa: 'a²', ab: 'ab', bb: '+ b²', alvo: '(a − b)²' }, p.rot || {});
      const passoFixo = p.estatica ? (p.passo != null ? p.passo : 1) : null;
      const compacta = passoFixo != null && passoFixo < 2;
      const svg = novoSvg(-2, compacta ? -0.6 : -(B + 1.6), compacta ? A + 2.6 : A + B + 3.4, compacta ? A + 2.4 : A + B + 3.8,
        p.alt || `Quadrado de lado ${r.a}. Tirando duas faixas de área ${r.ab} e devolvendo o cantinho ${r.bb}, sobra o quadrado ${r.alvo}.`);
      const base = peca(svg, 0, 0, A, A, 'a', r.aa);
      const alvo = peca(svg, 0, B, D, D, 'a', r.alvo);
      const topo = peca(svg, 0, 0, A, B, 'ab', r.ab);
      const dir = peca(svg, D, 0, B, A, 'ab', r.ab);
      const marcas = [R(D, 0, B, B, 'marca-canto'), R(D, 0, B, B, 'marca-canto')];
      topo.append(marcas[0]);
      dir.append(marcas[1]);
      const canto = peca(svg, A + 1, -(B + 1), B, B, 'b', r.bb);
      const contAlvo = R(0, B, D, D, 'tracejado forte');
      const cotasA = grupo([cota(0, A + 0.6, A, A + 0.6, r.a, true), cota(-0.9, 0, -0.9, A, r.a)]);
      const cotasB = grupo([
        cota(0, A + 0.6, D, A + 0.6, r.amb, true), cota(D, A + 0.6, A, A + 0.6, r.b, true),
        cota(-0.9, 0, -0.9, B, r.b), cota(-0.9, B, -0.9, A, r.amb),
      ]);
      svg.append(base, alvo, topo, dir, canto, contAlvo, cotasA, cotasB);
      const ir = (k, sem) => aplicar(svg, sem, () => {
        mostra(base, k === 0);
        mostra(cotasA, k === 0);
        [alvo, topo, dir, contAlvo, cotasB].forEach((x) => mostra(x, k >= 1));
        mover(topo, 0, k >= 2 ? -(B + 1) : 0);
        mover(dir, k >= 3 ? B + 1 : 0, 0);
        marcas.forEach((m) => mostra(m, k === 4));
        mostra(canto, k >= 5);
      });
      ir(passoFixo != null ? passoFixo : 0, true);
      return { svg, ir };
    },
  };

  // Pátio: o canteiro vai para o canto, o L é cortado e vira retângulo (a − b) por (a + b)
  // 0 pátio | 1 canteiro no canto | 2 sobra um L | 3 o L não é quadrado | 4 corte com medidas
  // 5 gira a parte listrada | 6 encaixa | 7 lado 12 + x | 8 área do retângulo
  EA.fig.lRetangulo = {
    criar(p = {}) {
      const A = p.A || 12, B = p.B || 4, D = A - B;
      const r = Object.assign({ a: '12', b: 'x' }, p.rot || {});
      const svg = novoSvg(-3.4, -1.8, A + 5.8, A + B + 4.6,
        `Pátio quadrado de lado ${r.a} com canteiro de lado ${r.b}. O piso que sobra vira um retângulo de lados ${r.a} − ${r.b} e ${r.a} + ${r.b}.`);
      const piso = peca(svg, 0, 0, A, A, 'piso');
      const cant = peca(svg, D / 2, D / 2, B, B, 'canteiro', r.b + '²');
      const cotaCant = cota(D / 2, D / 2 - 0.6, D / 2 + B, D / 2 - 0.6, r.b);
      const buraco = grupo([R(D, 0, B, B, 'tracejado'), T(D + B / 2, B / 2, r.b + '²', 'rot fraco')]);
      const p1 = peca(svg, 0, 0, D, A, 'a');
      const p2 = peca(svg, D, B, B, D, 'ab');
      const quad = grupo([R(0, B, D, D, 'tracejado forte'), T(D / 2, B + D / 2, `(${r.a} − ${r.b})²`)]);
      const sobras = grupo([T(D / 2, B / 2, 'sobra', 'rot destaque'), T(D + B / 2, B + D / 2, 'sobra', 'rot destaque')]);
      const cotaTopo = cota(0, -0.9, A, -0.9, r.a + ' m');
      const c4 = grupo([
        cota(0, A + 0.6, D, A + 0.6, `${r.a} − ${r.b}`, true),
        cota(-0.9, 0, -0.9, A, r.a),
        cota(D + 0.5, B - 0.6, A + 0.5, B - 0.6, r.b),
        cota(A + 1.2, B, A + 1.2, A, `${r.a} − ${r.b}`, true),
      ]);
      // medidas da parte listrada já deitada (aparecem depois do giro)
      const c5 = grupo([
        cota(B / 2, A + B + 1.4, D + B / 2, A + B + 1.4, `${r.a} − ${r.b}`, true),
        cota(D + B / 2 + 0.7, A + 0.8, D + B / 2 + 0.7, A + B + 0.8, r.b, true),
      ], 'tardia');
      const c6 = grupo([
        cota(-0.9, 0, -0.9, A, r.a),
        cota(-0.9, A, -0.9, A + B, r.b),
        cota(0, A + B + 0.6, D, A + B + 0.6, `${r.a} − ${r.b}`, true),
      ]);
      const c7 = cota(-2.4, 0, -2.4, A + B, `${r.a} + ${r.b}`);
      svg.append(piso, p1, p2, buraco, cant, cotaCant, quad, sobras, cotaTopo, c4, c5, c6, c7);
      const ir = (k, sem) => aplicar(svg, sem, () => {
        mostra(piso, k <= 1);
        mostra(cant, k <= 1);
        mostra(cotaCant, k === 0);
        mover(cant, k >= 1 ? D / 2 : 0, k >= 1 ? -D / 2 : 0);
        [p1, p2].forEach((x) => {
          mostra(x, k >= 2);
          x.classList.toggle('lisa', k === 2 || k === 3);
          x.classList.toggle('pulsa', k === 8);
        });
        mostra(buraco, k >= 2 && k <= 3);
        mostra(quad, k === 3);
        mostra(sobras, k === 3);
        if (k >= 6) mover(p2, -A / 2, A / 2, 90);
        else if (k === 5) mover(p2, -A / 2 + B / 2, A / 2 + 0.8, 90);
        else mover(p2, k === 4 ? 0.5 : 0, 0);
        mostra(cotaTopo, k <= 3);
        mostra(c4, k === 4);
        mostra(c5, k === 5);
        mostra(c6, k >= 6);
        mostra(c7, k >= 7);
      });
      ir(p.estatica ? 8 : 0, true);
      return { svg, ir };
    },
  };

  // Pátio com canteiro central de lado x (usado no explorador e em telas estáticas)
  EA.fig.patio = {
    criar(p = {}) {
      const A = p.A || 12;
      const r = Object.assign({ a: '12 m', b: 'x' }, p.rot || {});
      const svg = novoSvg(-0.5, -1.9, A + 1, A + 2.4, `Pátio quadrado de lado ${r.a} com um canteiro quadrado de lado ${r.b} no centro.`);
      const piso = peca(svg, 0, 0, A, A, 'piso');
      const cant = peca(svg, 0, 0, A, A, 'canteiro');
      cant.classList.add('escala');
      const rot = T(A / 2, A / 2, r.b + '²');
      svg.append(piso, cant, rot, cota(0, -0.9, A, -0.9, r.a));
      function mudar(x) {
        cant.style.transform = `scale(${x / A})`;
        mostra(rot, x >= 3);
      }
      mudar(p.x != null ? p.x : 4);
      return { svg, ir() {}, mudar };
    },
  };

  // O L que sobra comparado com o quadrado de lado a − b (retorno do erro E1)
  EA.fig.lVsQuadrado = {
    criar(p = {}) {
      const A = p.A || 12, B = p.B || 4, D = A - B;
      const r = Object.assign({ a: '12', b: 'x' }, p.rot || {});
      const svg = novoSvg(-0.5, -0.5, A + 1, A + 1,
        `Figura em L que sobra do quadrado de lado ${r.a} sem o canto de lado ${r.b}. O quadrado de lado ${r.a} − ${r.b} ocupa só uma parte do L; sobram duas faixas.`);
      svg.append(
        peca(svg, 0, B, D, D, 'a', `(${r.a} − ${r.b})²`),
        peca(svg, 0, 0, D, B, 'ab', 'sobra'),
        peca(svg, D, B, B, D, 'ab', 'sobra'),
        R(D, 0, B, B, 'tracejado'),
        R(0, B, D, D, 'tracejado forte')
      );
      return { svg, ir() {} };
    },
  };

  // Área do canteiro é lado vezes lado (retorno do erro E3)
  EA.fig.canteiroArea = {
    criar(p = {}) {
      // p.n: número de quadradinhos por lado (quando o lado é um número); p.texto: rótulo do meio
      const L = 6, n = p.n || 4;
      const b = (p.rot && p.rot.b) || 'x';
      const meio = p.texto || `${b} · ${b} = ${b}²`;
      const svg = novoSvg(-2, -1.8, L + 3, L + 2.6, `Quadrado de lado ${b}. A área é ${b} vezes ${b}: ${meio}.`);
      const g = peca(svg, 0, 0, L, L, p.tipo || 'canteiro');
      for (let i = 1; i < n; i++) {
        g.append(s('line', { x1: (i * L / n) * U, y1: 0, x2: (i * L / n) * U, y2: L * U, class: p.n ? 'grade-cheia' : 'grade-forte' }));
        g.append(s('line', { x1: 0, y1: (i * L / n) * U, x2: L * U, y2: (i * L / n) * U, class: p.n ? 'grade-cheia' : 'grade-forte' }));
      }
      svg.append(g, T(L / 2, L / 2, meio, 'rot destaque'), cota(0, -0.9, L, -0.9, b), cota(-0.9, 0, -0.9, L, b));
      return { svg, ir() {} };
    },
  };

  // Retângulo (a + b) por (a − b)
  EA.fig.retangulo = {
    criar(p = {}) {
      const A = p.A || 8, B = p.B || 3;
      const r = Object.assign({ a: 'a', b: 'b' }, p.rot || {});
      const svg = novoSvg(-2, -1.8, A + B + 2.6, A - B + 2.6, `Retângulo de lados ${r.a} + ${r.b} e ${r.a} − ${r.b}.`);
      svg.append(
        peca(svg, 0, 0, A + B, A - B, 'a', `(${r.a} + ${r.b})(${r.a} − ${r.b})`),
        cota(0, -0.9, A + B, -0.9, `${r.a} + ${r.b}`),
        cota(-0.9, 0, -0.9, A - B, `${r.a} − ${r.b}`)
      );
      return { svg, ir() {} };
    },
  };

  // ---------------- Trilha 2: triângulo retângulo ----------------
  // Notação do livro e do projeto Relações Métricas Dinâmicas:
  // A = ângulo reto, a = BC (hipotenusa), b = AC, c = AB, h = AH, m = BH (projeção de c), n = HC (projeção de b).
  const SEG = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'], h: ['A', 'H'], m: ['B', 'H'], n: ['H', 'C'] };
  const NOME_SEG = { a: 'hipotenusa BC', b: 'cateto AC', c: 'cateto AB', h: 'altura AH', m: 'projeção BH', n: 'projeção HC' };
  const v2 = {
    sub: (p, q) => [p[0] - q[0], p[1] - q[1]],
    add: (p, q) => [p[0] + q[0], p[1] + q[1]],
    mul: (p, k) => [p[0] * k, p[1] * k],
    uni: (p) => { const l = Math.hypot(p[0], p[1]) || 1; return [p[0] / l, p[1] / l]; },
    dot: (p, q) => p[0] * q[0] + p[1] * q[1],
  };
  const L = (p, q, cls) => s('line', { x1: p[0] * U, y1: p[1] * U, x2: q[0] * U, y2: q[1] * U, class: cls });
  const PG = (pts, cls) => s('polygon', { points: pts.map((q) => q[0] * U + ',' + q[1] * U).join(' '), class: cls });
  function marcaReta(V, d1, d2, t = 0.55) {
    const p1 = v2.add(V, v2.mul(d1, t)), p2 = v2.add(p1, v2.mul(d2, t)), p3 = v2.add(V, v2.mul(d2, t));
    return s('path', { d: `M${p1[0] * U} ${p1[1] * U}L${p2[0] * U} ${p2[1] * U}L${p3[0] * U} ${p3[1] * U}`, class: 'reto' });
  }

  // Triângulo retângulo com altura. Serve para identificar por toque, para dados de exercício e para animar "sombras".
  // p: m, n (projeções), giro (graus), espelhar, rotulos {chave: texto}, destaque [chaves], alvos [chaves], dois (pinta os
  // triângulos menores), proj (mostra m e n), vertices (letras), cena ('telhado' | 'torre'), estados (para animação).
  EA.fig.triRet = {
    criar(p = {}) {
      const m = p.m != null ? p.m : 3.6, n = p.n != null ? p.n : 6.4, h = Math.sqrt(m * n);
      const k = 10 / (m + n);
      let P = { B: [0, 0], C: [(m + n) * k, 0], H: [m * k, 0], A: [m * k, -h * k] };
      if (p.espelhar) Object.keys(P).forEach((q) => (P[q] = [10 - P[q][0], P[q][1]]));
      const G = v2.mul(v2.add(v2.add(P.A, P.B), P.C), 1 / 3);
      if (p.giro) {
        const t = (p.giro * Math.PI) / 180, c = Math.cos(t), sn = Math.sin(t);
        Object.keys(P).forEach((q) => {
          const d = v2.sub(P[q], G);
          P[q] = [G[0] + d[0] * c - d[1] * sn, G[1] + d[0] * sn + d[1] * c];
        });
      }
      const xs = Object.values(P).map((q) => q[0]), ys = Object.values(P).map((q) => q[1]);
      const pad = 2.3, extra = p.cena ? 2.2 : 0;
      const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, x1 = Math.max(...xs) + pad, y1 = Math.max(...ys) + pad + extra;
      const svg = novoSvg(x0, y0, x1 - x0, y1 - y0, p.alt || 'Triângulo retângulo ABC com ângulo reto em A e altura AH.');
      svg.classList.add('fig-tri');

      // cena de fundo (sem girar)
      if (p.cena === 'telhado') {
        const w = 10, alt = 3.2;
        svg.append(R(P.B[0] + 0.5, P.B[1], w - 1, alt, 'cena-parede'), R(P.B[0] - 1, P.B[1] + alt, w + 2, 0.5, 'cena-chao'));
      } else if (p.cena === 'torre') {
        svg.append(R(Math.min(P.B[0], P.C[0]) - 1, P.B[1], 12, 0.5, 'cena-chao'), L(P.H, P.A, 'cena-torre'));
      }

      const inteiro = PG([P.A, P.B, P.C], 'tri-fundo');
      const azul = PG([P.A, P.B, P.H], 'tri-azul');
      const laranja = s('g', {}, [PG([P.A, P.H, P.C], 'tri-laranja'), PG([P.A, P.H, P.C], 'tri-textura')]);
      laranja.lastChild.setAttribute('fill', `url(#${svg._id}l)`);
      svg.append(inteiro, azul, laranja);

      const linhas = {};
      ['a', 'b', 'c', 'h', 'm', 'n'].forEach((q) => {
        linhas[q] = L(P[SEG[q][0]], P[SEG[q][1]], 'seg seg-' + q + (q === 'm' || q === 'n' ? ' seg-proj' : ''));
        svg.append(linhas[q]);
      });
      const uAB = v2.uni(v2.sub(P.B, P.A)), uAC = v2.uni(v2.sub(P.C, P.A)), uHA = v2.uni(v2.sub(P.A, P.H)), uHC = v2.uni(v2.sub(P.C, P.H));
      const retoA = marcaReta(P.A, uAB, uAC), retoH = marcaReta(P.H, uHA, uHC, 0.45);
      svg.append(retoA, retoH);

      // projeção como "sombra": luz caindo perpendicular à hipotenusa
      const luz = s('g', { class: 'luz' }, [L(P.A, P.H, 'raio')]);
      svg.append(luz);

      // rótulos dos segmentos
      const rot = {};
      const fora = (q, dist) => {
        const [i, j] = SEG[q];
        const M = v2.mul(v2.add(P[i], P[j]), 0.5);
        const d = v2.uni(v2.sub(P[j], P[i]));
        let nn = [-d[1], d[0]];
        if (q === 'h') { if (v2.dot(nn, v2.sub(P.C, P.H)) < 0) nn = v2.mul(nn, -1); }
        else if (v2.dot(nn, v2.sub(M, G)) < 0) nn = v2.mul(nn, -1);
        return v2.add(M, v2.mul(nn, dist));
      };
      Object.entries(p.rotulos || {}).forEach(([q, t]) => {
        const pos = fora(q, q === 'a' ? (p.rotulos.m || p.rotulos.n ? 1.9 : 0.85) : 0.85);
        rot[q] = T(pos[0], pos[1], t, 'rot rot-seg rot-' + q);
        svg.append(rot[q]);
      });
      if (p.vertices !== false) {
        ['A', 'B', 'C', 'H'].forEach((q) => {
          let d = v2.uni(v2.sub(P[q], G));
          if (q === 'H') d = v2.uni(v2.sub(P.H, P.A));
          const pos = v2.add(P[q], v2.mul(d, 0.85));
          svg.append(T(pos[0], pos[1], q, 'rot vert'));
        });
      }

      // alvos de toque (área grande, invisível)
      const alvos = {};
      let aoTocar = null;
      (p.alvos || []).forEach((q) => {
        const hit = L(P[SEG[q][0]], P[SEG[q][1]], 'alvo');
        hit.setAttribute('tabindex', '0');
        hit.setAttribute('role', 'button');
        hit.setAttribute('aria-label', 'Segmento ' + SEG[q][0] + SEG[q][1]);
        const tocar = () => aoTocar && aoTocar(q);
        hit.addEventListener('click', tocar);
        hit.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tocar(); } });
        alvos[q] = hit;
        svg.append(hit);
      });

      function estado(e) {
        const mostrarProj = e.proj != null ? e.proj : p.proj != null ? p.proj : !!(p.rotulos && (p.rotulos.m || p.rotulos.n));
        ['m', 'n'].forEach((q) => mostra(linhas[q], mostrarProj || (e.destaque || []).includes(q)));
        mostra(linhas.h, e.h !== false);
        mostra(retoH, e.h !== false);
        mostra(luz, !!e.luz);
        [azul, laranja].forEach((x) => mostra(x, !!e.dois));
        Object.keys(linhas).forEach((q) => linhas[q].classList.toggle('destaque', (e.destaque || []).includes(q)));
        Object.keys(rot).forEach((q) => mostra(rot[q], !e.rotulos || e.rotulos.includes(q)));
      }
      const estados = p.estados || [{ destaque: p.destaque, dois: p.dois, h: p.h, luz: p.luz }];
      const ir = (kk, sem) => aplicar(svg, sem, () => estado(estados[Math.min(kk, estados.length - 1)]));
      ir(p.estatica && p.estados ? estados.length - 1 : 0, true);
      return {
        svg, ir,
        aoTocar(fn) { aoTocar = fn; },
        marcar(q, tipo) {
          linhas[q].classList.add('marcado-' + tipo);
          if (alvos[q]) alvos[q].setAttribute('aria-label', 'Segmento ' + SEG[q][0] + SEG[q][1] + (tipo === 'certo' ? ', certo' : ', errado'));
        },
        limpar() { Object.values(linhas).forEach((l) => l.classList.remove('marcado-certo', 'marcado-errado')); },
        nome: (q) => NOME_SEG[q],
      };
    },
  };
  EA.nomeSeg = NOME_SEG;

  // Os três triângulos semelhantes: a altura corta o grande em dois, e cada pedaço gira e vira até ficar na mesma posição.
  // 0 grande | 1 altura e dois menores | 2 ângulos | 3 separa | 4 gira azul | 5 vira azul | 6 gira laranja | 7 vira laranja | 8 medidas
  // p.destaque: pares para destacar na posição final, ex.: ['G:a','G:c','Z:c','Z:m'] (G grande, Z azul, O laranja)
  EA.fig.tresTri = {
    criar(p = {}) {
      const a = 10, c = 6, b = 8, m = 3.6, n = 6.4, h = 4.8;
      const B = [0, 0], C = [a, 0], H = [m, 0], A = [m, -h];
      const svg = novoSvg(-3.6, -6.4, 17.4, 17.2, 'O triângulo grande ABC e os dois triângulos menores ABH e AHC, separados e colocados na mesma posição. Os três têm os mesmos ângulos.');
      svg.classList.add('fig-tri');
      const grande = PG([A, B, C], 'tri-fundo');
      const altG = L(A, H, 'seg seg-h tracejada');
      const ladosG = s('g', {}, [L(B, C, 'seg'), L(A, B, 'seg'), L(A, C, 'seg')]);
      const reto = (V, d1, d2) => marcaReta(V, v2.uni(d1), v2.uni(d2));
      const arco = (V, d1, ang, r, duplo) => {
        const g = s('g', { class: 'arco' });
        const a0 = Math.atan2(d1[1], d1[0]);
        [r, duplo ? r + 0.28 : null].filter(Boolean).forEach((rr) => {
          const p0 = [V[0] + rr * Math.cos(a0), V[1] + rr * Math.sin(a0)];
          const a1 = a0 + ang;
          const p1 = [V[0] + rr * Math.cos(a1), V[1] + rr * Math.sin(a1)];
          g.append(s('path', { d: `M${p0[0] * U} ${p0[1] * U}A${rr * U} ${rr * U} 0 0 ${ang > 0 ? 1 : 0} ${p1[0] * U} ${p1[1] * U}` }));
        });
        return g;
      };
      const beta = Math.atan2(h, m), gamma = Math.atan2(h, n);
      // triângulo grande com ângulos
      const angG = s('g', {}, [reto(A, v2.sub(B, A), v2.sub(C, A)), arco(B, [1, 0], -beta, 0.9, false), arco(C, [-1, 0], gamma, 0.9, true)]);
      const letrasG = s('g', {}, [T(A[0], A[1] - 0.7, 'A', 'rot vert'), T(B[0] - 0.6, B[1] + 0.4, 'B', 'rot vert'), T(C[0] + 0.6, C[1] + 0.4, 'C', 'rot vert'), T(H[0], H[1] + 0.7, 'H', 'rot vert')]);
      const legendaAng = s('g', {}, [T(1.6, -0.6, 'β', 'rot ang'), T(a - 1.7, -0.6, 'γ', 'rot ang')]);
      // azul ABH (pivô B) e laranja AHC (pivô A), com ângulos que acompanham o movimento
      const azul = s('g', { class: 'tri-movel' }, [
        PG([A, B, H], 'tri-azul forte'), reto(H, v2.sub(A, H), v2.sub(B, H)), arco(B, [1, 0], -beta, 0.8, false),
        arco(A, v2.sub(H, A), Math.PI / 2 - beta, 0.8, true),
      ]);
      const laranja = s('g', { class: 'tri-movel' }, [
        PG([A, H, C], 'tri-laranja forte'), PG([A, H, C], 'tri-textura'), reto(H, v2.sub(A, H), v2.sub(C, H)), arco(C, [-1, 0], gamma, 0.8, true),
        arco(A, v2.sub(H, A), -(Math.PI / 2 - gamma), 0.8, false),
      ]);
      // movimento rígido: ponto' = O + F(R(ponto − pivô))
      const thZ = (Math.atan2(h, m) * 180) / Math.PI;      // gira o azul até AB ficar deitado
      const thO = -(Math.atan2(h, n) * 180) / Math.PI;     // gira o laranja até AC ficar deitado
      const baseY = 7.2;
      // Gira e vira em torno do centro de cada triângulo, para nunca sair da figura.
      // O centro final vem do movimento com pivô no vértice (B para o azul, A para o laranja).
      const centro = (pts) => [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3];
      const imagem = (q, O, P, th) => {
        const t = (th * Math.PI) / 180, d = v2.sub(q, P);
        const r = [d[0] * Math.cos(t) - d[1] * Math.sin(t), d[0] * Math.sin(t) + d[1] * Math.cos(t)];
        return [O[0] + r[0], O[1] - r[1]];
      };
      const gZ = centro([A, B, H]), gO = centro([A, H, C]);
      const mov = {
        azul: { el: azul, piv: gZ, ini: { o: gZ, th: 0, sy: 1 }, sep: { o: imagem(gZ, [-3, baseY], B, thZ), th: 0, sy: 1 } },
        laranja: { el: laranja, piv: gO, ini: { o: gO, th: 0, sy: 1 }, sep: { o: imagem(gO, [5.4, baseY], A, thO), th: 0, sy: 1 } },
      };
      const atual = { azul: Object.assign({}, mov.azul.ini), laranja: Object.assign({}, mov.laranja.ini) };
      function pinta(q, st) {
        const pv = mov[q].piv;
        mov[q].el.setAttribute('transform', `translate(${st.o[0] * U} ${st.o[1] * U}) scale(1 ${st.sy}) rotate(${st.th}) translate(${-pv[0] * U} ${-pv[1] * U})`);
      }
      const alvo = (q, k) => {
        if (k < 3) return mov[q].ini;
        const th = q === 'azul' ? thZ : thO;
        const giraEm = q === 'azul' ? 4 : 6;
        return { o: mov[q].sep.o, th: k >= giraEm ? th : 0, sy: k >= giraEm + 1 ? -1 : 1 };
      };
      let anim = null;
      function animar(sem, k) {
        const de = { azul: Object.assign({}, atual.azul), laranja: Object.assign({}, atual.laranja) };
        const para = { azul: alvo('azul', k), laranja: alvo('laranja', k) };
        if (anim) cancelAnimationFrame(anim);
        const t0 = performance.now(), dur = sem || EA.reduzMovimento() ? 0 : 950;
        const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const quadro = (agora) => {
          const t = dur ? Math.min(1, (agora - t0) / dur) : 1, e = ease(t);
          ['azul', 'laranja'].forEach((q) => {
            const A0 = de[q], A1 = para[q];
            atual[q] = { o: [A0.o[0] + (A1.o[0] - A0.o[0]) * e, A0.o[1] + (A1.o[1] - A0.o[1]) * e], th: A0.th + (A1.th - A0.th) * e, sy: A0.sy + (A1.sy - A0.sy) * e };
            pinta(q, atual[q]);
          });
          if (t < 1) anim = requestAnimationFrame(quadro);
        };
        anim = requestAnimationFrame(quadro);
        if (!dur) quadro(t0 + 1);
      }
      // medidas na posição final (texto sempre de pé)
      const pos = {
        G: { base: [5, 0.75], esq: [1.24, -2.82], dir: [7.2, -2.96], t: { base: 'a', esq: 'c', dir: 'b' } },
        Z: { base: [0, baseY + 0.75], esq: [-2.48, baseY - 1.86], dir: [1.5, baseY - 2.0], t: { base: 'c', esq: 'm', dir: 'h' } },
        O: { base: [9.4, baseY + 0.75], esq: [6.28, baseY - 2.34], dir: [11.26, baseY - 2.48], t: { base: 'b', esq: 'h', dir: 'n' } },
      };
      const medidas = s('g', { class: 'medidas' });
      // p.destaque: { par1: ['G:a', 'Z:c'], par2: ['G:c', 'Z:m'] }: lados correspondentes, linha cheia e tracejada
      const d1 = new Set((p.destaque && p.destaque.par1) || []), d2 = new Set((p.destaque && p.destaque.par2) || []);
      const marcados = new Set([...d1, ...d2]);
      const Zf = { B: [-3, baseY], A: [3, baseY], H: [-0.84, baseY - 2.88] };
      const Of = { A: [5.4, baseY], C: [13.4, baseY], H: [8.28, baseY - 3.84] };
      const ladosFinais = {
        'G:a': [B, C], 'G:c': [A, B], 'G:b': [A, C],
        'Z:c': [Zf.B, Zf.A], 'Z:m': [Zf.B, Zf.H], 'Z:h': [Zf.H, Zf.A],
        'O:b': [Of.A, Of.C], 'O:h': [Of.A, Of.H], 'O:n': [Of.H, Of.C],
      };
      Object.entries(ladosFinais).forEach(([chave, [p1, p2]]) => {
        if (d1.has(chave)) medidas.append(L(p1, p2, 'lado-par1'));
        if (d2.has(chave)) medidas.append(L(p1, p2, 'lado-par2'));
      });
      Object.entries(pos).forEach(([tri, d]) => ['base', 'esq', 'dir'].forEach((lado) => {
        const letra = d.t[lado];
        const t = T(d[lado][0], d[lado][1], letra, 'rot rot-seg' + (marcados.has(tri + ':' + letra) ? ' marca-lado' : ''));
        medidas.append(t);
      }));
      laranja.querySelector('.tri-textura').setAttribute('fill', `url(#${svg._id}l)`);
      svg.append(grande, ladosG, altG, angG, legendaAng, letrasG, azul, laranja, medidas);
      const ir = (k, sem) => {
        mostra(altG, k >= 1);
        mostra(azul, k >= 1);
        mostra(laranja, k >= 1);
        azul.classList.toggle('so-contorno', false);
        mostra(angG, k >= 2);
        mostra(legendaAng, k >= 2);
        mostra(letrasG, k <= 2);
        mostra(medidas, k >= 8);
        svg.classList.toggle('mostra-angulos', k >= 2);
        animar(sem, k);
      };
      ir(p.estatica ? 8 : 0, true);
      return { svg, ir };
    },
  };

  // Atalho: figura estática dentro de um bloco
  EA.figura = function (def) {
    const f = EA.fig[def.nome].criar(Object.assign({ estatica: true }, def.p || {}));
    return EA.el('div', { class: 'figura' + (def.larga ? ' larga' : '') }, f.svg);
  };
})();
