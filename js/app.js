// Início, área do professor e rotas (#/, #/etapa/1B, #/professor).
(function () {
  const EA = window.EA;
  const { el, fmt } = EA;
  const app = document.getElementById('app');

  const ROTULO_TEMA = { auto: '🌓 Automático', claro: '☀️ Claro', escuro: '🌙 Escuro' };

  function botaoTema() {
    const b = el('button', { class: 'btn leve pequeno btn-tema', type: 'button' });
    const pintar = () => {
      const t = EA.aplicarTema();
      b.textContent = ROTULO_TEMA[t];
      b.setAttribute('aria-label', 'Tema: ' + ROTULO_TEMA[t].replace(/^\S+\s/, '') + '. Toque para trocar.');
    };
    b.addEventListener('click', () => {
      const ordem = ['auto', 'claro', 'escuro'];
      const atual = EA.progresso.pref('tema') || 'auto';
      EA.progresso.pref('tema', ordem[(ordem.indexOf(atual) + 1) % 3]);
      pintar();
    });
    pintar();
    return b;
  }

  // Logotipo: o quadrado (a + b)² em quatro peças
  function logo() {
    const span = el('span', { class: 'logo', 'aria-hidden': 'true' });
    span.innerHTML = '<svg viewBox="0 0 32 32"><rect x="2" y="2" width="19" height="19" rx="2" class="lg-a"/><rect x="23" y="2" width="7" height="19" rx="2" class="lg-ab"/><rect x="2" y="23" width="19" height="7" rx="2" class="lg-ab"/><rect x="23" y="23" width="7" height="7" rx="2" class="lg-b"/></svg>';
    return span;
  }

  // Anel de progresso (feitas de total)
  function anel(feitas, total) {
    const r = 20, c = 2 * Math.PI * r, f = total ? feitas / total : 0;
    const span = el('span', { class: 'anel', role: 'img', 'aria-label': `${feitas} de ${total} etapas concluídas` });
    span.innerHTML = `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="${r}" class="anel-fundo"/>${f ? `<circle cx="24" cy="24" r="${r}" class="anel-cheio" stroke-dasharray="${c * f} ${c}" transform="rotate(-90 24 24)"/>` : ''}</svg><b>${feitas}/${total}</b>`;
    return span;
  }

  function estado(e) {
    const p = EA.progresso.etapa(e.id);
    if (p.feito) return { cls: 'feita', txt: 'Concluída', acao: 'Refazer', pct: 100 };
    if (p.tela) return { cls: 'andamento', txt: 'Em andamento', acao: 'Continuar', pct: Math.round((p.tela / e.telas.length) * 100) };
    return { cls: 'nova', txt: '', acao: 'Começar', pct: 0 };
  }

  function inicio() {
    document.title = 'Estudo Autônomo 9º ano';
    app.innerHTML = '';
    const todas = EA.trilhas.flatMap((t) => t.etapas);
    const sugerida = todas.find((e) => !EA.progresso.etapa(e.id).feito);

    const cab = el('header', { class: 'topo-inicio' }, [
      el('a', { class: 'marca-site', href: '#/' }, [
        logo(),
        el('span', {}, [el('strong', { texto: 'Estudo autônomo' }), el('small', { texto: 'Matemática · 9º ano' })]),
      ]),
      botaoTema(),
    ]);

    // Cartão principal: continuar ou começar
    let destaque;
    if (sugerida) {
      const st = estado(sugerida);
      destaque = el('a', { class: 'continuar', href: '#/etapa/' + sugerida.id }, [
        el('span', { class: 'continuar-rotulo', texto: st.pct ? 'Continue de onde parou' : todas.indexOf(sugerida) === 0 ? 'Comece por aqui' : 'Próxima etapa' }),
        el('span', { class: 'continuar-linha' }, [
          el('span', { class: 'etapa-id', texto: sugerida.id }),
          el('span', {}, [el('strong', { texto: sugerida.titulo }), el('span', { class: 'nota', html: fmt(sugerida.resumo) })]),
        ]),
        el('span', { class: 'barrinha', role: 'img', 'aria-label': `${st.pct}% da etapa` }, el('i', { style: `width:${st.pct}%` })),
        el('span', { class: 'btn primario largo', texto: (st.pct ? 'Continuar' : 'Começar') + ' →' }),
      ]);
    } else {
      destaque = el('div', { class: 'continuar feito' }, [
        el('span', { class: 'continuar-rotulo', texto: 'Tudo concluído' }),
        el('strong', { texto: '🎉 Você terminou todas as etapas publicadas.' }),
        el('span', { class: 'nota', texto: 'Pode refazer qualquer uma para treinar.' }),
      ]);
    }

    const hero = el('section', { class: 'hero' }, [
      el('div', { class: 'hero-texto' }, [
        el('h1', { html: 'Aprenda <span class="marca-texto">um passo</span> de cada vez.' }),
        el('p', { texto: 'Figuras que se movem, uma ideia por tela e uma explicação para cada erro. Estude pelo celular ou pelo computador.' }),
        el('ul', { class: 'selos' }, [
          el('li', { texto: '⏱ de 5 a 15 min por etapa' }),
          el('li', { texto: '💡 dicas não tiram pontos' }),
          el('li', { texto: '🔒 nada sai do aparelho' }),
        ]),
      ]),
    ]);

    const lista = el('div', { class: 'trilhas' });
    EA.trilhas.forEach((t, n) => {
      const feitas = t.etapas.filter((e) => EA.progresso.etapa(e.id).feito).length;
      const card = el('section', { class: 'trilha' + (t.emBreve ? ' em-breve' : ''), 'aria-labelledby': 'trilha-' + t.id }, [
        el('div', { class: 'trilha-cab' }, [
          el('div', {}, [
            el('span', { class: 'trilha-num', texto: 'Trilha ' + (n + 1) }),
            el('h2', { id: 'trilha-' + t.id, texto: t.titulo }),
          ]),
          t.emBreve ? el('span', { class: 'chip suave', texto: '🔒 Em breve' }) : anel(feitas, t.etapas.length),
        ]),
        el('p', { class: 'nota', texto: t.descricao }),
      ]);
      const mapa = el('ol', { class: 'mapa' });
      t.etapas.forEach((e) => {
        const st = estado(e);
        const p = EA.progresso.etapa(e.id);
        mapa.append(
          el('li', { class: 'mapa-item ' + st.cls + (sugerida === e ? ' sugerida' : '') }, [
            el('span', { class: 'mapa-no', 'aria-hidden': 'true', texto: p.feito ? '✓' : e.id }),
            el('a', { class: 'etapa-link', href: '#/etapa/' + e.id }, [
              el('span', { class: 'etapa-info' }, [
                el('span', { class: 'etapa-topo' }, [
                  el('span', { class: 'etapa-sigla', texto: e.id }),
                  st.txt ? el('span', { class: 'status status-' + st.cls, texto: (p.feito ? '✓ ' : '▸ ') + st.txt }) : null,
                  sugerida === e ? el('span', { class: 'chip', texto: 'Agora' }) : null,
                ]),
                el('strong', { texto: e.titulo }),
                el('span', { class: 'nota', html: fmt(e.resumo) }),
                el('span', { class: 'etapa-meta' }, [
                  el('span', { texto: '⏱ ' + e.minutos + ' min' }),
                  el('span', { texto: e.telas.length + ' telas' }),
                  p.feito && p.codigo ? el('span', { class: 'cod', texto: 'Código ' + p.codigo }) : null,
                ]),
                st.cls === 'andamento' ? el('span', { class: 'barrinha', role: 'img', 'aria-label': `${st.pct}% da etapa` }, el('i', { style: `width:${st.pct}%` })) : null,
              ]),
              el('span', { class: 'etapa-acao', texto: st.acao + ' →' }),
            ]),
          ])
        );
      });
      if (t.etapas.length) card.append(mapa);
      lista.append(card);
    });

    const como = el('section', { class: 'como', 'aria-labelledby': 'como-titulo' }, [
      el('h2', { id: 'como-titulo', texto: 'Como funciona' }),
      el('ol', { class: 'como-lista' }, [
        el('li', {}, [el('span', { class: 'como-ic', texto: '👀' }), el('strong', { texto: 'Veja' }), el('span', { texto: 'As figuras se movem um passo por toque. Dá para rever.' })]),
        el('li', {}, [el('span', { class: 'como-ic', texto: '✍️' }), el('strong', { texto: 'Tente' }), el('span', { texto: 'Errou? A resposta explica o seu erro e você tenta de novo.' })]),
        el('li', {}, [el('span', { class: 'como-ic', texto: '🔢' }), el('strong', { texto: 'Confira' }), el('span', { texto: 'Troque a letra por um número e veja se os dois lados batem.' })]),
        el('li', {}, [el('span', { class: 'como-ic', texto: '🎟️' }), el('strong', { texto: 'Mostre' }), el('span', { texto: 'No fim de cada etapa você ganha um código para o professor.' })]),
      ]),
    ]);

    const rodape = el('footer', { class: 'rodape' }, [
      el('p', { class: 'nota', texto: 'Seu progresso fica salvo só neste aparelho. Nada é enviado para a internet.' }),
      el('div', { class: 'linha-botoes' }, [
        el('a', { class: 'btn leve pequeno', href: '#/professor', texto: 'Área do professor' }),
        el('button', {
          class: 'btn leve pequeno', type: 'button', texto: 'Apagar meu progresso',
          onclick() {
            if (window.confirm('Apagar todo o progresso deste aparelho?')) {
              EA.progresso.apagar();
              inicio();
            }
          },
        }),
      ]),
    ]);

    app.append(el('div', { class: 'pagina pagina-inicio' }, [cab, el('div', { class: 'abertura' }, [hero, como]), destaque, lista, rodape]));
  }

  function professor() {
    document.title = 'Área do professor · Estudo Autônomo';
    app.innerHTML = '';
    const campo = el('input', { type: 'text', class: 'num', autocomplete: 'off', autocapitalize: 'characters', placeholder: 'Ex.: 1B-0910-QK', 'aria-label': 'Código do aluno' });
    const saida = el('div', { class: 'retorno', 'aria-live': 'polite' });
    function conferir() {
      const r = EA.codigo.conferir(campo.value);
      saida.className = 'retorno entra ' + (r && r.valido && EA.etapas[r.etapa] ? 'certo' : 'errado');
      if (!r) saida.textContent = 'Formato não reconhecido. O código tem a forma ETAPA-DIAMÊS-XX.';
      else if (!r.valido || !EA.etapas[r.etapa]) saida.textContent = 'Código inválido: os dois últimos caracteres não conferem.';
      else saida.textContent = `Válido. Etapa ${r.etapa} (${EA.etapas[r.etapa].titulo}) concluída no dia ${r.dia}.`;
    }
    campo.addEventListener('keydown', (e) => e.key === 'Enter' && conferir());

    const tabela = el('div', { class: 'tabela-etapas' });
    EA.trilhas.forEach((t) => t.etapas.forEach((e) => {
      tabela.append(el('div', { class: 'cartao' }, [
        el('p', {}, [el('span', { class: 'chip', texto: e.id }), ' ', el('strong', { texto: e.titulo })]),
        el('p', { class: 'nota', texto: `Descritor ${e.descritor} · ${e.minutos} min · ${e.telas.length} telas` }),
        el('p', { class: 'nota', html: fmt(e.resumo) }),
      ]));
    }));

    app.append(el('div', { class: 'pagina' }, [
      el('header', { class: 'topo-inicio' }, [
        el('a', { class: 'marca-site', href: '#/' }, [logo(), el('span', {}, [el('strong', { texto: 'Estudo autônomo' }), el('small', { texto: 'Área do professor' })])]),
        el('a', { class: 'btn leve pequeno', href: '#/', texto: '⌂ Início' }),
      ]),
      el('h1', { class: 'titulo-pagina', texto: 'Área do professor' }),
      el('section', { class: 'cartao' }, [
        el('h2', { texto: 'Conferir código de conclusão' }),
        el('p', { class: 'nota', texto: 'O aluno recebe um código ao terminar cada etapa. Os dois últimos caracteres conferem a etapa e o dia. É uma checagem simples, sem login e sem coleta de dados.' }),
        el('div', { class: 'numlinha' }, [campo, el('button', { class: 'btn primario', type: 'button', texto: 'Conferir', onclick: conferir })]),
        saida,
      ]),
      el('section', {}, [el('h2', { texto: 'Etapas publicadas' }), tabela]),
    ]));
  }

  function rota() {
    const partes = location.hash.replace(/^#\/?/, '').split('/');
    if (partes[0] === 'etapa' && EA.etapas[partes[1]]) {
      document.title = partes[1] + ' · Estudo Autônomo';
      EA.abrirEtapa(app, partes[1]);
    } else if (partes[0] === 'professor') professor();
    else inicio();
    window.scrollTo(0, 0);
  }

  EA.aplicarTema();
  window.addEventListener('hashchange', rota);
  rota();
})();
