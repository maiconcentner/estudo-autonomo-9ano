// Itens de prática: partes de escolha ou de número, retorno específico para cada erro
// e dicas em três degraus (pista, pista maior, solução comentada).
(function () {
  const EA = window.EA;
  const { el, fmt } = EA;

  function mostrarRetorno(caixa, certo, html, fig) {
    caixa.innerHTML = '';
    caixa.className = 'retorno entra ' + (certo ? 'certo' : 'errado');
    caixa.append(
      el('p', { class: 'retorno-cab' }, [
        el('span', { class: 'retorno-icone', 'aria-hidden': 'true', texto: certo ? '✓' : '✗' }),
        el('strong', { texto: certo ? 'Certo!' : 'Ainda não.' }),
      ]),
      el('div', { class: 'retorno-txt', html: fmt(html) })
    );
    if (fig) caixa.append(EA.figura(fig));
    requestAnimationFrame(() => {
      const r = caixa.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 90 || r.top < 0) {
        caixa.scrollIntoView({ behavior: EA.reduzMovimento() ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  }

  function dicas(lista) {
    const caixa = el('div', { class: 'dicas' });
    let n = 0;
    const btn = el('button', { class: 'btn dica', type: 'button', texto: '💡 Preciso de uma dica' });
    btn.addEventListener('click', () => {
      const ultima = n === lista.length - 1;
      caixa.insertBefore(
        el('div', { class: 'dica-txt entra', html: `<strong>${ultima ? 'Solução comentada' : 'Dica ' + (n + 1)}:</strong> ${fmt(lista[n])}` }),
        btn
      );
      n++;
      if (n >= lista.length) btn.remove();
      else btn.textContent = n === lista.length - 1 ? '💡 Ver a solução comentada' : '💡 Outra dica';
    });
    caixa.append(btn, el('p', { class: 'nota', texto: 'Dicas não tiram pontos.' }));
    return caixa;
  }

  function parteEscolha(bloco, parte, op, fim) {
    if (parte.html) bloco.append(el('p', { class: 'pergunta', html: fmt(parte.html) }));
    if (parte.fig) bloco.append(EA.figura(parte.fig));
    const lista = el('div', { class: 'opcoes', role: 'group', 'aria-label': 'Alternativas' });
    const retorno = el('div', { class: 'retorno', 'aria-live': 'polite' });
    const ops = parte.fixo ? parte.opcoes.slice() : EA.embaralhar(parte.opcoes);
    let primeira = true;
    let terminou = false;

    ops.forEach((o, i) => {
      const marca = el('span', { class: 'marca', 'aria-hidden': 'true' });
      const b = el('button', { class: 'opcao', type: 'button' }, [
        op.letras ? el('span', { class: 'letra', texto: 'ABCDE'[i] }) : null,
        el('span', { class: 'otexto' + (o.txt ? '' : ' m'), html: fmt(o.t) }),
        marca,
      ]);
      b.addEventListener('click', () => {
        if (terminou || b.classList.contains('errada')) return;
        if (op.modo === 'teste') {
          terminou = true;
          lista.querySelectorAll('button').forEach((x) => (x.disabled = true));
          b.classList.add('escolhida');
          marca.textContent = '•';
          fim(!!o.certo);
          return;
        }
        if (o.certo) {
          terminou = true;
          b.classList.add('certa');
          marca.textContent = '✓';
          b.setAttribute('aria-label', 'Certa: ' + b.textContent);
          lista.querySelectorAll('button').forEach((x) => (x.disabled = true));
          mostrarRetorno(retorno, true, o.fb || 'Isso mesmo!', o.fig);
          fim(primeira, o.txt ? fmt(o.t) : `<span class="m">${o.t}</span>`);
        } else {
          primeira = false;
          b.classList.add('errada');
          marca.textContent = '✗';
          b.setAttribute('aria-label', 'Errada: ' + b.textContent);
          b.setAttribute('aria-disabled', 'true');
          mostrarRetorno(retorno, false, (o.fb || '') + ' Tente outra alternativa.', o.fig);
        }
      });
      lista.append(b);
    });
    bloco.append(lista, retorno);
    if (parte.dicas && op.modo !== 'teste') bloco.append(dicas(parte.dicas));
  }

  function parteNumero(bloco, parte, op, fim) {
    if (parte.html) bloco.append(el('p', { class: 'pergunta', html: fmt(parte.html) }));
    if (parte.fig) bloco.append(EA.figura(parte.fig));
    const campo = el('input', {
      type: 'text', inputmode: 'decimal', autocomplete: 'off', enterkeyhint: 'done',
      class: 'num', 'aria-label': 'Sua resposta', placeholder: 'Sua resposta',
    });
    const btn = el('button', { class: 'btn primario', type: 'button', texto: 'Conferir' });
    const retorno = el('div', { class: 'retorno', 'aria-live': 'polite' });
    let primeira = true;

    function conferir() {
      const v = EA.lerNumero(campo.value);
      if (v === null) {
        mostrarRetorno(retorno, false, 'Digite só o número. Para decimal, use vírgula.');
        return;
      }
      if (op.modo === 'teste') {
        campo.disabled = true;
        btn.remove();
        fim(Math.abs(v - parte.resposta) < 1e-9);
        return;
      }
      if (Math.abs(v - parte.resposta) < 1e-9) {
        campo.disabled = true;
        campo.classList.add('certa');
        btn.remove();
        mostrarRetorno(retorno, true, parte.fbCerto || 'Isso mesmo!');
        fim(primeira, `<span class="m">${EA.num(parte.resposta)}</span>`);
      } else {
        primeira = false;
        campo.classList.remove('treme');
        void campo.offsetWidth;
        campo.classList.add('treme');
        const erros = parte.erros || {};
        mostrarRetorno(retorno, false, erros[String(v)] || parte.fbPadrao || 'Refaça a conta com calma, um passo de cada vez.');
      }
    }
    btn.addEventListener('click', conferir);
    campo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') conferir();
    });
    bloco.append(el('div', { class: 'numlinha' }, [campo, btn]), retorno);
    if (parte.dicas && op.modo !== 'teste') bloco.append(dicas(parte.dicas));
  }

  // Desenha um item (várias partes em sequência). aoTerminar recebe { ok, tags, tipo }.
  EA.item = function (cont, item, op = {}) {
    const raiz = el('div', { class: 'item' });
    cont.append(raiz);
    if (item.contexto) raiz.append(el('p', { class: 'contexto', html: fmt(item.contexto) }));
    if (item.fig) raiz.append(EA.figura(item.fig));
    let ok = true;
    let k = 0;
    function proxima() {
      if (k >= item.partes.length) {
        if (op.aoTerminar) op.aoTerminar({ ok, tags: item.tags || [], tipo: item.tipo });
        return;
      }
      const parte = item.partes[k++];
      const bloco = el('div', { class: 'parte' + (k > 1 ? ' entra' : '') });
      raiz.append(bloco);
      const desenhar = parte.tipo === 'numero' ? parteNumero : parteEscolha;
      if (item.partes.length > 1 && op.modo !== 'teste') {
        bloco.prepend(el('p', { class: 'passo-n', texto: `Passo ${k} de ${item.partes.length}` }));
      }
      desenhar(bloco, parte, op, (okParte, resumo) => {
        if (!okParte) ok = false;
        if (k >= item.partes.length || op.modo === 'teste') return proxima();
        // Uma pergunta por vez: o aluno lê o retorno, toca em Continuar,
        // e a parte resolvida vira uma linha de resumo.
        const seguir = el('button', { class: 'btn primario largo entra', type: 'button', texto: 'Continuar →' });
        seguir.addEventListener('click', () => {
          bloco.innerHTML = '';
          bloco.className = 'parte resolvida entra';
          bloco.append(el('p', {}, [
            el('span', { class: 'ok', 'aria-hidden': 'true', texto: '✓ ' }),
            el('span', { html: fmt(parte.resumo || parte.html) + ' ' }),
            el('strong', { html: resumo }),
          ]));
          proxima();
        });
        bloco.append(seguir);
        requestAnimationFrame(() => seguir.scrollIntoView({ behavior: EA.reduzMovimento() ? 'auto' : 'smooth', block: 'nearest' }));
      });
      if (k > 1) {
        setTimeout(() => bloco.scrollIntoView({ behavior: EA.reduzMovimento() ? 'auto' : 'smooth', block: 'center' }), 60);
      }
    }
    proxima();
  };
})();
