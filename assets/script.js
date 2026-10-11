/* VP Agência · site 2026 */
(() => {
'use strict';

// WhatsApp da agência: trocar aqui se o número mudar
const WA = '555189495637';
const IMG = n => `assets/img/${n}.jpg`;
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const suave = t => 1 - Math.pow(1 - t, 3);
const $ = s => document.querySelector(s);

/* ---------- dados dos cases ---------- */
const CASES = {
  murilo: {
    nome: 'Murilo Filippi',
    cat: 'Cirurgia bucomaxilofacial · Virada de Marca',
    titulo: 'Excelência técnica com marca à altura',
    capa: 'murilo-noturna',
    texto: 'A marca do Murilo precisava mostrar o que os pacientes já encontravam no consultório: excelência técnica e cuidado humano. Fizemos a Virada de Marca completa, do posicionamento à fachada e do feed ao site, com captação de fotos e roteiros dos vídeos.',
    entregas: ['Plataforma de marca', 'Identidade visual', 'Papelaria', 'Site institucional', 'Feed de lançamento', '30 dias de conteúdo', 'Direção de imagem', 'Roteiros de vídeo', 'Campanhas', 'Google Meu Negócio'],
    galeria: ['murilo-fachada', 'murilo-placa', 'murilo-caderneta', 'murilo-caixas', 'murilo-vitrine', 'murilo-pasta', 'murilo-touca', 'murilo-site', 'murilo-scrub', 'murilo-noturna', 'murilo-foto'],
  },
  roberta: {
    nome: 'Roberta Cardoso',
    cat: 'Nutrição · Virada de Marca',
    titulo: 'Uma nutricionista com presença de marca',
    capa: 'roberta-recepcao',
    texto: 'Criamos uma identidade delicada e segura para a Roberta, com monograma próprio e aplicações que vão do consultório à embalagem. A estratégia, o conteúdo e o site saíram da mesma direção.',
    entregas: ['Estratégia de marca', 'Brand book', 'Identidade visual', 'Direção de imagem', 'Campanhas e criativos', '30 dias de conteúdo', 'Bio e destaques', 'Site institucional'],
    galeria: ['roberta-fachada', 'roberta-recepcao', 'roberta-porta', 'roberta-cartoes', 'roberta-sacola', 'roberta-ecobag', 'roberta-garrafa', 'roberta-poltrona'],
    link: ['Ver o site', 'https://nutribetacardoso.com.br'],
  },
  leve: {
    nome: 'Leve no Pote',
    cat: 'Marmitas caseiras · Marca e divulgação',
    titulo: 'Comida de mãe com marca de verdade',
    capa: 'leve-pote',
    texto: 'Marmitas feitas em casa pela Nádia, com tempero de mãe. A marca precisava ser tão acolhedora quanto a comida e clara o bastante para vender no outdoor, na sacola e no WhatsApp.',
    entregas: ['Identidade visual', 'Manual da marca', 'Cardápio semanal', 'Embalagem e cinta', 'Sacola', 'Cartões', 'Outdoor e cartaz', 'Stories'],
    galeria: ['leve-outdoor', 'leve-pote', 'leve-sacola', 'leve-celular', 'leve-cartaz', 'leve-cartoes', 'leve-kit'],
  },
  domafeu: {
    nome: 'Domafeu Sweet',
    cat: 'Confeitaria · Marca e conteúdo',
    titulo: 'Doce com cara de desejo',
    capa: 'domafeu-bolo',
    texto: 'Cucas e docinhos com visual que dá vontade de pedir. Definimos a paleta, o logo tipográfico e o livrinho da marca, e levamos isso para o feed com o produto sempre em primeiro plano.',
    entregas: ['Paleta de cores', 'Logo tipográfico', 'Livrinho da marca', 'Posts do feed'],
    galeria: ['domafeu-capa', 'domafeu-bolo', 'domafeu-pistache', 'domafeu-texturas', 'domafeu-docinhos', 'domafeu-grade', 'domafeu-cuca'],
  },
};

/* ---------- WhatsApp ---------- */
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = `https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ---------- nav ---------- */
const nav = $('#nav');
const navScroll = () => nav.classList.toggle('solida', scrollY > innerHeight * .6);

/* ---------- shader de fundo (WebGL) ---------- */
const FRAG = `precision mediump float;uniform vec2 r;uniform float t;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;for(int k=0;k<5;k++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.5;
float q=fb(p*1.2-t*.035);float v=fb(p+vec2(t*.025,t*.018)+q*1.6);
vec3 c=mix(vec3(0.),vec3(.10,.125,.15),smoothstep(.25,.85,v));
c=mix(c,vec3(.66,.70,.745),smoothstep(.62,1.,v)*.42);
c+=vec3(.82,.875,.925)*pow(smoothstep(.5,1.,v),5.)*.22;
c*=1.-.6*length(uv-vec2(.5,.45));
c+=(h(gl_FragCoord.xy+fract(t))-.5)*.035;
gl_FragColor=vec4(c,1.);}`;

function shader(cv) {
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't');
  let vis = false, t0 = performance.now();
  const tam = () => {
    const k = Math.min(devicePixelRatio, 1.5) * .5;
    cv.width = Math.max(1, cv.clientWidth * k); cv.height = Math.max(1, cv.clientHeight * k);
    gl.viewport(0, 0, cv.width, cv.height);
  };
  const quadro = now => {
    gl.uniform2f(uR, cv.width, cv.height);
    gl.uniform1f(uT, reduz ? 20 : (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (vis && !reduz) requestAnimationFrame(quadro);
  };
  new IntersectionObserver(([e]) => { const era = vis; vis = e.isIntersecting; if (vis && !era) { tam(); requestAnimationFrame(quadro); } }).observe(cv);
  addEventListener('resize', tam);
  tam(); quadro(t0);
}
document.querySelectorAll('[data-shader]').forEach(shader);

/* ---------- 1. hero com rolagem travada ---------- */
const hero = $('#hero'), frame = $('#heroFrame'), l1 = $('#heroL1'), l2 = $('#heroL2'), rodape = $('#heroRodape'), legenda = $('#heroLegenda');
const fotos = [...frame.querySelectorAll('img')];
let fotoI = 0, heroP = 0;
setInterval(() => {
  if (heroP > .06 || reduz) return;
  fotos[fotoI].classList.remove('is-on');
  fotoI = (fotoI + 1) % fotos.length;
  fotos[fotoI].classList.add('is-on');
}, 1700);

function heroScroll() {
  const vw = innerWidth, vh = innerHeight;
  const total = hero.offsetHeight - vh;
  const p = clamp((scrollY - hero.offsetTop) / total);
  heroP = p;
  if (p > .06 && fotoI !== 0) { fotos[fotoI].classList.remove('is-on'); fotoI = 0; fotos[0].classList.add('is-on'); }

  const w0 = vw < 700 ? vw * .56 : Math.min(vw * .24, 380);
  const h0 = Math.min(w0 * 1.28, vh * .42);
  const e = suave(clamp(p / .72));
  const ix = (vw - w0) / 2 * (1 - e), iy = (vh - h0) / 2 * (1 - e);
  frame.style.inset = `${iy}px ${ix}px`;
  frame.style.borderRadius = `${18 * (1 - e)}px`;
  frame.style.setProperty('--sombra', e);
  fotos.forEach(f => f.style.setProperty('--z', 1.14 - .14 * e));

  const s = suave(clamp(p / .5));
  l1.style.transform = `translateX(${-s * 75}vw)`;
  l2.style.transform = `translateX(${s * 75}vw)`;
  l1.style.opacity = l2.style.opacity = 1 - clamp((p - .12) / .35);
  rodape.style.opacity = 1 - clamp(p / .08);
  legenda.classList.toggle('on', p > .8);
}

/* ---------- 2. avatares abrem o case ---------- */
document.querySelectorAll('.avatares [data-case]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); abrirCase(a.dataset.case); }));

/* ---------- 3. roda de trabalhos ---------- */
const PECAS = [
  ['murilo', 'murilo-noturna', 'Placa noturna'], ['murilo', 'murilo-caderneta', 'Caderneta'], ['murilo', 'murilo-site', 'Site institucional'],
  ['roberta', 'roberta-recepcao', 'Recepção'], ['roberta', 'roberta-porta', 'Aviso de porta'], ['roberta', 'roberta-garrafa', 'Garrafa'],
  ['leve', 'leve-outdoor', 'Outdoor'], ['leve', 'leve-pote', 'Cinta do pote'], ['leve', 'leve-celular', 'Stories'],
  ['domafeu', 'domafeu-bolo', 'Post de produto'], ['domafeu', 'domafeu-docinhos', 'Post do feed'], ['domafeu', 'domafeu-cuca', 'Post do feed'],
];
const roda = $('#trabalhos'), anel = $('#rodaAnel');
const N = PECAS.length, PASSO = 360 / N;
$('#rodaT').textContent = String(N).padStart(2, '0');
const itens = PECAS.map(([c, img, peca], i) => {
  const b = document.createElement('button');
  b.className = 'roda-item';
  b.setAttribute('aria-label', `${CASES[c].nome}, ${peca}`);
  b.innerHTML = `<img src="${IMG(img)}" alt="" loading="lazy">`;
  b.addEventListener('click', () => abrirCase(c));
  anel.appendChild(b);
  return b;
});
let rodaAlvo = 0, rodaAtual = 0, rodaAtivo = -1, R = 0, yc = 0;
function rodaMedidas() {
  const vw = innerWidth, vh = innerHeight;
  const cw = vw < 700 ? vw * .44 : clamp(vw * .15, 170, 250);
  roda.style.setProperty('--cw', cw + 'px');
  roda.style.setProperty('--ch', cw * 1.3 + 'px');
  R = vw < 700 ? vw * 1.05 : Math.max(vw * .6, vh * .95);
  yc = vh * (vw < 700 ? .5 : .42) + R;
}
function rodaScroll() {
  const total = roda.offsetHeight - innerHeight;
  rodaAlvo = clamp((scrollY - roda.offsetTop) / total) * (N - 1) * PASSO;
}
function rodaDesenha() {
  rodaAtual += (rodaAlvo - rodaAtual) * (reduz ? 1 : .09);
  itens.forEach((el, i) => {
    const a = (i * PASSO - rodaAtual) * Math.PI / 180;
    el.style.transform = `translate(${R * Math.sin(a)}px, ${yc - R * Math.cos(a)}px) rotate(${a}rad)`;
  });
  const ativo = clamp(Math.round(rodaAtual / PASSO), 0, N - 1);
  if (ativo !== rodaAtivo) {
    rodaAtivo = ativo;
    itens.forEach((el, i) => el.classList.toggle('ativo', i === ativo));
    const [c, , peca] = PECAS[ativo];
    $('#rodaN').textContent = String(ativo + 1).padStart(2, '0');
    $('#rodaPeca').textContent = peca;
    $('#rodaNome').textContent = CASES[c].nome;
    $('#rodaVer').onclick = () => abrirCase(c);
  }
  requestAnimationFrame(rodaDesenha);
}

/* ---------- 4. cases em cards ---------- */
const trilho = $('#casesTrilho');
Object.entries(CASES).forEach(([id, c]) => {
  const b = document.createElement('button');
  b.className = 'card';
  b.innerHTML = `<img src="${IMG(c.capa)}" alt="" loading="lazy">
    <div><p class="card-cat">${c.cat}</p><p class="card-titulo">${c.titulo}</p></div>
    <div class="card-rodape"><span class="card-nome">${c.nome}</span><span class="card-botao" aria-hidden="true">↗</span></div>`;
  b.addEventListener('click', () => { if (!arrastou) abrirCase(id); });
  trilho.appendChild(b);
});
const fim = document.createElement('a');
fim.className = 'card card-final';
fim.dataset.wa = 'Olá, VP! Quero ser o próximo case.';
fim.href = `https://wa.me/${WA}?text=${encodeURIComponent(fim.dataset.wa)}`;
fim.target = '_blank'; fim.rel = 'noopener';
fim.innerHTML = '<p class="card-cat">Próximo case</p><p class="card-titulo">A sua marca<br>pode ser a próxima.</p><span class="card-botao" style="background:#000;color:#F5F1EC">↗</span>';
trilho.appendChild(fim);

const prev = $('#casesPrev'), next = $('#casesNext');
const passoCard = () => trilho.querySelector('.card').offsetWidth + 20;
prev.onclick = () => trilho.scrollBy({ left: -passoCard(), behavior: 'smooth' });
next.onclick = () => trilho.scrollBy({ left: passoCard(), behavior: 'smooth' });
const setas = () => {
  prev.disabled = trilho.scrollLeft < 4;
  next.disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 4;
};
trilho.addEventListener('scroll', setas, { passive: true });
let arrastou = false;
(() => {
  let x0 = 0, s0 = 0, ativo = false;
  trilho.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; ativo = true; arrastou = false; x0 = e.clientX; s0 = trilho.scrollLeft; });
  addEventListener('pointermove', e => {
    if (!ativo) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 5) { arrastou = true; trilho.classList.add('arrastando'); }
    trilho.scrollLeft = s0 - dx;
  });
  addEventListener('pointerup', () => { if (!ativo) return; ativo = false; trilho.classList.remove('arrastando'); setTimeout(() => arrastou = false, 0); });
  trilho.addEventListener('dragstart', e => e.preventDefault());
})();

