/**
 * Frame Widget 3.0 PROIBIDA COPIA OU REPRODUÇÃO SEM AUTORIZAÇÃO EXPRESSA POR ESCRITO DA FRAMEAG.COM - Enterprise Grade Embed
 * * Features:
 * - Contextual Notifications (Time/Location/History)
 * - Advanced Toast System with Swipe-to-Dismiss
 * - LocalStorage State Persistence
 * - High Performance (RAF, Passive Listeners)
 * - WAI-ARIA Accessible
 */
(function() {
    'use strict';

    // =========================================================================
    // 1. CONFIGURAÇÃO & CONSTANTES
    // =========================================================================
    const CONFIG = {
        keys: {
            theme: 'fr_theme_pref',
            user: 'fr_user_data',
            interactions: 'fr_interactions',
            locPermission: 'fr_loc_permission'
        },
        assets: {
            // Mantendo logo original
            logo: 'https://framerusercontent.com/images/JaIvmSW2LTbs0XCR7tnpcmU8xA.png',
            font: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
        },
        endpoints: {
            login: 'https://www.frameag.com/login',
            register: 'https://www.frameag.com/cadastro',
            contact: 'https://www.frameag.com/contato',
            premium: 'https://www.frameag.com/premium',
            hotels: 'https://www.frameag.com/hotels',
            verification: 'https://www.frameag.com/verificacao'
        }
    };

    // Estado Reativo Local
    const state = {
        theme: localStorage.getItem(CONFIG.keys.theme) || 'light',
        user: JSON.parse(localStorage.getItem(CONFIG.keys.user) || 'null'),
        interactions: JSON.parse(localStorage.getItem(CONFIG.keys.interactions) || '{"clicks": 0, "toastsignored": 0}'),
        toastQueue: [],
        isToastShowing: false
    };

    // =========================================================================
    // 2. CSS ENGINE (Variáveis & Estilos Otimizados)
    // =========================================================================
    const injectStyles = () => {
        const css = `
        :root {
            /* Core Palette - Mantendo Identidade Visual */
            --fr-font: 'Montserrat', sans-serif;
            --fr-bg-header: rgba(20, 20, 20, 0.95); /* Header sempre escuro */
            --fr-accent: #8E6E4A;
            --fr-accent-hover: #A6845E;
            --fr-text-main: #FFFFFF; /* Texto header */
            
            /* Theme Variables (Light/Dark Switchable) */
            --fr-popup-bg: #FFFFFF;
            --fr-popup-text: #202020;
            --fr-popup-border: rgba(0,0,0,0.1);
            --fr-btn-bg: #F5F5F5;
            --fr-scroll-bg: linear-gradient(135deg, #8B4513, #D2691E);
            --fr-scroll-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
            
            /* Semantic Colors */
            --fr-success: #28a745;
            --fr-info: #17a2b8;
            --fr-error: #dc3545;
            --fr-shadow-lg: 0 10px 30px -5px rgba(0, 0, 0, 0.15);
            
            /* Z-Indices */
            --z-nav: 9999;
            --z-overlay: 10000;
            --z-toast: 10002;
            --z-loc: 10001;
        }

        [data-fr-theme="dark"] {
            --fr-popup-bg: #1a1a1a;
            --fr-popup-text: #f0f0f0;
            --fr-popup-border: rgba(255,255,255,0.1);
            --fr-btn-bg: #333333;
            --fr-scroll-bg: #2a2a2a;
            --fr-scroll-shadow: 0 0 15px rgba(139,69,19,0.3);
        }

        /* Reset & Base */
        .fr-widget *, .fr-widget *::before, .fr-widget *::after { box-sizing: border-box; outline: none; -webkit-tap-highlight-color: transparent; }
        .fr-hidden { display: none !important; }
        .fr-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

        /* Navigation (Fixo no Topo) */
        #fr-nav {
            position: fixed; top: 0; left: 0; right: 0;
            height: 80px; padding: 0 5%;
            background: var(--fr-bg-header);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            display: flex; align-items: center; justify-content: space-between;
            z-index: --z-nav; border-bottom: 1px solid rgba(255,255,255,0.05);
            transition: transform 0.3s ease;
        }
        #fr-nav.fr-nav-hidden { transform: translateY(-100%); }

        .fr-logo { height: 40px; width: auto; display: block; }
        .fr-actions { display: flex; align-items: center; gap: 24px; }

        /* Icons */
        .fr-icon-btn {
            background: none; border: none; cursor: pointer; padding: 0;
            color: var(--fr-text-main); position: relative;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .fr-icon-btn:hover { transform: scale(1.1); }
        .fr-icon-btn svg { width: 24px; height: 24px; stroke-width: 1.5; fill: none; stroke: currentColor; }
        
        /* Chat Icon Specific */
        .fr-icon-chat svg { fill: rgba(255,255,255,0.1); }

        /* Badges */
        .fr-badge {
            position: absolute; top: -5px; right: -5px;
            background: var(--fr-accent); color: white;
            font-size: 10px; font-weight: 700;
            min-width: 16px; height: 16px; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            border: 2px solid var(--fr-bg-header);
        }

        /* Overlays & Popups */
        .fr-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
            z-index: var(--z-overlay); opacity: 0; visibility: hidden;
            transition: all 0.3s ease; display: flex;
        }
        .fr-overlay.active { opacity: 1; visibility: visible; }
        
        /* Posicionamento Contextual dos Popups */
        .fr-popup-wrapper {
            position: absolute; top: 90px;
            background: var(--fr-popup-bg); color: var(--fr-popup-text);
            border-radius: 16px; border: 1px solid var(--fr-popup-border);
            box-shadow: var(--fr-shadow-lg);
            width: 320px; max-height: 80vh; overflow-y: auto;
            transform: translateY(-20px); opacity: 0;
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .fr-overlay.active .fr-popup-wrapper { transform: translateY(0); opacity: 1; }
        
        /* Notificações (Direita) */
        .fr-pos-right { right: 5%; }
        /* Login (Direita, levemente deslocado) */
        .fr-pos-login { right: 8%; }

        /* Notification Styling */
        .fr-popup-header {
            padding: 16px; border-bottom: 1px solid var(--fr-popup-border);
            display: flex; justify-content: space-between; align-items: center;
        }
        .fr-popup-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
        .fr-close-x {
            width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.05);
            border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
            color: var(--fr-popup-text); transition: background 0.2s;
        }
        .fr-close-x:hover { background: rgba(0,0,0,0.1); opacity: 0.8; }

        .fr-notif-list { padding: 10px; }
        .fr-notif-item {
            padding: 12px; margin-bottom: 8px; border-radius: 8px;
            background: var(--fr-btn-bg); transition: transform 0.2s;
            cursor: pointer; position: relative;
        }
        .fr-notif-item:hover { transform: translateX(4px); }
        .fr-notif-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; display: block; }
        .fr-notif-body { font-size: 12px; opacity: 0.8; line-height: 1.4; }

        /* Login / Settings Styles */
        .fr-login-choice { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .fr-btn-fill {
            background: var(--fr-accent); color: white; border: none;
            padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;
            transition: background 0.2s;
        }
        .fr-btn-fill:hover { background: var(--fr-accent-hover); }
        .fr-btn-outline {
            background: transparent; color: var(--fr-popup-text);
            border: 2px solid var(--fr-popup-border);
            padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;
            transition: border-color 0.2s;
        }
        .fr-btn-outline:hover { border-color: var(--fr-accent); }
        .fr-link-sub { text-align: center; font-size: 12px; text-decoration: underline; cursor: pointer; color: var(--fr-popup-text); opacity: 0.7; }

        /* Mini Form */
        .fr-form-group { margin-bottom: 12px; }
        .fr-form-group label { display: block; font-size: 12px; margin-bottom: 4px; font-weight: 600; }
        .fr-input {
            width: 100%; padding: 10px; border-radius: 6px;
            border: 1px solid var(--fr-popup-border); background: var(--fr-btn-bg);
            color: var(--fr-popup-text);
        }
        .fr-avatar-preview { width: 60px; height: 60px; border-radius: 50%; background: #ddd; margin: 0 auto 10px; object-fit: cover; display: block; }
        
        /* Premium Shine */
        .fr-shine-icon { display: inline-block; vertical-align: middle; margin-left: 6px; }
        .fr-shine-path { fill: url(#gold-gradient); }

        /* Location Banner */
        #fr-location-banner {
            position: fixed; bottom: 100px; left: 20px;
            background: var(--fr-bg-header); color: white;
            padding: 12px 20px; border-radius: 50px;
            display: flex; align-items: center; gap: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            transform: translateX(-150%); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: var(--z-loc); font-size: 13px; font-weight: 500;
        }
        #fr-location-banner.visible { transform: translateX(0); }
        .fr-loc-pin { fill: var(--fr-accent); width: 16px; height: 16px; }

        /* Scroll Top */
        #fr-scroll-top {
            position: fixed; bottom: 30px; right: 30px;
            width: 48px; height: 48px; border-radius: 50%;
            background: var(--fr-scroll-bg);
            box-shadow: var(--fr-scroll-shadow);
            border: none; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transform: scale(0.8); pointer-events: none;
            transition: all 0.3s ease; z-index: var(--z-nav);
            animation: none;
        }
        #fr-scroll-top.visible { opacity: 1; transform: scale(1); pointer-events: auto; }
        [data-fr-theme="light"] #fr-scroll-top.visible { animation: fr-pulse 2s infinite; }
        #fr-scroll-top svg { fill: white; width: 20px; height: 20px; }

        /* Toasts */
        .fr-toast-container {
            position: fixed; top: 20px; right: 20px;
            display: flex; flex-direction: column; gap: 10px;
            z-index: var(--z-toast); pointer-events: none;
        }
        .fr-toast {
            background: var(--fr-popup-bg); color: var(--fr-popup-text);
            padding: 16px; border-radius: 8px; width: 300px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            display: flex; align-items: center; gap: 12px;
            pointer-events: auto; opacity: 0; transform: translateX(50px);
            transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            border-left: 4px solid transparent; touch-action: pan-y;
        }
        .fr-toast.fr-show { opacity: 1; transform: translateX(0); }
        .fr-toast.fr-success { border-left-color: var(--fr-success); }
        .fr-toast.fr-info { border-left-color: var(--fr-info); }
        .fr-toast.fr-error { border-left-color: var(--fr-error); }
        .fr-toast-icon { width: 20px; height: 20px; flex-shrink: 0; }
        
        @keyframes fr-pulse { 0% { box-shadow: 0 0 0 0 rgba(142, 110, 74, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(142, 110, 74, 0); } 100% { box-shadow: 0 0 0 0 rgba(142, 110, 74, 0); } }

        @media (max-width: 768px) {
            .fr-popup-wrapper { width: 100%; height: 100%; top: 0; border-radius: 0; transform: translateY(100%); }
            .fr-pos-right, .fr-pos-login { right: 0; left: 0; }
            .fr-toast { width: 90vw; margin: 0 auto; }
            #fr-nav { padding: 0 16px; height: 70px; }
            .fr-actions { gap: 16px; }
        }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Load Font Async
        const link = document.createElement('link');
        link.href = CONFIG.assets.font;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    // =========================================================================
    // 3. UTILS (Sanitização, Debounce, Date)
    // =========================================================================
    const Utils = {
        debounce: (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        sanitize: (str) => {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },
        getTimeOfDay: () => {
            const h = new Date().getHours();
            return h >= 18 || h < 6 ? 'night' : 'day';
        }
    };

    // =========================================================================
    // 4. HTML BUILDER (Estrutura Principal)
    // =========================================================================
    const buildUI = () => {
        const container = document.createElement('div');
        container.className = 'fr-widget';
        container.setAttribute('data-fr-theme', state.theme);

        container.innerHTML = `
            <svg style="display:none">
                <defs>
                    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FDB931;stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>

            <nav id="fr-nav" role="navigation" aria-label="Menu Frame">
                <img src="${CONFIG.assets.logo}" alt="Frame" class="fr-logo">
                <div class="fr-actions">
                    <button class="fr-icon-btn" id="fr-btn-notif" aria-label="Notificações" aria-haspopup="true">
                        <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        <span id="fr-badge" class="fr-badge fr-hidden">0</span>
                    </button>

                    <a href="${CONFIG.endpoints.contact}" target="_blank" rel="noopener noreferrer" class="fr-icon-btn fr-icon-chat" aria-label="Abrir Chat de Suporte">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01M12 10h.01M16 10h.01" stroke-width="3" stroke-linecap="round"/></svg>
                    </a>

                    <button class="fr-icon-btn" id="fr-btn-login" aria-label="Abrir opções de login" aria-haspopup="true">
                        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </button>
                </div>
            </nav>

            <div id="fr-overlay" class="fr-overlay" aria-hidden="true">
                
                <div id="fr-popup-notif" class="fr-popup-wrapper fr-pos-right" role="dialog" aria-modal="true" aria-hidden="true">
                    <div class="fr-popup-header">
                        <h3 id="fr-notif-header-text">Notificações</h3>
                        <button class="fr-close-x" aria-label="Fechar Notificações">&times;</button>
                    </div>
                    <div class="fr-notif-list" id="fr-notif-list"></div>
                </div>

                <div id="fr-popup-login" class="fr-popup-wrapper fr-pos-login" role="dialog" aria-modal="true" aria-hidden="true">
                    <div class="fr-popup-header">
                        <h3>Minha Conta</h3>
                        <button class="fr-close-x" aria-label="Fechar Menu">&times;</button>
                    </div>
                    <div id="fr-login-content"></div>
                </div>
            </div>

            <div id="fr-location-banner" aria-live="polite">
                <svg class="fr-loc-pin" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span id="fr-loc-text">Buscando modelos próximas...</span>
            </div>

            <div class="fr-toast-container" id="fr-toast-container"></div>

            <button id="fr-scroll-top" aria-label="Voltar ao topo">
                <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
        `;
        document.body.appendChild(container);
    };

    // =========================================================================
    // 5. MÓDULO DE TOASTS (Com Queue & Swipe)
    // =========================================================================
    const ToastSystem = {
        add: (msg, type = 'info', action = null) => {
            state.toastQueue.push({ msg, type, action });
            ToastSystem.processQueue();
        },
        processQueue: () => {
            if (state.isToastShowing || state.toastQueue.length === 0) return;
            
            state.isToastShowing = true;
            const { msg, type } = state.toastQueue.shift();
            ToastSystem.render(msg, type);
        },
        render: (msg, type) => {
            const container = document.getElementById('fr-toast-container');
            const el = document.createElement('div');
            el.className = `fr-toast fr-${type}`;
            el.setAttribute('role', 'alert');
            
            let icon = '';
            if(type === 'success') icon = '<svg class="fr-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
            if(type === 'info') icon = '<svg class="fr-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
            if(type === 'error') icon = '<svg class="fr-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

            el.innerHTML = `${icon}<span>${msg}</span>`;
            container.appendChild(el);

            // Animação de Entrada
            requestAnimationFrame(() => el.classList.add('fr-show'));

            // Swipe Logic (Mobile)
            let touchStartX = 0;
            el.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
            el.addEventListener('touchend', e => {
                if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 100) ToastSystem.dismiss(el);
            }, {passive: true});

            // Auto Dismiss
            setTimeout(() => ToastSystem.dismiss(el), 4000);
        },
        dismiss: (el) => {
            if (!el.parentNode) return;
            el.classList.remove('fr-show');
            el.addEventListener('transitionend', () => {
                el.remove();
                state.isToastShowing = false;
                setTimeout(ToastSystem.processQueue, 500); // Delay entre toasts
            });
        }
    };

    // =========================================================================
    // 6. LÓGICA DE NEGÓCIO
    // =========================================================================
    
    // --- Notificações Dinâmicas ---
    const NotificationManager = {
        getData: () => {
            const time = Utils.getTimeOfDay();
            const lastInteraction = localStorage.getItem('fr_last_content') || 'hotels';
            
            // Lógica rotativa contextual
            let contentLink, contentText;
            if (lastInteraction === 'hotels') {
                contentLink = CONFIG.endpoints.verification;
                contentText = 'Entenda tudo sobre a verificação facial';
            } else {
                contentLink = CONFIG.endpoints.hotels;
                contentText = 'Frame Hotels: Experiências exclusivas';
            }

            const notifs = [
                {
                    id: 1,
                    title: time === 'day' ? 'Vídeos quentinhos 🔥' : 'Modelos disponíveis nesta noite 🌙',
                    body: 'Confira as novidades no catálogo agora.',
                    url: CONFIG.endpoints.login
                },
                {
                    id: 2,
                    title: 'Destaque para você',
                    body: contentText,
                    url: contentLink,
                    track: true // flag para alternar na próxima vez
                },
                {
                    id: 3,
                    title: 'Seja Premium',
                    body: 'Desbloqueie funcionalidades exclusivas.',
                    url: CONFIG.endpoints.premium
                }
            ];
            return notifs;
        },
        render: () => {
            const list = document.getElementById('fr-notif-list');
            list.innerHTML = '';
            const data = NotificationManager.getData();
            
            data.forEach(n => {
                const item = document.createElement('div');
                item.className = 'fr-notif-item';
                item.setAttribute('role', 'link');
                item.innerHTML = `
                    <span class="fr-notif-title">${n.title}</span>
                    <span class="fr-notif-body">${n.body}</span>
                `;
                item.addEventListener('click', () => {
                    if(n.track) localStorage.setItem('fr_last_content', n.url.includes('hotels') ? 'hotels' : 'verification');
                    window.open(n.url, '_blank');
                    item.remove(); // Remove da view visualmente
                });
                list.appendChild(item);
            });

            // Badge Update
            const badge = document.getElementById('fr-badge');
            badge.textContent = data.length;
            badge.classList.remove('fr-hidden');
        }
    };

    // --- Login / Settings Flow ---
    const LoginManager = {
        renderChoice: () => {
            const container = document.getElementById('fr-login-content');
            
            // Se usuário já logado (simulado via localStorage)
            if (state.user) {
                LoginManager.renderSettings();
                return;
            }

            container.innerHTML = `
                <div class="fr-login-choice">
                    <p style="font-size:14px; margin-bottom:10px">O que você prefere?</p>
                    <button class="fr-btn-fill" id="fr-act-login">Fazer Login</button>
                    <button class="fr-btn-outline" id="fr-act-register">Cadastrar</button>
                    <span class="fr-link-sub" id="fr-act-settings">Configurações (Demo)</span>
                </div>
            `;
            
            document.getElementById('fr-act-login').onclick = () => window.open(CONFIG.endpoints.login, '_blank');
            document.getElementById('fr-act-register').onclick = () => window.open(CONFIG.endpoints.register, '_blank');
            document.getElementById('fr-act-settings').onclick = LoginManager.renderForm;
        },
        renderForm: () => {
            const container = document.getElementById('fr-login-content');
            container.innerHTML = `
                <div class="fr-login-choice">
                    <img id="fr-preview" class="fr-avatar-preview" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E">
                    <div class="fr-form-group">
                        <label>Nome</label>
                        <input type="text" id="fr-inp-name" class="fr-input" placeholder="Seu nome">
                    </div>
                    <div class="fr-form-group">
                        <label>@handle</label>
                        <input type="text" id="fr-inp-handle" class="fr-input" placeholder="@usuario">
                    </div>
                    <div class="fr-form-group">
                        <label>Foto</label>
                        <input type="file" id="fr-inp-file" accept="image/*" style="font-size:12px">
                    </div>
                    <button class="fr-btn-fill" id="fr-save-profile">Salvar Perfil</button>
                </div>
            `;

            // Preview Logic
            document.getElementById('fr-inp-file').addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    document.getElementById('fr-preview').src = URL.createObjectURL(this.files[0]);
                }
            });

            // Save Logic
            document.getElementById('fr-save-profile').addEventListener('click', () => {
                const name = Utils.sanitize(document.getElementById('fr-inp-name').value);
                const handle = Utils.sanitize(document.getElementById('fr-inp-handle').value);
                
                if(!name || !handle.startsWith('@')) {
                    ToastSystem.add('Handle deve começar com @ e nome é obrigatório', 'error');
                    return;
                }

                state.user = { name, handle };
                localStorage.setItem(CONFIG.keys.user, JSON.stringify(state.user));
                ToastSystem.add('Perfil salvo com sucesso!', 'success');
                LoginManager.renderSettings();
            });
        },
        renderSettings: () => {
            const container = document.getElementById('fr-login-content');
            container.innerHTML = `
                <div class="fr-login-choice">
                    <div style="text-align:center; margin-bottom:10px">
                        <strong>${state.user.name}</strong><br>
                        <span style="font-size:12px; opacity:0.7">${state.user.handle}</span>
                    </div>
                    <button class="fr-btn-outline" id="fr-toggle-theme">
                        Tema: ${state.theme === 'light' ? 'Claro ☀️' : 'Escuro 🌙'}
                    </button>
                    <button class="fr-btn-outline" id="fr-edit-profile">Editar Perfil</button>
                    <button class="fr-btn-fill" id="fr-go-premium">
                        Assinar Premium 
                        <svg class="fr-shine-icon" width="14" height="14" viewBox="0 0 24 24">
                            <path class="fr-shine-path" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </button>
                </div>
            `;

            document.getElementById('fr-toggle-theme').onclick = () => {
                state.theme = state.theme === 'light' ? 'dark' : 'light';
                document.querySelector('.fr-widget').setAttribute('data-fr-theme', state.theme);
                localStorage.setItem(CONFIG.keys.theme, state.theme);
                LoginManager.renderSettings(); // Re-render text
            };
            document.getElementById('fr-edit-profile').onclick = LoginManager.renderForm;
            document.getElementById('fr-go-premium').onclick = () => window.open(CONFIG.endpoints.premium, '_blank');
        }
    };

    // --- Geolocation ---
    const LocationService = {
        init: () => {
            // Só dispara se scroll > 50% (controlado no event listener de scroll)
            if(!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    // Aqui você usaria uma API de Reverse Geocoding real. 
                    // Simulando para fins do embed sem chave de API externa:
                    LocationService.showBanner("Sua cidade atual");
                },
                (err) => {
                    LocationService.showBanner("Uma cidade próxima");
                }
            );
        },
        showBanner: (text) => {
            const banner = document.getElementById('fr-location-banner');
            document.getElementById('fr-loc-text').textContent = `Esta modelo está disponível em: ${text}`;
            banner.classList.add('visible');
            
            // Auto-hide
            setTimeout(() => banner.classList.remove('visible'), 5000);
            
            // Close on click anywhere
            document.addEventListener('click', (e) => {
                if(!banner.contains(e.target)) banner.classList.remove('visible');
            }, {once: true});
        }
    };

    // =========================================================================
    // 7. INICIALIZAÇÃO & EVENTOS
    // =========================================================================
    const init = () => {
        injectStyles();
        buildUI();
        
        // Element Refs
        const overlay = document.getElementById('fr-overlay');
        const notifPopup = document.getElementById('fr-popup-notif');
        const loginPopup = document.getElementById('fr-popup-login');
        const scrollBtn = document.getElementById('fr-scroll-top');
        const nav = document.getElementById('fr-nav');

        // Toggle Logic
        const closeAll = () => {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            notifPopup.classList.add('fr-hidden');
            loginPopup.classList.add('fr-hidden');
        };

        const openPopup = (type) => {
            closeAll();
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            
            if (type === 'notif') {
                notifPopup.classList.remove('fr-hidden');
                NotificationManager.render();
                notifPopup.querySelector('button').focus(); // Trap focus start
            } else {
                loginPopup.classList.remove('fr-hidden');
                LoginManager.renderChoice();
                loginPopup.querySelector('button').focus();
            }
        };

        // Listeners UI
        document.getElementById('fr-btn-notif').addEventListener('click', () => openPopup('notif'));
        document.getElementById('fr-btn-login').addEventListener('click', () => openPopup('login'));
        
        document.querySelectorAll('.fr-close-x').forEach(btn => btn.addEventListener('click', closeAll));
        overlay.addEventListener('click', (e) => { if(e.target === overlay) closeAll(); });
        
        // Escape Key
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && overlay.classList.contains('active')) closeAll();
        });

        // Scroll Logic (Performance Optimized)
        let lastScrollY = window.scrollY;
        let locTriggered = false;

        window.addEventListener('scroll', Utils.debounce(() => {
            const sy = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            // Show/Hide Scroll Top
            if (sy > 300) scrollBtn.classList.add('visible');
            else scrollBtn.classList.remove('visible');

            // Location Trigger (> 50%)
            if (!locTriggered && sy > (pageHeight / 2)) {
                locTriggered = true;
                LocationService.init();
            }

            lastScrollY = sy;
        }, 10), { passive: true });

        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Initial Greeting Toast
        setTimeout(() => {
            const time = Utils.getTimeOfDay();
            const msg = time === 'day' ? 'Bem-vindo de volta!' : 'Boa noite, explore sem limites!';
            ToastSystem.add(msg, 'info');
        }, 1500);
    };

    // Boot
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();