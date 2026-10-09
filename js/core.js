// Núcleo: progresso salvo no aparelho, utilidades de tela e código de conclusão.
(function () {
  const EA = (window.EA = window.EA || {});

  // ---------- Progresso (só no aparelho, e tudo funciona sem ele) ----------
  const CHAVE = 'ea9-v1';
  let dados = null;

  function carregar() {
    if (dados) return dados;
    try {
      dados = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {};
    } catch (e) {
      dados = {};
    }
    if (!dados.etapas) dados.etapas = {};
    return dados;
  }
  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch (e) {
      /* sem armazenamento: segue só na memória */
    }
  }

  EA.progresso = {
    etapa(id) {
      const d = carregar();
      return d.etapas[id] || (d.etapas[id] = {});
    },
    atualizar(id, campos) {
      Object.assign(this.etapa(id), campos);
      salvar();
    },
    pref(chave, valor) {
      const d = carregar();
      if (valor === undefined) return d[chave];
      d[chave] = valor;
      salvar();
    },
    apagar() {
      const tema = carregar().tema;
      dados = { etapas: {}, tema };
      salvar();
    },
  };

  // ---------- Código de conclusão ----------
  // Formato: ETAPA-DDMM-XX. XX confere etapa e dia, para o professor checar na área dele.
  const ALFA = 'ACDEFGHJKMNPQRTUVWXY3479';
  function verificador(etapa, ddmm) {
    let h = 2166136261;
    for (const c of etapa + '|' + ddmm + '|ea9') {
      h ^= c.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    h >>>= 0;
    return ALFA[h % ALFA.length] + ALFA[Math.floor(h / ALFA.length) % ALFA.length];
  }
  EA.codigo = {
    gerar(etapa, data = new Date()) {
      const ddmm = String(data.getDate()).padStart(2, '0') + String(data.getMonth() + 1).padStart(2, '0');
      return etapa + '-' + ddmm + '-' + verificador(etapa, ddmm);
    },
    conferir(texto) {
      const m = /^\s*(\d[A-Z])\s*-?\s*(\d{2})(\d{2})\s*-?\s*([A-Z0-9]{2})\s*$/i.exec(texto || '');
      if (!m) return null;
      const etapa = m[1].toUpperCase();
      const ddmm = m[2] + m[3];
      return { etapa, dia: m[2] + '/' + m[3], valido: verificador(etapa, ddmm) === m[4].toUpperCase() };
    },
  };

  // ---------- Utilidades ----------
  EA.el = function (tag, at = {}, filhos = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(at)) {
      if (v == null || v === false) continue;
      if (k === 'html') e.innerHTML = v;
      else if (k === 'texto') e.textContent = v;
      else if (k === 'class') e.className = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const f of [].concat(filhos)) if (f != null && f !== false) e.append(f);
    return e;
  };

  // Trechos entre $...$ viram fórmula (sem quebra de linha no meio).
  EA.fmt = (s) => String(s == null ? '' : s).replace(/\$([^$]+)\$/g, '<span class="m">$1</span>');

  EA.embaralhar = function (lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  EA.sortear = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  EA.escolher = (lista) => lista[Math.floor(Math.random() * lista.length)];

  EA.num = (n) => Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 4 });

  // Aceita "40", "40,5", "1.000", "−3". Devolve null se não for número.
  EA.lerNumero = function (txt) {
    let t = String(txt || '').trim().replace(/\s/g, '').replace(/[−–]/g, '-');
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '');
    t = t.replace(',', '.');
    if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
    return parseFloat(t);
  };

  EA.reduzMovimento = () => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  };

  // ---------- Tema ----------
  EA.aplicarTema = function () {
    const t = EA.progresso.pref('tema') || 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    return t;
  };

  // Registro das trilhas e etapas (preenchido por trilha1.js e futuras trilhas).
  EA.trilhas = [];
  EA.etapas = {};
  EA.registrarTrilha = function (trilha) {
    EA.trilhas.push(trilha);
    (trilha.etapas || []).forEach((e, i, todas) => {
      e.trilha = trilha.id;
      e.seguinte = todas[i + 1] ? todas[i + 1].id : null;
      EA.etapas[e.id] = e;
    });
  };
})();
