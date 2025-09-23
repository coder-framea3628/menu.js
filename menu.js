// ===== Injetar Link de Fontes =====
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// ===== Injetar CSS =====
const style = document.createElement('style');
style.textContent = `
body{margin:0;font-family:'Montserrat',sans-serif;background:#f8f8f8;height:200vh;overflow-x:hidden}
#navMenu{position:fixed;top:-100px;left:50%;transform:translateX(-50%);width:96%;max-width:1200px;background:linear-gradient(135deg,rgba(32,32,32,0.95),rgba(50,50,50,0.95));backdrop-filter:blur(12px);border-radius:0 0 25px 25px;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 32px rgba(0,0,0,0.4);transition:all .5s cubic-bezier(0.25,0.46,0.45,0.94);z-index:9999;border:1px solid rgba(255,255,255,0.1)}
#navMenu.active{top:0}
.icon-wrapper{position:relative;display:flex;align-items:center;gap:22px}
#navMenu svg,#navMenu img{width:28px;height:28px;cursor:pointer;transition:all .3s cubic-bezier(0.25,0.46,0.45,0.94)}
#navMenu svg:hover,#navMenu img:hover{transform:scale(1.08) rotate(5deg);filter:drop-shadow(0 2px 4px rgba(142,110,74,0.3))}
.close-menu{position:absolute;top:10px;right:10px;width:24px;height:24px;cursor:pointer;z-index:10000;display:none;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.1);transition:all .3s}
.close-menu.active{display:flex}
.close-menu:hover{background:rgba(255,255,255,0.2)}
.notif-dot{position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#8E6E4A,#D5BEA3);color:#fff;font-size:11px;width:18px;height:18px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:600;box-shadow:0 2px 8px rgba(142,110,74,0.4);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(142,110,74,0.7)}70%{box-shadow:0 0 0 10px rgba(142,110,74,0)}100%{box-shadow:0 0 0 0 rgba(142,110,74,0)}}
@keyframes shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}
.shake{animation:shake .7s ease-in-out}
.overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:10000}
.popup{background:linear-gradient(135deg,rgba(32,32,32,0.98),rgba(50,50,50,0.98));color:#fff;width:90%;max-width:450px;min-width:320px;border-radius:24px;padding:24px;box-shadow:0 12px 48px rgba(0,0,0,0.5);display:flex;flex-direction:column;gap:16px;transform:translateY(50px);opacity:0;transition:all .4s cubic-bezier(0.25,0.46,0.45,0.94);border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden}
.popup::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)}
.popup.active{transform:translateY(0);opacity:1}
.close-popup{position:absolute;top:16px;right:16px;width:24px;height:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.1);transition:all .3s;font-size:18px;font-weight:600;color:#fff}
.close-popup:hover{background:rgba(255,255,255,0.2);transform:rotate(90deg)}
.popup h2{margin:0 0 12px;font-weight:600;font-size:20px;text-align:center;letter-spacing:0.5px}
.notif-item{display:flex;flex-direction:column;gap:12px;padding:16px;background:rgba(255,255,255,0.05);border-radius:16px;border:1px solid rgba(255,255,255,0.1);transition:all .3s}
.notif-item:hover{background:rgba(255,255,255,0.08)}
.notif-item p{font-size:14px;font-weight:500;color:#ddd;line-height:1.5;margin:0}
.notif-item button{background:linear-gradient(135deg,#8E6E4A,#D5BEA3);border:none;border-radius:20px;padding:10px 20px;color:#fff;font-size:14px;cursor:pointer;font-weight:600;transition:all .3s;width:100%;box-shadow:0 4px 12px rgba(142,110,74,0.3)}
.notif-item button:hover{opacity:0.9;transform:translateY(-1px);box-shadow:0 6px 16px rgba(142,110,74,0.4)}
.popup-footer{font-size:12px;color:#aaa;text-align:center;margin-top:8px;letter-spacing:0.3px}
.toast{position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#8E6E4A,#D5BEA3);color:#fff;padding:12px 20px;border-radius:20px;box-shadow:0 8px 24px rgba(142,110,74,0.4);transform:translateX(400px);opacity:0;transition:all .4s cubic-bezier(0.25,0.46,0.45,0.94);z-index:10001;font-size:14px;font-weight:500;min-width:200px;text-align:center}
.toast.active{transform:translateX(0);opacity:1}
.toast.exit{transform:translateX(400px);opacity:0}
.scroll-top{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:linear-gradient(135deg,#8E6E4A,#D5BEA3);border-radius:50%;display:none;align-items:center;justify-content:center;cursor:pointer;transition:all .3s cubic-bezier(0.25,0.46,0.45,0.94);box-shadow:0 8px 24px rgba(142,110,74,0.4);z-index:9998}
.scroll-top.active{display:flex}
.scroll-top:hover{transform:scale(1.1);box-shadow:0 12px 32px rgba(142,110,74,0.5)}
.scroll-top svg{width:20px;height:20px;fill:#fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))}
@media (max-width:768px){.popup{width:95%;padding:20px;min-width:auto}.notif-item{padding:12px}.navMenu{padding:10px 20px;width:98%}.icon-wrapper{gap:16px}.scroll-top{bottom:20px;right:20px;width:45px;height:45px}.scroll-top svg{width:18px;height:18px}}
.filled{fill:#8E6E4A}
body{font-family:Montserrat,sans-serif;margin:0}
.c{position:fixed;bottom:10px;right:10px;width:360px;max-width:95%;height:80%;background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.3);display:flex;flex-direction:column;overflow:hidden;z-index:9999}
.h{background:#AC865C;color:#fff;padding:12px;display:flex;align-items:center;gap:8px;font-weight:600;font-size:16px;position:relative}
.h img{width:54px;height:54px;border-radius:50%;border:2px solid #fff}
.m{position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:22px;line-height:1}
.menu-icon{display:flex;flex-direction:column;gap:3px;cursor:pointer}
.menu-icon span{width:18px;height:2px;background:#fff;display:block;border-radius:2px}
.b{flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;font-size:14px}
.l{font-family:Inter,sans-serif;font-size:11px;color:#888;text-align:center}
.msg{display:flex;gap:6px;animation:f .3s}
.msg img{width:26px;height:26px;border-radius:50%}
.msg.user-msg{justify-content:flex-end}
.bb{background:#f0f0f0;padding:8px 12px;border-radius:14px;max-width:80%}
.bt{font-size:10px;color:#999;margin-top:4px;display:block}
.user-msg .bb{background:#AC865C;color:#fff}
.btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}
.btn{padding:8px 12px;border-radius:18px;cursor:pointer;font-size:13px;border:2px solid #AC865C;background:#fff;color:#AC865C;transition:background-color 0.3s ease,color 0.3s ease}
.btn:hover{background:#AC865C;color:#fff}
.p{background:#AC865C;color:#fff;font-weight:600}
.f{font-size:11px;padding:6px;border-top:1px solid #ddd;text-align:center;line-height:14px;margin-bottom:8px}
.f a,.link{color:#AC865C;font-weight:600;text-decoration:underline;text-decoration-thickness:1px}
.o{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;z-index:10000;animation:fadein .3s}
.oc{background:#fff;padding:24px;border-radius:10px;text-align:center;display:flex;flex-direction:column;gap:14px;min-width:240px;position:relative;top:50px}
.oc button{padding:10px 16px;background:#AC865C;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600}
.close-x{position:absolute;top:8px;right:8px;font-size:20px;cursor:pointer;color:#555}
.input-box{display:flex;align-items:center;gap:8px;margin:4px 8px 6px;padding:8px 12px;background:#AC865C;border-radius:20px}
.input-box input{border:none;outline:none;flex:1;background:none;color:#fff;font-size:17px}
.input-box input::placeholder{color:#fff;opacity:0.7}
.send-btn{border:2px solid #fff;background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;outline:none;padding:0;transition:background-color 0.3s ease}
.send-btn:hover{background-color:rgba(255,255,255,0.1)}
.send-btn svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:1.8}
.send-btn path{stroke-linecap:round;stroke-linejoin:round}
.send-btn:focus-visible{box-shadow:0 0 0 2px rgba(255,255,255,.6)}
.center-end{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:11px;color:#888;animation:fadein .5s}
.semibold{font-weight:600}
@keyframes f{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadein{from{opacity:0}to{opacity:1}}
@media(max-width:480px){.c{height:90%;width:95%;right:2.5%;bottom:5%}}
`;
document.head.appendChild(style);

