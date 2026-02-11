/**
 * Frame Widget 3.0 Elite - High Performance, Context-Aware & Robust
 * Architecture: State-Driven UI with Event Delegation
 */
(function () {
    'use strict';

    // =========================================================================
    // 1. STATE & CONFIGURATION (Single Source of Truth)
    // =========================================================================
    const CONFIG = {
        api: {
            geo: 'https://ipapi.co/json/' // Free tier IP geo API
        },
        assets: {
            logo: 'https://framerusercontent.com/images/JaIvmSW2LTbs0XCR7tnpcmU8xA.png',
            font: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
        },
        chatRotations: [
            { label: 'Atendimento', url: 'https://www.frameag.com/contato', icon: 'chat' },
            { label: 'Frame Hotels', url: 'https://www.frameag.com/hotels', icon: 'hotel' },
            { label: 'Verificação Facial', url: 'https://frameag.com/verificacao', icon: 'face' }
        ]
    };

    // Estado Reativo
    const store = {
        user: JSON.parse(localStorage.getItem('fr_user')) || null, // { name, handle, avatar, premium }
        location: sessionStorage.getItem('fr_location') ? JSON.parse(sessionStorage.getItem('fr_location')) : null,
        theme: localStorage.getItem('fr_theme') || 'dark', // Force dark header visual, but content adapts
        favorites: localStorage.getItem('fr_fav') === 'true',
        isNight: new Date().getHours() >= 18 || new Date().getHours() < 6,
        chatIndex: Math.floor(Math.random() * CONFIG.chatRotations.length), // Random start
        usage: JSON.parse(localStorage.getItem('fr_usage')) || { chatClicks: 0, markReadCount: 0 }
    };

    // Helpers de Persistência
    const saveState = (key, val) => {
        if(key === 'user') localStorage.setItem('fr_user', JSON.stringify(val));
        if(key === 'favorites') localStorage.setItem('fr_fav', val);
        if(key === 'usage') localStorage.setItem('fr_usage', JSON.stringify(val));
    };

    // =========================================================================
    // 2. CSS ENGINE (Modern, Scoped & Optimized)
    // =========================================================================
    const injectStyles = () => {
        const css = `
        :root {
            --fr-font: 'Montserrat', sans-serif;
            --fr-z-max: 2147483647;
            /* Cores Fixas (Header Dark) */
            --fr-header-bg: rgba(20, 20, 20, 0.85);
            --fr-header-border: rgba(255, 255, 255, 0.1);
            --fr-header-text: #ffffff;
            
            /* UI Geral */
            --fr-accent: #8E6E4A;
            --fr-accent-light: #A88B6A;
            --fr-accent-grad: linear-gradient(135deg, #8E6E4A 0%, #6D5235 100%);
            --fr-bg-popup: #ffffff;
            --fr-text-main: #202020;
            --fr-text-sec: #666666;
            --fr-border: #e0e0e0;
            --fr-shadow: 0 10px 40px rgba(0,0,0,0.15);
            
            /* Toasts */
            --fr-success: #2ecc71;
            --fr-info: #3498db;
            --fr-error: #e74c3c;
        }

        /* Dark Mode Support para o corpo dos popups */
        @media (prefers-color-scheme: dark) {
            :root {
                --fr-bg-popup: #1a1a1a;
                --fr-text-main: #f0f0f0;
                --fr-text-sec: #aaaaaa;
                --fr-border: #333333;
                --fr-shadow: 0 10px 40px rgba(0,0,0,0.4);
            }
        }

        .fr-widget * { box-sizing: border-box; font-family: var(--fr-font); -webkit-font-smoothing: antialiased; outline: none; }
        .fr-hidden { display: none !important; }

        /* ---------------- HEADER ---------------- */
        #fr-nav {
            position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
            width: 95%; max-width: 1200px;
            background: var(--fr-header-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--fr-header-border); border-top: none;
            border-radius: 0 0 24px 24px;
            padding: 12px 24px;
            display: flex; align-items: center; justify-content: space-between;
            z-index: var(--fr-z-max);
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transition: top 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #fr-nav.active { top: 0; }
        
        .fr-logo { height: 24px; width: auto; display: block; filter: brightness(0) invert(1); }
        
        .fr-actions { display: flex; gap: 20px; align-items: center; }
        
        .fr-btn {
            background: none; border: none; padding: 0; cursor: pointer;
            width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
            position: relative; color: var(--fr-header-text);
            transition: transform 0.2s, color 0.2s;
        }
        .fr-btn:hover { transform: scale(1.1); color: var(--fr-accent); }
        .fr-btn svg { width: 22px; height: 22px; stroke-width: 2; }
        
        /* Notif Badge */
        .fr-badge {
            position: absolute; top: 0; right: 0;
            width: 10px; height: 10px; background: var(--fr-error);
            border-radius: 50%; border: 2px solid var(--fr-header-bg);
            opacity: 0; transform: scale(0); transition: 0.3s;
        }
        .fr-badge.has-new { opacity: 1; transform: scale(1); }

        /* ---------------- SCROLL TOP ---------------- */
        #fr-scroll-top {
            position: fixed; bottom: 30px; right: 30px;
            width: 48px; height: 48px;
            background: var(--fr-accent-grad);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 8px 20px rgba(142, 110, 74, 0.4);
            cursor: pointer; z-index: calc(var(--fr-z-max) - 1);
            opacity: 0; transform: translateY(20px); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #fr-scroll-top.visible { opacity: 1; transform: translateY(0); }
        #fr-scroll-top:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(142, 110, 74, 0.6); }
        #fr-scroll-top svg { width: 24px; height: 24px; stroke: #fff; fill: none; stroke-width: 2.5; }

        /* ---------------- MODAL / OVERLAY ---------------- */
        .fr-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            z-index: var(--fr-z-max); display: flex; justify-content: flex-end; align-items: flex-start;
            padding: 80px 20px; opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .fr-overlay.open { opacity: 1; pointer-events: auto; }
        
        /* General Popup Style */
        .fr-popup {
            background: var(--fr-bg-popup); width: 100%; max-width: 380px;
            border-radius: 20px; box-shadow: var(--fr-shadow);
            border: 1px solid var(--fr-border);
            display: flex; flex-direction: column; overflow: hidden;
            transform: translateY(-20px) scale(0.95); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 80vh;
        }
        .fr-overlay.open .fr-popup { transform: translateY(0) scale(1); }
        
        .fr-popup-header {
            padding: 20px; border-bottom: 1px solid var(--fr-border);
            display: flex; justify-content: space-between; align-items: center;
        }
        .fr-popup-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: var(--fr-text-main); }
        .fr-close-x { background: none; border: none; font-size: 24px; color: var(--fr-text-sec); cursor: pointer; line-height: 1; }
        .fr-close-x:hover { color: var(--fr-error); }

        .fr-popup-body { padding: 0; overflow-y: auto; }

        /* ---------------- NOTIFICATIONS ---------------- */
        .fr-loc-header {
            background: linear-gradient(90deg, #f3f3f3, var(--fr-bg-popup));
            padding: 10px 20px; font-size: 12px; color: var(--fr-text-sec);
            display: flex; align-items: center; gap: 6px; font-weight: 600;
        }
        @media (prefers-color-scheme: dark) { .fr-loc-header { background: linear-gradient(90deg, #252525, var(--fr-bg-popup)); } }
        
        .fr-notif-item {
            padding: 20px; border-bottom: 1px solid var(--fr-border);
            transition: background 0.2s;
        }
        .fr-notif-item:last-child { border-bottom: none; }
        .fr-notif-item:hover { background: rgba(142, 110, 74, 0.05); }
        .fr-notif-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--fr-text-main); }
        .fr-notif-desc { font-size: 13px; color: var(--fr-text-sec); margin-bottom: 12px; line-height: 1.4; }
        .fr-cta-sm {
            display: inline-block; font-size: 12px; font-weight: 700; color: var(--fr-accent);
            text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* ---------------- LOGIN & USER FLOW ---------------- */
        .fr-auth-view { padding: 30px 20px; text-align: center; }
        .fr-btn-block {
            width: 100%; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 14px;
            cursor: pointer; margin-bottom: 12px; transition: 0.2s; display: block; text-decoration: none;
        }
        .fr-btn-primary { background: var(--fr-accent); color: #fff; border: none; }
        .fr-btn-primary:hover { background: var(--fr-accent-light); }
        .fr-btn-outline { background: transparent; color: var(--fr-text-main); border: 2px solid var(--fr-border); }
        .fr-btn-outline:hover { border-color: var(--fr-accent); color: var(--fr-accent); }
        
        .fr-input {
            width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 8px;
            border: 1px solid var(--fr-border); background: rgba(127,127,127,0.05); color: var(--fr-text-main);
        }
        .fr-user-card { text-align: center; padding: 20px; }
        .fr-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 3px solid var(--fr-accent); }
        .fr-user-name { font-size: 18px; font-weight: 700; color: var(--fr-text-main); margin: 0; }
        .fr-user-handle { font-size: 14px; color: var(--fr-text-sec); margin: 0 0 20px 0; }
        
        /* Premium Shine */
        .fr-premium-btn {
            position: relative; overflow: hidden;
            background: #222; color: #ffd700; 
        }
        .fr-premium-btn::after {
            content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
            transform: skewX(-25deg); animation: fr-shine 3s infinite;
        }
        @keyframes fr-shine { 100% { left: 200%; } }

        /* ---------------- TOASTS PRO ---------------- */
        .fr-toast-container {
            position: fixed; top: 20px; right: 20px; z-index: calc(var(--fr-z-max) + 1);
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        }
        .fr-toast {
            pointer-events: auto; background: var(--fr-bg-popup); color: var(--fr-text-main);
            padding: 16px 20px; border-radius: 12px; min-width: 300px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex; align-items: center; gap: 12px;
            transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 4px solid var(--fr-text-sec); touch-action: pan-y;
        }
        .fr-toast.visible { transform: translateX(0); }
        .fr-toast.success { border-color: var(--fr-success); }
        .fr-toast.info { border-color: var(--fr-info); }
        .fr-toast.error { border-color: var(--fr-error); }
        
        /* ---------------- MOBILE ---------------- */
        @media (max-width: 768px) {
            #fr-nav { width: 100%; border-radius: 0; top: -100px; padding: 10px 16px; }
            .fr-overlay { align-items: flex-end; padding: 0; }
            .fr-popup { border-radius: 24px 24px 0 0; max-width: 100%; animation: slideUp 0.3s; }
            @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .fr-toast { min-width: auto; width: 90vw; margin: 0 auto; }
        }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        const fontLink = document.createElement('link');
        fontLink.href = CONFIG.assets.font;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    };

    // =========================================================================
    // 3. LOGIC CONTROLLERS
    // =========================================================================

    // --- Geolocation Service ---
    const GeoService = {
        async init() {
            if (store.location) return;
            try {
                const res = await fetch(CONFIG.api.geo);
                if (!res.ok) throw new Error('Geo fail');
                const data = await res.json();
                store.location = { city: data.city, region: data.region_code };
                sessionStorage.setItem('fr_location', JSON.stringify(store.location));
                
                // Show mini popup on scroll if location found
                window.addEventListener('scroll', GeoService.checkScrollTrigger);
            } catch (e) {
                store.location = { city: 'Sua região', region: '' };
            }
        },
        checkScrollTrigger: () => {
            if (window.scrollY > 800) {
                Toaster.show(`Encontre modelos perto de ${store.location.city}`, 'info');
                window.removeEventListener('scroll', GeoService.checkScrollTrigger);
            }
        }
    };

    // --- Toast Engine (Swipeable & Queued) ---
    const Toaster = {
        queue: [],
        container: null,
        
        init() {
            this.container = document.createElement('div');
            this.container.className = 'fr-toast-container';
            document.body.appendChild(this.container);
        },

        show(msg, type = 'info') {
            // Anti-spam check
            if (document.querySelector(`.fr-toast[data-msg="${msg}"]`)) return;

            const toast = document.createElement('div');
            toast.className = `fr-toast ${type}`;
            toast.dataset.msg = msg;
            toast.innerHTML = `
                <div style="flex:1; font-size:14px; font-weight:600;">${msg}</div>
                <div style="font-size:18px; color:var(--fr-text-sec);">&times;</div>
            `;

            // Mobile Swipe Logic
            let startX = 0;
            toast.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive: true});
            toast.addEventListener('touchmove', e => {
                const diff = e.touches[0].clientX - startX;
                if (diff > 0) toast.style.transform = `translateX(${diff}px)`;
            }, {passive: true});
            toast.addEventListener('touchend', e => {
                const diff = e.changedTouches[0].clientX - startX;
                if (diff > 100) this.dismiss(toast);
                else toast.style.transform = 'translateX(0)';
            });
            toast.addEventListener('click', () => this.dismiss(toast));

            this.container.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('visible'));
            setTimeout(() => this.dismiss(toast), 4000);
        },

        dismiss(el) {
            el.classList.remove('visible');
            el.addEventListener('transitionend', () => el.remove());
        }
    };

    // --- UI Renderers ---
    const UI = {
        build() {
            const currentChat = CONFIG.chatRotations[store.chatIndex];
            
            const html = `
                <div class="fr-widget">
                    <nav id="fr-nav">
                        <img src="${CONFIG.assets.logo}" class="fr-logo" alt="Frame">
                        
                        <div class="fr-actions">
                            <button class="fr-btn" id="fr-btn-notif" aria-label="Notificações">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                <span class="fr-badge ${!store.usage.readAll ? 'has-new' : ''}"></span>
                            </button>

                            <button class="fr-btn" id="fr-btn-fav" aria-label="Favoritos" style="color: ${store.favorites ? 'var(--fr-accent)' : ''}">
                                <svg viewBox="0 0 24 24" fill="${store.favorites ? 'currentColor' : 'none'}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>

                            <a href="${currentChat.url}" target="_blank" class="fr-btn" id="fr-btn-chat" aria-label="${currentChat.label}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                    ${currentChat.icon === 'hotel' ? '<path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-2a2 2 0 0 1 4 0v2"/>' : 
                                      currentChat.icon === 'face' ? '<path d="M9 3h.01M15 3h.01M9 21h.01M15 21h.01M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"/>' : 
                                      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'}
                                </svg>
                            </a>

                            <button class="fr-btn" id="fr-btn-login" aria-label="Login">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </button>
                        </div>
                    </nav>

                    <div id="fr-overlay" class="fr-overlay">
                        <div id="fr-popup" class="fr-popup">
                            </div>
                    </div>

                    <div id="fr-scroll-top" role="button" aria-label="Voltar ao topo">
                        <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            Toaster.init();
        },

        renderNotifications() {
            const loc = store.location ? store.location.city : 'sua região';
            const iconLoc = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
            
            const content = `
                <div class="fr-popup-header">
                    <h3>Notificações</h3>
                    <button class="fr-close-x">&times;</button>
                </div>
                <div class="fr-loc-header">${iconLoc} Encontrados em ${loc}</div>
                <div class="fr-popup-body">
                    ${!store.user ? `
                    <div class="fr-notif-item">
                        <div class="fr-notif-title">💎 Desbloqueie o Potencial</div>
                        <div class="fr-notif-desc">Torne-se premium para ver conteúdos exclusivos.</div>
                        <a href="https://frameag.com/premium" class="fr-cta-sm">Assinar Agora</a>
                    </div>` : ''}
                    
                    <div class="fr-notif-item">
                        <div class="fr-notif-title">${store.isNight ? '🌙 Modelos Online Agora' : '🔥 Vídeos Recentes'}</div>
                        <div class="fr-notif-desc">${store.isNight ? 'A noite está apenas começando. Veja quem está ao vivo.' : 'Confira as atualizações que acabaram de chegar.'}</div>
                        <a href="https://frameag.com/models" class="fr-cta-sm">Ver Catálogo</a>
                    </div>

                     <div class="fr-notif-item">
                        <div class="fr-notif-title">💬 ${CONFIG.chatRotations[store.chatIndex].label}</div>
                        <div class="fr-notif-desc">Fale diretamente com nossa equipe ou modelos.</div>
                        <a href="${CONFIG.chatRotations[store.chatIndex].url}" class="fr-cta-sm">Acessar</a>
                    </div>
                </div>
            `;
            document.getElementById('fr-popup').innerHTML = content;
        },

        renderLogin() {
            let content = '';
            
            if (!store.user) {
                // Estado 1: Login / Cadastro
                content = `
                    <div class="fr-popup-header">
                        <h3>Acesse sua conta</h3>
                        <button class="fr-close-x">&times;</button>
                    </div>
                    <div class="fr-popup-body fr-auth-view">
                        <a href="https://www.frameag.com/login" class="fr-btn-block fr-btn-primary">Entrar</a>
                        <a href="https://www.frameag.com/cadastro" class="fr-btn-block fr-btn-outline">Criar conta grátis</a>
                        <div style="margin: 20px 0; border-top: 1px solid var(--fr-border);"></div>
                        <button id="fr-btn-settings-demo" style="background:none; border:none; color: var(--fr-text-sec); font-size: 12px; cursor: pointer;">Configurar perfil (Demo)</button>
                    </div>
                `;
            } else {
                // Estado 3: Logado
                content = `
                    <div class="fr-popup-header">
                        <h3>Meu Perfil</h3>
                        <button class="fr-close-x">&times;</button>
                    </div>
                    <div class="fr-popup-body fr-user-card">
                        <img src="${store.user.avatar || 'https://via.placeholder.com/80'}" class="fr-avatar">
                        <h4 class="fr-user-name">${store.user.name}</h4>
                        <p class="fr-user-handle">@${store.user.handle}</p>
                        
                        <a href="https://frameag.com/premium" class="fr-btn-block fr-premium-btn">✨ Assinar Premium</a>
                        <button class="fr-btn-block fr-btn-outline">Editar Perfil</button>
                        <button id="fr-logout" style="margin-top:10px; color:var(--fr-error); background:none; border:none; cursor:pointer; font-size:12px;">Sair da conta</button>
                    </div>
                `;
            }
            document.getElementById('fr-popup').innerHTML = content;
            
            // Bind Login Demo Actions
            if(!store.user) {
                document.getElementById('fr-btn-settings-demo')?.addEventListener('click', () => UI.renderSettingsForm());
            } else {
                document.getElementById('fr-logout')?.addEventListener('click', () => {
                    store.user = null;
                    localStorage.removeItem('fr_user');
                    Toaster.show('Você saiu da conta.', 'info');
                    UI.renderLogin();
                });
            }
        },

        renderSettingsForm() {
            // Estado 2: Settings Form
            const content = `
                <div class="fr-popup-header">
                    <h3>Configurar Perfil</h3>
                    <button class="fr-close-x">&times;</button>
                </div>
                <div class="fr-popup-body fr-auth-view">
                    <input type="text" id="inp-name" class="fr-input" placeholder="Seu nome">
                    <input type="text" id="inp-handle" class="fr-input" placeholder="@usuario">
                    <button id="fr-save-profile" class="fr-btn-block fr-btn-primary">Salvar & Entrar</button>
                </div>
            `;
            document.getElementById('fr-popup').innerHTML = content;
            
            document.getElementById('fr-save-profile').addEventListener('click', () => {
                const name = document.getElementById('inp-name').value || 'Visitante';
                const handle = document.getElementById('inp-handle').value || 'user';
                store.user = { name, handle, avatar: 'https://ui-avatars.com/api/?background=8E6E4A&color=fff&name=' + name };
                saveState('user', store.user);
                Toaster.show(`Bem-vindo, ${name}!`, 'success');
                UI.renderLogin(); // Vai para tela de logado
            });
        }
    };

    // =========================================================================
    // 4. EVENT MANAGER
    // =========================================================================
    const initEvents = () => {
        const overlay = document.getElementById('fr-overlay');
        const popup = document.getElementById('fr-popup');
        
        // Toggle Overlay helper
        const toggle = (isOpen) => {
            overlay.classList.toggle('open', isOpen);
            if(!isOpen) document.getElementById('fr-popup').innerHTML = ''; // Clean up
        };

        // Delegate Clicks (Performance)
        document.body.addEventListener('click', (e) => {
            const t = e.target;
            
            // Abrir Notificações
            if (t.closest('#fr-btn-notif')) {
                UI.renderNotifications();
                toggle(true);
                // Marca como lido visualmente
                document.querySelector('.fr-badge').classList.remove('has-new');
                store.usage.readAll = true;
            }

            // Abrir Login
            if (t.closest('#fr-btn-login')) {
                UI.renderLogin();
                toggle(true);
            }

            // Fechar Popup
            if (t.closest('.fr-close-x') || t === overlay) {
                toggle(false);
            }

            // Favoritar
            if (t.closest('#fr-btn-fav')) {
                store.favorites = !store.favorites;
                saveState('favorites', store.favorites);
                const btn = document.getElementById('fr-btn-fav');
                btn.style.color = store.favorites ? 'var(--fr-accent)' : '';
                btn.querySelector('svg').setAttribute('fill', store.favorites ? 'currentColor' : 'none');
                Toaster.show(store.favorites ? 'Adicionado aos favoritos' : 'Removido dos favoritos', 'success');
            }

            // Scroll Top
            if (t.closest('#fr-scroll-top')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Scroll Handling (Throttled via RAF)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const st = window.scrollY;
                    document.getElementById('fr-nav').classList.toggle('active', st > 50);
                    document.getElementById('fr-scroll-top').classList.toggle('visible', st > 300);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    };

    // =========================================================================
    // 5. BOOTSTRAP
    // =========================================================================
    const init = () => {
        injectStyles();
        UI.build();
        initEvents();
        GeoService.init(); // Async geo fetch
        
        // Rotating Chat Logic (Refresh on init)
        const nextChatIdx = (store.chatIndex + 1) % CONFIG.chatRotations.length;
        // Salvar próximo index para a proxima visita
        // (Lógica simplificada, na prática está aleatório no store.chatIndex atual)
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();