/* ---------- case aberto ---------- */
const dlg = $('#caseDialog');
function abrirCase(id) {
  const c = CASES[id];
  $('#caseCategoria').textContent = c.cat;
  $('#caseTitulo').textContent = c.nome;
  $('#caseTexto').textContent = c.texto;
  $('#caseEntregas').innerHTML = c.entregas.map(x => `<span>${x}</span>`).join('');
  const zap = `https://wa.me/${WA}?text=${encodeURIComponent(`Olá, VP! Vi o case ${c.nome} no site e quero algo assim para a minha marca.`)}`;
  $('#caseAcoes').innerHTML = `<a class="btn btn-claro" href="${zap}" target="_blank" rel="noopener">Quero um projeto assim</a>` +
    (c.link ? `<a class="btn btn-linha" href="${c.link[1]}" target="_blank" rel="noopener">${c.link[0]}</a>` : '');
  $('#caseGaleria').innerHTML = c.galeria.map(g => `<img src="${IMG(g)}" alt="${c.nome}" loading="lazy">`).join('');
  dlg.showModal();
  dlg.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}
$('#caseFechar').onclick = () => dlg.close();
dlg.addEventListener('close', () => document.body.style.overflow = '');
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* ---------- 5. carrossel 3D ---------- */
const FACES = ['murilo-placa', 'roberta-ecobag', 'leve-sacola', 'murilo-caixas', 'roberta-poltrona', 'leve-cartaz', 'murilo-touca',
  'roberta-sacola', 'leve-kit', 'murilo-vitrine', 'roberta-garrafa', 'leve-cartoes', 'murilo-caderneta', 'domafeu-pistache'];
