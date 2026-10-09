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

  // Atalho: figura estática dentro de um bloco
  EA.figura = function (def) {
    const f = EA.fig[def.nome].criar(Object.assign({ estatica: true }, def.p || {}));
    return EA.el('div', { class: 'figura' }, f.svg);
  };
})();