// ===== Injetar HTML =====
const navHTML = `
<div id="navMenu">
  <div class="close-menu" id="closeMenu">&times;</div>
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
  </div>
</div>
<div class="overlay" id="notifOverlay">
  <div class="popup" id="notifPopup">
    <button class="close-popup" id="closePopup">&times;</button>
    <h2>Notificações</h2>
    <div class="notif-item">
      <p>Desbloqueie todas as funcionalidades e veja o catálogo completo agora no Frame Premium.</p>
      <button onclick=""window.open('https://frameag.com/premium','_blank')">Quero ser Premium</button>
    </div>
    <div class="notif-item">
      <p>Temos vídeos quentinhos para você! 🔥</p>
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
<div id="chatContainer" class="c" style="display:none;">
  <div class="h">
    <img src="https://framerusercontent.com/images/uvgx4LpdArstEFjK7yhfEcgIEo.png" alt="AI Assistant">
    <span>Atendimento | Frame</span>
    <div class="m" onclick="closeChat()">&times;</div>
  </div>
  <div class="b" id="chatBody">
    <div class="center-end">Boas-vindas ao atendimento virtual da Frame! Como posso ajudar?</div>
  </div>
  <div class="f">
    <span>Envie um e-mail para: contato@frameag.com</span>
  </div>
  <div class="input-box">
    <input type="text" id="chatInput" placeholder="Digite sua mensagem..." onkeypress="handleKeyPress(event)">
    <button class="send-btn" onclick="sendMessage()">
      <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
    </button>
  </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', navHTML);

// ===== Lógica Principal (Nav e Notificações) =====
document.addEventListener('DOMContentLoaded', () => {
  // Elements
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
  const chatContainer = document.getElementById("chatContainer");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");

  // State
  let filled = false;
  let toastTimeout = null;

  // Helpers
  function getTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function showToast(msg, duration = 2500) {
    if (!toastEl) return;
    toastEl.innerText = msg;
    toastEl.classList.remove('exit');
    toastEl.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.add('exit');
      // remove classes after exit animation
      setTimeout(() => {
        toastEl.classList.remove('active', 'exit');
      }, 450);
    }, duration);
  }

  // Expose handleRedirect globally (used by inline onclick in injected HTML)
  window.handleRedirect = function (url, question) {
    try {
      // If we want a nicer UI we could replace confirm with custom modal; keep simple for now
      const ok = confirm(question || 'Continuar?');
      if (ok) window.location.href = url;
    } catch (e) {
      window.location.href = url;
    }
  };

  // Notificações: abrir / fechar
  notifIcon?.addEventListener('click', () => {
    if (!overlay || !popup) return;
    overlay.style.display = 'flex';
    // small delay to allow CSS transitions if needed
    setTimeout(() => popup.classList.add('active'), 10);
    timeEl && (timeEl.textContent = `Atualizado hoje — ${getTime()}`);
  });

  function closeNotif() {
    if (!overlay || !popup) return;
    popup.classList.remove('active');
    // wait transition then hide overlay
    setTimeout(() => overlay.style.display = 'none', 250);
  }

  closePopup?.addEventListener('click', closeNotif);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeNotif();
  });

  // Fav icon toggle (add/remove .filled class)
  favIcon?.addEventListener('click', () => {
    filled = !filled;
    if (filled) {
      favIcon.classList.add('filled');
      showToast('Adicionada as suas favoritas');
    } else {
      favIcon.classList.remove('filled');
      showToast('Removida das favoritas');
    }
  });

  // Scroll behaviour: show/hide nav & scrollTop
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    // show nav menu when user scrolls a bit
    if (y > 20) {
      navMenu && navMenu.classList.add('active');
    } else {
      navMenu && navMenu.classList.remove('active');
    }

    // show scroll-to-top after some distance
    if (y > 300) {
      scrollTop && scrollTop.classList.add('active');
    } else {
      scrollTop && scrollTop.classList.remove('active');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // init once
  onScroll();

  // Scroll-to-top click
  scrollTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Chat open/close/send
  chatIcon?.addEventListener('click', () => {
    chatContainer.style.display = 'flex';
    setTimeout(() => chatInput && chatInput.focus(), 80);
  });

  window.closeChat = function () {
    chatContainer.style.display = 'none';
  };

  // escape-html helper for chat messages
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })[s];
    });
  }

  window.sendMessage = function () {
    const text = chatInput.value?.trim();
    if (!text) return;
    // user message
    const userWrap = document.createElement('div');
    userWrap.className = 'msg user-msg';
    userWrap.innerHTML = `<div class="bb">${escapeHtml(text)}</div>`;
    chatBody.appendChild(userWrap);
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // mock bot reply after a short delay
    setTimeout(() => {
      const botWrap = document.createElement('div');
      botWrap.className = 'msg';
      botWrap.innerHTML = `<img src="https://via.placeholder.com/26?text=IA" alt="bot"><div class="bb">Olá! Envie uma e-mail para: contato@frameag.com e tenha suporte 24h :) Respondendo: "${escapeHtml(text)}"</div>`;
      chatBody.appendChild(botWrap);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 700);
  };

  // handle enter key in chat
  window.handleKeyPress = function (e) {
    if (!e) return;
    // support Enter (without shift) to send
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Accessibility: close overlays with Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // close notifications
      closeNotif();
      // close chat
      if (chatContainer && chatContainer.style.display !== 'none') closeChat();
    }
  });

  // Small UX: update notif time every minute while overlay open
  let notifInterval = null;
  overlay?.addEventListener('transitionstart', () => {
    if (notifInterval) clearInterval(notifInterval);
    notifInterval = setInterval(() => {
      if (overlay.style.display === 'flex') timeEl && (timeEl.textContent = `Atualizado hoje — ${getTime()}`);
    }, 60000);
  });
  overlay?.addEventListener('transitionend', () => {
    if (overlay.style.display !== 'flex' && notifInterval) {
      clearInterval(notifInterval);
      notifInterval = null;
    }
  });

  // initial footer time
  timeEl && (timeEl.textContent = `Frame News | Hoje — ${getTime()}`);
});