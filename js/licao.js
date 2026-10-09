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
      this.acertos = 0;
      this.respondidas = 0;
      // Roteiro da etapa (painel lateral no computador)
      const prog = EA.progresso.etapa(e.id);
      this.max = prog.feito ? e.telas.length - 1 : prog.max || prog.tela || 0;
      this.roteiro = el('ol', { class: 'roteiro-lista' });
      e.telas.forEach((t, i) => {
        const nome = t.titulo || (t.tipo === 'fim' ? 'Conclusão' : 'Tela ' + (i + 1));
        const b = el('button', { type: 'button', class: 'roteiro-item', onclick: () => i <= this.max && i !== this.i && this.ir(i) }, [
          el('span', { class: 'roteiro-n', 'aria-hidden': 'true', texto: i + 1 }),
          el('span', { class: 'roteiro-nome', html: fmt(nome) }),
        ]);
        this.roteiro.append(el('li', {}, b));
      });
      this.raiz.innerHTML = '';
      this.raiz.append(
        el('div', { class: 'cabeca' }, [
          el('header', { class: 'topo-etapa' }, [
            el('a', { class: 'btn leve pequeno', href: '#/', 'aria-label': 'Voltar ao início', texto: '⌂ Início' }),
            el('div', { class: 'topo-titulo' }, [
              el('span', { class: 'chip', texto: e.id }),
              el('span', { texto: e.titulo }),
            ]),
            (this.contador = el('span', { class: 'topo-contador', 'aria-live': 'polite' })),
          ]),
          el('div', { class: 'barra-progresso', role: 'progressbar', 'aria-label': 'Progresso da etapa', 'aria-valuemin': 0, 'aria-valuemax': 100 }, this.barra),
        ]),
        el('div', { class: 'etapa-corpo' }, [
          el('aside', { class: 'roteiro', 'aria-label': 'Roteiro da etapa' }, [
            el('p', { class: 'roteiro-titulo' }, [el('span', { class: 'chip', texto: e.id }), ' ', e.titulo]),
            el('p', { class: 'nota', texto: `Descritor ${e.descritor} · ${e.minutos} min` }),
            this.roteiro,
          ]),
          this.palco,
        ]),
        el('footer', { class: 'acoes' }, el('div', { class: 'acoes-dentro' }, [this.btnVoltar, this.btnProx]))
      );
      EA.licaoAtual = this;
    }

    ir(i) {
      const telas = this.etapa.telas;
      this.i = Math.max(0, Math.min(i, telas.length - 1));
      this.max = Math.max(this.max, this.i);
      if (telas[this.i].tipo !== 'fim') EA.progresso.atualizar(this.etapa.id, { tela: this.i, max: this.max });
      [...this.roteiro.children].forEach((li, j) => {
        const b = li.firstChild;
        b.classList.toggle('atual', j === this.i);
        b.classList.toggle('visto', j < this.i || (j <= this.max && j !== this.i));
        b.disabled = j > this.max;
        if (j === this.i) b.setAttribute('aria-current', 'step');
        else b.removeAttribute('aria-current');
      });
      const tela = telas[this.i];
      this.palco.innerHTML = '';
      const bloco = el('section', { class: 'tela entra tela-' + tela.tipo });
      if (tela.titulo) bloco.append(el('h2', { html: fmt(tela.titulo) }));
      this.palco.append(bloco);
      this.ctrl = EA.telas[tela.tipo](bloco, tela, this) || {};
      const pct = Math.round(((this.i + 1) / telas.length) * 100);
      this.barra.style.width = pct + '%';
      this.barra.parentNode.setAttribute('aria-valuenow', pct);
      this.contador.textContent = `${this.i + 1}/${telas.length}`;
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

    // Placar da sessão: perguntas acertadas de primeira
    registrar(r) {
      this.respondidas++;
      if (r && r.ok) this.acertos++;
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

  // Teclado no computador: setas ou Page Up/Down (passador de slides), fora dos campos de texto.
  document.addEventListener('keydown', (ev) => {
    const l = EA.licaoAtual;
    if (!l || !document.body.contains(l.palco) || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
    if (ev.key === 'ArrowRight' || ev.key === 'PageDown') {
      ev.preventDefault();
      l.proximo();
    } else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') {
      ev.preventDefault();
      l.voltar();
    }
  });

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
    bloco.append(el('div', { class: 'lado-a-lado' }, [
      el('div', { class: 'figura' }, f.svg),
      el('div', { class: 'lado-texto' }, [pontos, legenda, rever]),
    ]));
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
      rotulo: () => (k < n - 1 ? 'Próximo passo ▶' : 'Próximo →'),
    };
  };

  EA.telas.item = function (bloco, tela, L) {
    let feito = false;
    if (tela.html) bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    EA.item(bloco, tela.item, {
      modo: 'pratica',
      aoTerminar(r) {
        feito = true;
        L.registrar(r);
        L.liberar();
      },
    });
    return { pronto: () => feito };
  };

  EA.telas.widget = function (bloco, tela, L) {
    let feito = false;
    if (tela.html) bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    const area = el('div');
    let mostrou = false;
    EA.widgets[tela.widget](bloco, tela.p || {}, () => {
      if (mostrou) return;
      mostrou = true;
      EA.item(area, tela.item, {
        modo: 'pratica',
        aoTerminar(r) {
          feito = true;
          L.registrar(r);
          L.liberar();
        },
      });
      setTimeout(() => area.scrollIntoView({ behavior: EA.reduzMovimento() ? 'auto' : 'smooth', block: 'start' }), 80);
    });
    bloco.append(area);
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

  // Cartões que aparecem um por toque em Próximo e ficam na tela (passos, contraste, roteiros).
  function revelar(bloco, tela, cartoes, montarCartao, classeGrade) {
    if (tela.html) bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    const grade = el('div', { class: classeGrade });
    bloco.append(grade);
    const depois = tela.depois ? el('div', { class: 'texto entra', html: fmt(tela.depois) }) : null;
    let k = 0;
    function mostrar() {
      grade.innerHTML = '';
      cartoes.slice(0, k + 1).forEach((c, i) => {
        const card = montarCartao(c, i);
        if (i === k) card.classList.add('entra', 'novo');
        grade.append(card);
      });
      if (depois) {
        depois.remove();
        if (k === cartoes.length - 1) bloco.append(depois);
      }
      if (k > 0) {
        const ultimo = grade.lastElementChild;
        requestAnimationFrame(() => ultimo.scrollIntoView({ behavior: EA.reduzMovimento() ? 'auto' : 'smooth', block: 'nearest' }));
      }
    }
    mostrar();
    return {
      podeVoltar: () => k > 0,
      avancar() {
        if (k < cartoes.length - 1) {
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
      rotulo: () => (k < cartoes.length - 1 ? 'Mostrar o próximo ▶' : 'Próximo →'),
    };
  }

  // Três cartões de contraste, um de cada vez
  EA.telas.cartoes = function (bloco, tela) {
    return revelar(bloco, tela, tela.cartoes, (c) =>
      el('article', { class: 'cartao cartao-' + c.tom }, [
        el('h3', { class: 'm', html: c.titulo }),
        EA.figura(c.fig),
        el('p', { class: 'resultado', html: fmt(c.resultado) }),
        el('p', { class: 'nota', html: fmt(c.teste) }),
      ]), 'cartoes');
  };

  // Passo a passo (exemplo resolvido, roteiro, lembrete): um passo por toque
  EA.telas.passos = function (bloco, tela) {
    return revelar(bloco, tela, tela.passos, (c, i) =>
      el('article', { class: 'passo-card' + (c.tipo ? ' passo-' + c.tipo : '') }, [
        el('span', { class: 'passo-num', 'aria-hidden': 'true', texto: c.marca || String(i + 1) }),
        el('div', { class: 'passo-corpo' }, [
          c.titulo ? el('p', { class: 'passo-titulo', html: fmt(c.titulo) }) : null,
          el('div', { html: fmt(c.html) }),
          c.fig ? EA.figura(c.fig) : null,
        ]),
      ]), 'passos-lista');
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
      if (tela.criterios) return tela.criterios(j);
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
          L.registrar(r);
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

  // Identificar por toque: o aluno toca no segmento pedido. Termina com N acertos de primeira seguidos.
  EA.telas.toque = function (bloco, tela, L) {
    const meta = tela.meta || 3;
    let seguidos = 0, feito = false, n = 0;
    if (tela.html) bloco.append(el('div', { class: 'texto', html: fmt(tela.html) }));
    const placar = el('div', { class: 'toque-placar', 'aria-live': 'polite' });
    const area = el('div');
    bloco.append(placar, area);
    function desenharPlacar() {
      placar.innerHTML = '';
      placar.append(el('span', { texto: `Meta: ${meta} acertos de primeira seguidos` }));
      for (let i = 0; i < meta; i++) placar.append(el('span', { class: 'casa ' + (i < seguidos ? 'ok' : ''), texto: i < seguidos ? '✓' : '' }));
    }
    function proxima() {
      area.innerHTML = '';
      const t = tela.gerar(n++);
      const f = EA.fig.triRet.criar(Object.assign({}, t.fig, { alvos: t.alvos }));
      const retorno = el('div', { class: 'retorno', 'aria-live': 'polite' });
      area.append(...[
        el('p', { class: 'contador', texto: `Desafio ${n}` }),
        t.contexto ? el('p', { class: 'contexto', html: fmt(t.contexto) }) : null,
        el('p', { class: 'pergunta', html: fmt(t.pergunta) }),
        el('div', { class: 'figura' }, f.svg),
        el('p', { class: 'nota', texto: 'Toque direto no segmento da figura. No computador, também dá para usar Tab e Enter.' }),
        retorno,
      ].filter(Boolean));
      let primeira = true, ok = false;
      const mostrar = (certo, html) => {
        retorno.className = 'retorno entra ' + (certo ? 'certo' : 'errado');
        retorno.innerHTML = '';
        retorno.append(
          el('p', { class: 'retorno-cab' }, [el('span', { class: 'retorno-icone', 'aria-hidden': 'true', texto: certo ? '✓' : '✗' }), el('strong', { texto: certo ? 'Certo!' : 'Ainda não.' })]),
          el('div', { class: 'retorno-txt', html: fmt(html) })
        );
        requestAnimationFrame(() => retorno.scrollIntoView({ behavior: EA.reduzMovimento() ? 'auto' : 'smooth', block: 'nearest' }));
      };
      f.aoTocar((q) => {
        if (ok) return;
        if (q === t.alvo) {
          ok = true;
          f.marcar(q, 'certo');
          seguidos = primeira ? seguidos + 1 : 0;
          L.registrar({ ok: primeira });
          desenharPlacar();
          mostrar(true, t.fbCerto || `Esse é ${EA.nomeSeg[q]}.`);
          if (seguidos >= meta) {
            feito = true;
            area.append(el('div', { class: 'cartao destaque entra' }, [el('p', { class: 'grande', texto: '🎉 Você reconhece os elementos! Toque em Próximo.' })]));
            L.liberar();
          } else {
            area.append(el('button', { class: 'btn primario largo entra', type: 'button', texto: 'Próximo desafio →', onclick: proxima }));
          }
        } else {
          primeira = false;
          f.marcar(q, 'errado');
          mostrar(false, (t.fb && t.fb[q]) || `Esse é ${EA.nomeSeg[q]}. Procure de novo.`);
        }
      });
      window.scrollTo({ top: bloco.offsetTop, behavior: EA.reduzMovimento() ? 'auto' : 'smooth' });
    }
    desenharPlacar();
    proxima();
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
    if (L.respondidas) {
      bloco.append(el('div', { class: 'resumo-fim entra' }, [
        el('span', { class: 'resumo-n', texto: `${L.acertos}/${L.respondidas}` }),
        el('span', { texto: 'perguntas certas de primeira nesta sessão. Os erros também contam: cada um mostrou um caminho.' }),
      ]));
    }
    return {
      rotulo: () => (seguinte ? `Ir para a etapa ${seguinte} →` : 'Voltar ao início'),
      avancar() {
        location.hash = seguinte ? '#/etapa/' + seguinte : '#/';
        return true;
      },
    };
  };

  // ---------------- Widgets ----------------

  // Pátio com controle de x: três contas ao vivo e uma tabela com os valores testados.
  // A pergunta só aparece depois de 3 valores diferentes.
  EA.widgets.patio = function (bloco, p, liberar) {
    const A = p.A || 12;
    const MIN = 3;
    let x = p.x != null ? p.x : 4;
    const testados = new Map();
    const f = EA.fig.patio.criar({ A, x, rot: { a: A + ' m', b: 'x' } });
    const valorX = el('output', { class: 'valor-x' });
    const faixa = el('input', { type: 'range', min: 0, max: A, step: 1, value: x, 'aria-label': 'Lado x do canteiro' });
    const menos = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'Diminuir x', texto: '−' });
    const mais = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'Aumentar x', texto: '+' });
    const linhas = el('div', { class: 'contas' });
    const aviso = el('p', { class: 'faca', 'aria-live': 'polite' });
    const tabela = el('div', { class: 'tabela-x' });
    bloco.append(
      el('div', { class: 'lado-a-lado' }, [
        el('div', {}, [
          el('div', { class: 'figura compacta' }, f.svg),
          el('div', { class: 'controle' }, [menos, el('div', { class: 'faixa' }, [valorX, faixa]), mais]),
        ]),
        el('div', {}, [linhas, aviso, tabela]),
      ])
    );
    const q = A * A;
    function conta(rotulo, valor, real, ref) {
      const bate = valor === real;
      return el('div', { class: 'conta' + (ref ? ' ref' : bate ? ' bate' : ' naobate') }, [
        el('span', { class: 'm conta-expr', html: rotulo }),
        el('span', { class: 'conta-val', texto: EA.num(valor) }),
        el('span', { class: 'conta-tag', texto: ref ? 'piso de verdade' : bate ? '✓ bate com o piso' : '✗ não bate' }),
      ]);
    }
    function desenharTabela() {
      tabela.innerHTML = '';
      if (!testados.size) return;
      const t = el('table', {}, [
        el('caption', { texto: 'Valores que você testou' }),
        el('thead', {}, el('tr', {}, ['x', `${q} − x²`, `(${A} − x)²`, `(${A} − x)(${A} + x)`].map((h) => el('th', { class: 'm', scope: 'col', texto: h })))),
      ]);
      const corpo = el('tbody');
      [...testados.keys()].sort((a, b) => a - b).forEach((v) => {
        const real = q - v * v, quad = (A - v) * (A - v), prod = (A - v) * (A + v);
        corpo.append(el('tr', {}, [
          el('td', { texto: v }),
          el('td', { texto: EA.num(real) }),
          el('td', { class: quad === real ? 'bate' : 'naobate', texto: EA.num(quad) + (quad === real ? ' ✓' : ' ✗') }),
          el('td', { class: prod === real ? 'bate' : 'naobate', texto: EA.num(prod) + (prod === real ? ' ✓' : ' ✗') }),
        ]));
      });
      t.append(corpo);
      tabela.append(t);
    }
    function atualizar(mexeu) {
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
      if (mexeu) testados.set(x, true);
      desenharTabela();
      const falta = MIN - testados.size;
      if (falta > 0) aviso.textContent = `▶ Faça: teste ${falta === MIN ? 'pelo menos 3 valores' : 'mais ' + falta + (falta === 1 ? ' valor' : ' valores')} de x. Use os botões − e +.`;
      else {
        aviso.textContent = 'Olhe a tabela: qual coluna sempre bate com o piso? Responda logo abaixo.';
        liberar();
      }
    }
    faixa.addEventListener('input', () => {
      x = Number(faixa.value);
      atualizar(true);
    });
    menos.addEventListener('click', () => {
      x = Math.max(0, x - 1);
      atualizar(true);
    });
    mais.addEventListener('click', () => {
      x = Math.min(A, x + 1);
      atualizar(true);
    });
    atualizar(false);
  };
})();
