// Motor das etapas: uma tela por vez, botões grandes embaixo (alcance do polegar).
(function () {
  const EA = window.EA;
  const { el, fmt } = EA;

  EA.telas = {};
  EA.widgets = {};

  class Licao {
    constructor(raiz, etapa) {
      this.raiz = raiz;
      this.etapa = etapa;
      this.ctrl = {};
      this.montar();
    }

    montar() {
      const e = this.etapa;
      this.barra = el('div', { class: 'barra-progresso-fill' });
      this.btnVoltar = el('button', { class: 'btn', type: 'button', texto: '← Voltar', onclick: () => this.voltar() });
      this.btnProx = el('button', { class: 'btn primario', type: 'button', texto: 'Próximo →', onclick: () => this.proximo() });
      this.palco = el('main', { class: 'palco', id: 'conteudo', tabindex: '-1' });
      this.raiz.innerHTML = '';
      this.raiz.append(
        el('div', { class: 'cabeca' }, [
          el('header', { class: 'topo-etapa' }, [
            el('a', { class: 'btn leve pequeno', href: '#/', 'aria-label': 'Voltar ao início', texto: '⌂ Início' }),
            el('div', { class: 'topo-titulo' }, [
              el('span', { class: 'chip', texto: e.id }),
              el('span', { texto: e.titulo }),
            ]),
          ]),
          el('div', { class: 'barra-progresso', role: 'progressbar', 'aria-label': 'Progresso da etapa', 'aria-valuemin': 0, 'aria-valuemax': 100 }, this.barra),
        ]),
        this.palco,
        el('footer', { class: 'acoes' }, [this.btnVoltar, this.btnProx])
      );
    }

    ir(i) {
      const telas = this.etapa.telas;
      this.i = Math.max(0, Math.min(i, telas.length - 1));
      if (telas[this.i].tipo !== 'fim') EA.progresso.atualizar(this.etapa.id, { tela: this.i });
      const tela = telas[this.i];
      this.palco.innerHTML = '';
      const bloco = el('section', { class: 'tela entra' });
      if (tela.titulo) bloco.append(el('h2', { html: fmt(tela.titulo) }));
      this.palco.append(bloco);
      this.ctrl = EA.telas[tela.tipo](bloco, tela, this) || {};
      const pct = Math.round(((this.i + 1) / telas.length) * 100);
      this.barra.style.width = pct + '%';
      this.barra.parentNode.setAttribute('aria-valuenow', pct);
      window.scrollTo(0, 0);
      this.palco.focus({ preventScroll: true });
      this.atualizar();
    }

    atualizar() {
      const pronto = this.ctrl.pronto ? this.ctrl.pronto() : true;
      this.btnProx.disabled = !pronto;
      this.btnProx.textContent = this.ctrl.rotulo ? this.ctrl.rotulo() : 'Próximo →';
      this.btnVoltar.disabled = this.i === 0 && !(this.ctrl.podeVoltar && this.ctrl.podeVoltar());
      this.btnProx.classList.toggle('chama', pronto && !!this.ctrl.chamar);
    }

    // Chamado quando o aluno termina a tarefa da tela: o botão pisca para mostrar o caminho.
    liberar() {
      this.ctrl.chamar = true;
      this.atualizar();
    }

    proximo() {
      if (this.btnProx.disabled) return;
      if (this.ctrl.avancar && this.ctrl.avancar()) return this.atualizar();
      if (this.i < this.etapa.telas.length - 1) this.ir(this.i + 1);
      else location.hash = '#/';
    }

    voltar() {
      if (this.ctrl.voltar && this.ctrl.voltar()) return this.atualizar();
      if (this.i > 0) this.ir(this.i - 1);
    }
  }

  EA.abrirEtapa = function (raiz, id) {
    const etapa = EA.etapas[id];
    const prog = EA.progresso.etapa(id);
    const l = new Licao(raiz, etapa);
    const inicio = !prog.feito && prog.tela ? prog.tela : 0;
    l.ir(inicio);
    return l;
  };

  // ---------------- Tipos de tela ----------------

  EA.telas.texto = function (bloco, tela) {
    if (tela.fig) bloco.append(EA.figura(tela.fig));
    bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
  };

  EA.telas.regra = function (bloco, tela) {
    bloco.append(
      el('div', { class: 'regra entra-zoom' }, [el('p', { class: 'regra-formula m', html: tela.formula })]),
      el('div', { class: 'texto', html: fmt(tela.html) })
    );
    if (tela.fig) bloco.append(EA.figura(tela.fig));
  };

  EA.telas.anim = function (bloco, tela) {
    const f = EA.fig[tela.fig].criar(tela.p || {});
    const n = tela.passos.length;
    const legenda = el('div', { class: 'legenda', 'aria-live': 'polite' });
    const pontos = el('div', { class: 'pontos', 'aria-hidden': 'true' });
    for (let i = 0; i < n; i++) pontos.append(el('span'));
    const rever = el('button', { class: 'btn leve pequeno', type: 'button', texto: '↺ Rever movimento' });
    bloco.append(el('div', { class: 'figura' }, f.svg), pontos, legenda, rever);
    let k = 0;
    function mostrar(sem) {
      f.ir(k, sem);
      legenda.innerHTML = '';
      legenda.append(el('p', { class: 'entra', html: fmt(tela.passos[k]) }));
      [...pontos.children].forEach((p, i) => p.classList.toggle('on', i <= k));
      rever.disabled = k === 0;
    }
    rever.addEventListener('click', () => {
      if (k === 0) return;
      f.ir(k - 1, true);
      setTimeout(() => f.ir(k), 120);
    });
    mostrar(true);
    return {
      podeVoltar: () => k > 0,
      avancar() {
        if (k < n - 1) {
          k++;
          mostrar();
          return true;
        }
        return false;
      },
      voltar() {
        if (k > 0) {
          k--;
          mostrar();
          return true;
        }
        return false;
      },
      rotulo: () => (k < n - 1 ? 'Próximo movimento ▶' : 'Próximo →'),
    };
  };

  EA.telas.item = function (bloco, tela, L) {
    let feito = false;
    if (tela.html) bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    EA.item(bloco, tela.item, {
      modo: 'pratica',
      aoTerminar() {
        feito = true;
        L.liberar();
      },
    });
    return { pronto: () => feito };
  };

  EA.telas.widget = function (bloco, tela, L) {
    let feito = false;
    if (tela.html) bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    EA.widgets[tela.widget](bloco, tela.p || {});
    EA.item(bloco, tela.item, {
      modo: 'pratica',
      aoTerminar() {
        feito = true;
        L.liberar();
      },
    });
    return { pronto: () => feito };
  };

  // Teste de entrada: uma tentativa por item. Quem acerta tudo pode pular a etapa.
  EA.telas.teste = function (bloco, tela, L) {
    let terminou = false;
    let acertos = 0;
    let idx = 0;
    const n = tela.itens.length;
    bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    const area = el('div', { class: 'teste-area' });
    bloco.append(area);

    function proximo() {
      area.innerHTML = '';
      if (idx >= n) return resultado();
      area.append(el('p', { class: 'contador', texto: `Pergunta ${idx + 1} de ${n}` }));
      EA.item(area, tela.itens[idx], {
        modo: 'teste',
        aoTerminar(r) {
          if (r.ok) acertos++;
          idx++;
          setTimeout(proximo, 450);
        },
      });
    }

    function resultado() {
      terminou = true;
      const tudo = acertos === n;
      area.append(
        el('div', { class: 'cartao destaque entra' }, [
          el('p', { class: 'grande', texto: `Você acertou ${acertos} de ${n}.` }),
          el('p', { html: fmt(tudo ? tela.seAcertarTudo : tela.seErrar) }),
        ])
      );
      if (tudo) {
        const fim = L.etapa.telas.findIndex((t) => t.tipo === 'fim');
        area.append(
          el('div', { class: 'pilha' }, [
            el('button', { class: 'btn primario', type: 'button', texto: 'Pular para a conclusão', onclick: () => L.ir(fim) }),
            el('button', { class: 'btn', type: 'button', texto: 'Estudar a etapa mesmo assim', onclick: () => L.ir(L.i + 1) }),
          ])
        );
      }
      L.liberar();
    }
    proximo();
    return { pronto: () => terminou };
  };

  // Três cartões lado a lado (empilhados no celular) para contrastar os produtos notáveis
  EA.telas.cartoes = function (bloco, tela) {
    if (tela.html) bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    const grade = el('div', { class: 'cartoes' });
    tela.cartoes.forEach((c, i) => {
      grade.append(
        el('article', { class: 'cartao cartao-' + c.tom + ' entra', style: `animation-delay:${i * 120}ms` }, [
          el('h3', { class: 'm', html: c.titulo }),
          EA.figura(c.fig),
          el('p', { class: 'resultado', html: fmt(c.resultado) }),
          el('p', { class: 'nota', html: fmt(c.teste) }),
        ])
      );
    });
    bloco.append(grade);
    if (tela.depois) bloco.append(el('div', { class: 'texto', html: fmt(tela.depois) }));
  };

  // Domínio: itens mistos gerados até o aluno cumprir o critério.
  EA.telas.dominio = function (bloco, tela, L) {
    const hist = [];
    let feito = false;
    let numero = 0;
    bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    const placar = el('div', { class: 'placar', 'aria-live': 'polite' });
    const area = el('div');
    bloco.append(placar, area);

    function janela() {
      return hist.slice(-5);
    }
    function criterios() {
      const j = janela();
      return [
        { ok: j.filter((r) => r.ok).length >= 4 && j.length === 5, txt: '4 acertos nas últimas 5 questões' },
        { ok: j.some((r) => r.ok && r.tags.includes('contraste')), txt: 'acertar 1 questão de comparar' },
        { ok: j.some((r) => r.tags.includes('conferencia')), txt: 'fazer 1 conferência com número' },
      ];
    }
    function desenharPlacar() {
      const j = janela();
      const casas = el('div', { class: 'casas', role: 'img', 'aria-label': `Últimas questões: ${j.filter((r) => r.ok).length} acertos de ${j.length}` });
      for (let i = 0; i < 5; i++) {
        const r = j[i];
        casas.append(el('span', { class: 'casa ' + (r ? (r.ok ? 'ok' : 'nao') : ''), texto: r ? (r.ok ? '✓' : '✗') : '' }));
      }
      const lista = el('ul', { class: 'criterios' });
      criterios().forEach((c) => lista.append(el('li', { class: c.ok ? 'ok' : '' }, [el('span', { 'aria-hidden': 'true', texto: c.ok ? '✓ ' : '○ ' }), c.txt])));
      placar.innerHTML = '';
      placar.append(el('p', { class: 'nota', texto: 'Acerto de primeira conta ponto. Dica não tira ponto.' }), casas, lista);
    }
    function proximoItem() {
      area.innerHTML = '';
      numero++;
      const item = tela.gerar(hist);
      area.append(el('p', { class: 'contador', texto: `Questão ${numero}` }));
      EA.item(area, item, {
        modo: 'pratica',
        letras: true,
        aoTerminar(r) {
          hist.push(r);
          desenharPlacar();
          if (criterios().every((c) => c.ok)) {
            feito = true;
            area.append(el('div', { class: 'cartao destaque entra' }, [el('p', { class: 'grande', texto: '🎉 Você dominou! Toque em Próximo para pegar seu código.' })]));
            L.liberar();
          } else {
            area.append(el('button', { class: 'btn primario largo entra', type: 'button', texto: 'Próxima questão →', onclick: proximoItem }));
          }
        },
      });
      window.scrollTo({ top: bloco.offsetTop, behavior: EA.reduzMovimento() ? 'auto' : 'smooth' });
    }
    desenharPlacar();
    proximoItem();
    return { pronto: () => feito };
  };

  EA.telas.fim = function (bloco, tela, L) {
    const id = L.etapa.id;
    const codigo = EA.codigo.gerar(id);
    EA.progresso.atualizar(id, { feito: true, codigo, quando: Date.now(), tela: 0 });
    const seguinte = L.etapa.seguinte;
    bloco.append(
      el('div', { class: 'festa', 'aria-hidden': 'true' }, Array.from({ length: 14 }, (_, i) => el('i', { style: `--i:${i}` }))),
      el('p', { class: 'grande entra', texto: '🎉 Etapa concluída!' }),
      el('div', { class: 'texto', html: fmt(tela.html) }),
      el('div', { class: 'codigo entra-zoom' }, [
        el('span', { class: 'nota', texto: 'Seu código de conclusão' }),
        el('strong', { texto: codigo }),
      ]),
      el('p', { class: 'nota', texto: 'Mostre este código ao professor. Ele vale para o dia de hoje.' })
    );
    return {
      rotulo: () => (seguinte ? `Ir para a etapa ${seguinte} →` : 'Voltar ao início'),
      avancar() {
        location.hash = seguinte ? '#/etapa/' + seguinte : '#/';
        return true;
      },
    };
  };

  // ---------------- Widgets ----------------

  // Pátio com controle de x: três contas ao vivo
  EA.widgets.patio = function (bloco, p) {
    const A = p.A || 12;
    let x = p.x != null ? p.x : 4;
    const f = EA.fig.patio.criar({ A, x, rot: { a: A + ' m', b: 'x' } });
    const valorX = el('output', { class: 'valor-x' });
    const faixa = el('input', { type: 'range', min: 0, max: A, step: 1, value: x, 'aria-label': 'Lado x do canteiro' });
    const menos = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'Diminuir x', texto: '−' });
    const mais = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'Aumentar x', texto: '+' });
    const linhas = el('div', { class: 'contas' });
    bloco.append(
      el('div', { class: 'figura compacta' }, f.svg),
      el('div', { class: 'controle' }, [menos, el('div', { class: 'faixa' }, [valorX, faixa]), mais]),
      linhas
    );
    const q = A * A;
    function conta(rotulo, valor, real, ref) {
      const bate = valor === real;
      return el('div', { class: 'conta' + (ref ? ' ref' : bate ? ' bate' : ' naobate') }, [
        el('span', { class: 'm conta-expr', html: rotulo }),
        el('span', { class: 'conta-val', texto: EA.num(valor) }),
        el('span', { class: 'conta-tag', texto: ref ? 'piso de verdade' : bate ? '✓ bate' : '✗ não bate' }),
      ]);
    }
    function atualizar() {
      f.mudar(x);
      faixa.value = x;
      valorX.textContent = 'x = ' + x + ' m';
      const real = q - x * x;
      linhas.innerHTML = '';
      linhas.append(
        conta(`${q} − x²`, real, real, true),
        conta(`(${A} − x)²`, (A - x) * (A - x), real),
        conta(`(${A} − x)(${A} + x)`, (A - x) * (A + x), real)
      );
      linhas.append(el('p', { class: 'nota', texto: x === 0 || x === A ? 'Nas pontas os valores coincidem. Teste outros valores de x.' : 'Mude x e veja qual conta acompanha o piso de verdade.' }));
    }
    faixa.addEventListener('input', () => {
      x = Number(faixa.value);
      atualizar();
    });
    menos.addEventListener('click', () => {
      x = Math.max(0, x - 1);
      atualizar();
    });
    mais.addEventListener('click', () => {
      x = Math.min(A, x + 1);
      atualizar();
    });
    atualizar();
  };
})();
