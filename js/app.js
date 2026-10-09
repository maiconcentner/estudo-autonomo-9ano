// Início, área do professor e rotas (#/, #/etapa/1B, #/professor).
(function () {
  const EA = window.EA;
  const { el, fmt } = EA;
  const app = document.getElementById('app');

  // Trilhas ainda sem conteúdo aparecem como "em breve"
  EA.registrarTrilha({
    id: 'T2',
    titulo: 'Relações métricas no triângulo retângulo',
    descricao: 'Altura, projeções e catetos: qual relação usar e como conferir por Pitágoras.',
    emBreve: true,
    etapas: [],
  });

  const ROTULO_TEMA = { auto: '◐ Tema: auto', claro: '☀ Tema: claro', escuro: '☾ Tema: escuro' };

  function botaoTema() {
    const b = el('button', { class: 'btn leve pequeno', type: 'button' });
    const pintar = () => (b.textContent = ROTULO_TEMA[EA.aplicarTema()]);
    b.addEventListener('click', () => {
      const ordem = ['auto', 'claro', 'escuro'];
      const atual = EA.progresso.pref('tema') || 'auto';
      EA.progresso.pref('tema', ordem[(ordem.indexOf(atual) + 1) % 3]);
      pintar();
    });
    pintar();
    return b;
  }

  function estado(id) {
    const p = EA.progresso.etapa(id);
    if (p.feito) return { cls: 'feita', txt: '✓ Concluída', acao: 'Refazer' };
    if (p.tela) return { cls: 'andamento', txt: '◔ Em andamento', acao: 'Continuar' };
    return { cls: '', txt: '', acao: 'Começar' };
  }

  function inicio() {
    document.title = 'Estudo Autônomo 9º ano';
    app.innerHTML = '';
    const sugerida = EA.trilhas.flatMap((t) => t.etapas).find((e) => !EA.progresso.etapa(e.id).feito);

    const cab = el('header', { class: 'topo-inicio' }, [
      el('div', {}, [
        el('p', { class: 'sobretitulo', texto: 'Matemática · 9º ano' }),
        el('h1', { texto: 'Estudo autônomo' }),
      ]),
      botaoTema(),
    ]);

    const intro = el('section', { class: 'cartao intro' }, [
      el('p', { html: 'Estude no seu ritmo, pelo celular ou pelo computador. Cada etapa leva <strong>de 5 a 8 minutos</strong>.' }),
      el('ul', { class: 'lista-curta' }, [
        el('li', { texto: 'Uma ideia por tela.' }),
        el('li', { texto: 'Errou? A resposta explica o seu erro e você tenta de novo.' }),
        el('li', { texto: 'No fim de cada etapa você ganha um código para mostrar ao professor.' }),
      ]),
    ]);

    const lista = el('div', { class: 'trilhas' });
    EA.trilhas.forEach((t, n) => {
      const card = el('section', { class: 'trilha' + (t.emBreve ? ' em-breve' : '') }, [
        el('div', { class: 'trilha-cab' }, [
          el('span', { class: 'trilha-num', texto: 'Trilha ' + (n + 1) }),
          t.emBreve ? el('span', { class: 'chip suave', texto: 'Em breve' }) : null,
        ]),
        el('h2', { texto: t.titulo }),
        el('p', { class: 'nota', texto: t.descricao }),
      ]);
      t.etapas.forEach((e) => {
        const st = estado(e.id);
        const p = EA.progresso.etapa(e.id);
        card.append(
          el('a', { class: 'etapa-link ' + st.cls + (sugerida === e ? ' sugerida' : ''), href: '#/etapa/' + e.id }, [
            el('span', { class: 'etapa-id', texto: e.id }),
            el('span', { class: 'etapa-info' }, [
              el('strong', { texto: e.titulo }),
              el('span', { class: 'nota', html: fmt(e.resumo) }),
              el('span', { class: 'etapa-meta' }, [
                el('span', { texto: '⏱ ' + e.minutos + ' min' }),
                st.txt ? el('span', { class: 'status', texto: st.txt }) : null,
                p.feito && p.codigo ? el('span', { class: 'status', texto: 'Código: ' + p.codigo }) : null,
              ]),
            ]),
            el('span', { class: 'etapa-acao' }, [sugerida === e ? el('span', { class: 'chip', texto: 'Comece aqui' }) : null, el('span', { texto: st.acao + ' →' })]),
          ])
        );
      });
      lista.append(card);
    });

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

    app.append(el('div', { class: 'pagina' }, [cab, intro, lista, rodape]));
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
        el('div', {}, [el('p', { class: 'sobretitulo', texto: 'Estudo autônomo' }), el('h1', { texto: 'Área do professor' })]),
        el('a', { class: 'btn leve pequeno', href: '#/', texto: '⌂ Início' }),
      ]),
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