const palco = $('#mundoPalco'), mAnel = $('#mundoAnel');
FACES.forEach(f => {
  const d = document.createElement('div');
  d.className = 'mundo-face';
  d.innerHTML = `<img src="${IMG(f)}" alt="" loading="lazy" draggable="false">`;
  mAnel.appendChild(d);
});
const faces = [...mAnel.children];
let giro = 0, vel = reduz ? 0 : -.08, raio = 0, mundoVis = false;
function mundoMedidas() {
  const fw = innerWidth < 700 ? 170 : clamp(innerWidth * .19, 200, 300);
  mAnel.style.setProperty('--fw', fw + 'px');
  mAnel.style.setProperty('--fh', fw * 1.3 + 'px');
  raio = fw / 2 / Math.tan(Math.PI / faces.length) + 16;
  faces.forEach((f, i) => f.style.transform = `rotateY(${i * 360 / faces.length}deg) translateZ(${raio}px)`);
}
(() => {
  let x0 = 0, g0 = 0, ativo = false, ult = 0;
  palco.addEventListener('pointerdown', e => { ativo = true; x0 = e.clientX; g0 = giro; ult = e.clientX; palco.classList.add('arrastando'); palco.setPointerCapture(e.pointerId); });
  palco.addEventListener('pointermove', e => { if (!ativo) return; giro = g0 + (e.clientX - x0) * .25; vel = (e.clientX - ult) * .25; ult = e.clientX; });
  const solta = () => { if (!ativo) return; ativo = false; palco.classList.remove('arrastando'); };
  palco.addEventListener('pointerup', solta);
  palco.addEventListener('pointercancel', solta);
  const gira = () => {
    if (!ativo) { vel += ((reduz ? 0 : -.08) - vel) * .03; giro += vel; }
    mAnel.style.transform = `translateZ(${-raio}px) rotateX(-6deg) rotateY(${giro}deg)`;
    if (mundoVis) requestAnimationFrame(gira);
  };
  new IntersectionObserver(([e]) => { const era = mundoVis; mundoVis = e.isIntersecting; if (mundoVis && !era) requestAnimationFrame(gira); }).observe(palco);
})();

