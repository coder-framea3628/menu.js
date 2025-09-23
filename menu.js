// ===== Injetar Link de Fontes =====
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// ===== Injetar CSS =====
const style = document.createElement('style');
style.textContent = `
body{margin:0;font-family:'Montserrat',sans-serif;background:#f8f8f8;height:200vh;overflow-x:hidden}
#navMenu{position:fixed;top:-100px;left:50%;transform:translateX(-50%);width:98%;max-width:1350px;background:linear-gradient(135deg,rgba(32,32,32,0.9),rgba(50,50,50,0.9));backdrop-filter:blur(12px);border-radius:0 0 25px 25px;padding:14px 32px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 32px rgba(0,0,0,0.4);transition:all .5s cubic-bezier(0.25,0.46,0.45,0.94);z-index:9999;border:1px solid rgba(255,255,255,0.1)}
#navMenu.active{top:0}
.icon-wrapper{position:relative;display:flex;align-items:center;gap:22px}
#navMenu svg,#navMenu img{width:28px;height:28px;cursor:pointer;transition:all .3s cubic-bezier(0.25,0.46,0.45,0.94)}
#navMenu svg:hover,#navMenu img:hover{transform:scale(1.08) rotate(5deg);filter:drop-shadow(0 2px 4px rgba(142,110,74,0.3))}
.close-menu{position:absolute;top:10px;right:10px;width:24px;height:24px;cursor:pointer;z-index:10000;display:none;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.1);transition:all .3s}
.close-menu.active{display:flex}
.close-menu:hover{background:rgba(255,255,255,0.2)}
.arrow-close{margin-left:10px;cursor:pointer;fill:#fff;width:22px;height:22px;transition:transform .3s}
.arrow-close:hover{transform:translateY(-2px)}
.notif-dot{position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#8E6E4A,#D5BEA3);color:#fff;font-size:11px;width:18px;height:18px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:600;box-shadow:0 2px 8px rgba(142,110,74,0.4);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(142,110,74,0.7)}70%{box-shadow:0 0 0 10px rgba(142,110,74,0)}100%{box-shadow:0 0 0 0 rgba(142,110,74,0)}}
.scroll-top{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:linear-gradient(135deg,#8E6E4A,#D5BEA3);border-radius:50%;display:none;align-items:center;justify-content:center;cursor:pointer;transition:all .3s cubic-bezier(0.25,0.46,0.45,0.94);box-shadow:0 8px 24px rgba(142,110,74,0.4);z-index:9998}
.scroll-top.active{display:flex}
.scroll-top:hover{transform:scale(1.1);box-shadow:0 12px 32px rgba(142,110,74,0.5)}
.scroll-top svg{width:20px;height:20px;fill:#fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))}
`;
document.head.appendChild(style);

// ===== Injetar HTML =====
const navHTML = `
<div id="navMenu">
  <div class="icon-wrapper">
    <div style="position:relative">
      <img id="notifIcon" src="https://framerusercontent.com/images/Yr7purGR3rArCX8H8FMYR7b40.png" alt="Notificações">
      <div class="notif-dot">2</div>
    </div>
    <svg id="favIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    <svg id="chatIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg id="loginIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
    <svg id="closeArrow" class="arrow-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 8l-6 6h12z"/>
    </svg>
  </div>
</div>
<div class="overlay" id="notifOverlay">
  <div class="popup" id="notifPopup">
    <button class="close-popup" id="closePopup">&times;</button>
    <h2>Notificações</h2>
    <div class="notif-item">
      <p>Desbloqueie todas as funcionalidades e veja o catálogo completo agora.</p>
      <button onclick="window.open('https://frameag.com/premium','_blank')">Quero ser Premium</button>
    </div>
    <div class="notif-item">
      <p>Temos vídeos quentes para você! 🔥 Descubra modelos.</p>
      <button onclick="window.open('https://frameag.com/models','_blank')">Ver catálogo de modelos</button>
    </div>
    <div class="popup-footer" id="notifTime">Frame News | Hoje</div>
  </div>
</div>
<div class="toast" id="toast"></div>
<div class="scroll-top" id="scrollTop" title="Ir para o topo" aria-label="Ir para o topo">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 5l7 7 -1.41 1.41L12 7.83l-5.59 5.58L5 12z"/>
  </svg>
</div>
`;
document.body.insertAdjacentHTML('beforeend', navHTML);

// ===== Lógica Principal =====
document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById("navMenu");
  const notifIcon = document.getElementById("notifIcon");
  const overlay = document.getElementById("notifOverlay");
  const popup = document.getElementById("notifPopup");
  const closePopup = document.getElementById("closePopup");
  const timeEl = document.getElementById("notifTime");
  const toastEl = document.getElementById("toast");
  const scrollTop = document.getElementById("scrollTop");
  const favIcon = document.getElementById("favIcon");
  const chatIcon = document.getElementById("chatIcon");
  const loginIcon = document.getElementById("loginIcon");
  const closeArrow = document.getElementById("closeArrow");

  // Fav icon toggle
  favIcon?.addEventListener('click', () => {
    favIcon.classList.toggle('filled');
  });

  // Scroll behaviour
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (y > 20) navMenu?.classList.add('active'); else navMenu?.classList.remove('active');
    if (y > 300) scrollTop?.classList.add('active'); else scrollTop?.classList.remove('active');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll top
  scrollTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Chat redirect
  chatIcon?.addEventListener('click', () => {
    window.open('https://frameag.com/chat','_blank');
  });

  // Login redirect
  loginIcon?.addEventListener('click', () => {
    window.open('https://frameag.com/login','_blank');
  });

  // Notificações
  notifIcon?.addEventListener('click', () => {
    overlay.style.display = 'flex';
    setTimeout(() => popup.classList.add('active'), 10);
    timeEl.textContent = `Atualizado hoje — ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
  });
  closePopup?.addEventListener('click', () => {
    popup.classList.remove('active');
    setTimeout(() => overlay.style.display = 'none', 250);
  });

  // Fechar menu com a setinha
  closeArrow?.addEventListener('click', () => {
    navMenu?.classList.remove('active');
  });
});