/* ---------- 6. serviços com prévia ---------- */
const prevImg = $('#servicosPreview');
if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('#servicosLista li').forEach(li => {
    li.addEventListener('mouseenter', () => { prevImg.src = li.dataset.img; prevImg.classList.add('on'); });
    li.addEventListener('mouseleave', () => prevImg.classList.remove('on'));
  });
  let px = 0, py = 0, cx = 0, cy = 0;
  addEventListener('mousemove', e => { px = e.clientX + 170; py = e.clientY; });
  (function segue() {
    cx += (px - cx) * .15; cy += (py - cy) * .15;
    prevImg.style.left = cx + 'px'; prevImg.style.top = cy + 'px';
    requestAnimationFrame(segue);
  })();
}

/* ---------- laço de rolagem ---------- */
const aoRolar = () => { navScroll(); heroScroll(); rodaScroll(); };
const aoMedir = () => { rodaMedidas(); mundoMedidas(); aoRolar(); setas(); };
addEventListener('scroll', aoRolar, { passive: true });
addEventListener('resize', aoMedir);
const yTeste = new URLSearchParams(location.search).get('y');
if (yTeste) { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, +yTeste * innerHeight); }
aoMedir();
rodaAtual = rodaAlvo;
requestAnimationFrame(rodaDesenha);
})();
