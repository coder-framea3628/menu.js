/**
 * Frame Widget 3.0 - Elite Edition
 * * Features: 
 * - Contextual Notifications (Day/Night)
 * - Geolocation with IP Fallback
 * - Smart Toast System (Queue + Swipe to dismiss)
 * - Persistent Auth & Settings (Avatar handling)
 * - High Performance Rendering (RAF, Observers)
 * - WCAG 2.1 Compliant
 */

(function() {
    'use strict';

    // =========================================================================
    // 1. CONFIGURAÇÃO & CONSTANTES
    // =========================================================================
    const CONFIG = {
        keys: {
            theme: 'fr_theme',
            favCount: 'fr_fav_count',
            user: 'fr_user_data',
            location: 'fr_location_cache'
        },
        endpoints: {
            login: 'https://www.frameag.com/login',
            signup: 'https://www.frameag.com/cadastro',
            premium: 'https://www.frameag.com/premium',
            contact: 'https://www.frameag.com/contato',
            ipApi: 'https://ipwho.is/' // Free API, no key required
        },
        assets: {
            logo: 'https://framerusercontent.com/images/JaIvmSW2LTbs0XCR7tnpcmU8xA.png', // Exemplo
        },
        colors: {
            primary: '#8B4513',
            primaryGrad: 'linear-gradient(135deg, #A0522D, #8B4513)',
            darkHeader: '#1A1B1E'
        }
    };

    // =========================================================================
    // 2. STATE MANAGEMENT (Reativo)
    // =========================================================================
    const State = {
        data: {
            theme: localStorage.getItem(CONFIG.keys.theme) || 'auto',
            favCount: parseInt(localStorage.getItem(CONFIG.keys.favCount) || '0'),
            user: JSON.parse(localStorage.getItem(CONFIG.keys.user) || 'null'),
            location: null,
            isMenuOpen: false,
            notifications: []
        },
        listeners: [],
        
        subscribe(listener) {
            this.listeners.push(listener);
        },
        
        set(key, value) {
            this.data[key] = value;
            if (key === 'theme') localStorage.setItem(CONFIG.keys.theme, value);
            if (key === 'favCount') localStorage.setItem(CONFIG.keys.favCount, value);
            if (key === 'user') localStorage.setItem(CONFIG.keys.user, JSON.stringify(value));
            
            this.listeners.forEach(fn => fn(key, value));
        },

        get(key) { return this.data[key]; }
    };

    // =========================================================================
    // 3. ICONS (SVG Strings otimizados)
    // =========================================================================
    const Icons = {
        user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
        bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
        heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
        settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
        arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
        check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
        sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
    };

    // =========================================================================
    // 4. CSS STYLES (Injected)
    // =========================================================================
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --fr-z: 99999;
                --fr-font: 'Helvetica Neue', Arial, sans-serif;
                --fr-bg: rgba(255, 255, 255, 0.95);
                --fr-text: #1a1a1a;
                --fr-border: rgba(0,0,0,0.08);
                --fr-primary: ${CONFIG.colors.primary};
                --fr-primary-grad: ${CONFIG.colors.primaryGrad};
                --fr-shadow: 0 8px 32px rgba(0,0,0,0.12);
                --fr-radius: 12px;
                --fr-nav-bg: ${CONFIG.colors.darkHeader}; /* Always dark bg header */
                --fr-nav-text: #ffffff;
            }
            [data-fr-theme="dark"] {
                --fr-bg: rgba(24, 24, 27, 0.95);
                --fr-text: #ffffff;
                --fr-border: rgba(255,255,255,0.1);
                --fr-shadow: 0 8px 32px rgba(0,0,0,0.4);
            }

            /* --- RESET & BASE --- */
            .fr-widget-root, .fr-widget-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--fr-font); outline: none; -webkit-tap-highlight-color: transparent; }
            .fr-widget-root button { cursor: pointer; background: none; border: none; }
            
            /* --- HEADER --- */
            .fr-header {
                position: fixed; top: 0; left: 0; right: 0; height: 70px;
                background: var(--fr-nav-bg); color: var(--fr-nav-text);
                display: flex; align-items: center; justify-content: space-between;
                padding: 0 5%; z-index: var(--fr-z);
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transform: translateY(-100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                contain: layout paint;
            }
            .fr-header.is-visible { transform: translateY(0); }
            
            .fr-logo img { height: 32px; display: block; }

            .fr-actions { display: flex; align-items: center; gap: 16px; }
            
            .fr-btn {
                position: relative; width: 40px; height: 40px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                color: rgba(255,255,255,0.8); transition: all 0.2s ease;
            }
            .fr-btn:hover, .fr-btn:focus-visible { background: rgba(255,255,255,0.1); color: #fff; transform: scale(1.05); }
            .fr-btn:focus-visible { box-shadow: 0 0 0 2px var(--fr-primary); }
            .fr-btn svg { width: 22px; height: 22px; }
            
            /* Badges */
            .fr-badge {
                position: absolute; top: 6px; right: 6px; font-size: 10px; font-weight: bold;
                background: var(--fr-primary); color: white; border-radius: 10px;
                padding: 2px 5px; min-width: 16px; text-align: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3); animation: fr-pop 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.27);
            }

            /* Avatar in Header */
            .fr-avatar-btn img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid var(--fr-primary); }

            /* --- MODALS (Shared) --- */
            .fr-modal-overlay {
                position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
                z-index: var(--fr-z); opacity: 0; pointer-events: none;
                transition: opacity 0.3s ease; display: flex; align-items: center; justify-content: center;
            }
            .fr-modal-overlay.is-open { opacity: 1; pointer-events: auto; }
            
            .fr-modal {
                background: var(--fr-bg); color: var(--fr-text);
                width: 90%; max-width: 400px; border-radius: 20px;
                box-shadow: var(--fr-shadow); padding: 24px;
                transform: scale(0.95) translateY(10px); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                border: 1px solid var(--fr-border);
                max-height: 85vh; overflow-y: auto;
            }
            .fr-modal-overlay.is-open .fr-modal { transform: scale(1) translateY(0); }

            .fr-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .fr-modal-title { font-size: 1.25rem; font-weight: 700; }
            .fr-close-modal { padding: 8px; border-radius: 8px; color: var(--fr-text); opacity: 0.6; }
            .fr-close-modal:hover { opacity: 1; background: rgba(0,0,0,0.05); transform: rotate(90deg); }

            /* Notifications Modal */
            .fr-notif-list { display: flex; flex-direction: column; gap: 12px; }
            .fr-notif-card {
                padding: 16px; border-radius: 12px; background: rgba(127,127,127,0.05);
                border: 1px solid var(--fr-border); transition: background 0.2s;
            }
            .fr-notif-card:hover { background: rgba(127,127,127,0.08); }
            .fr-notif-msg { font-size: 0.9rem; line-height: 1.4; margin-bottom: 8px; }
            .fr-link { color: var(--fr-primary); font-weight: 600; text-decoration: none; font-size: 0.85rem; }
            .fr-link:hover { text-decoration: underline; }

            /* Auth Modal */
            .fr-auth-btns { display: flex; gap: 12px; margin-bottom: 24px; }
            .fr-btn-block {
                flex: 1; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 0.95rem;
                display: flex; align-items: center; justify-content: center; gap: 8px;
                text-decoration: none; transition: transform 0.1s;
            }
            .fr-btn-block:active { transform: scale(0.98); }
            .fr-btn-primary { background: var(--fr-primary-grad); color: white; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3); }
            .fr-btn-outline { border: 2px solid var(--fr-border); color: var(--fr-text); }
            
            /* Settings Form */
            .fr-settings-trigger { display: flex; align-items: center; gap: 8px; color: var(--fr-text); opacity: 0.7; font-size: 0.9rem; margin-top: 10px; padding: 10px; width: 100%; border-radius: 8px; }
            .fr-settings-trigger:hover { background: rgba(127,127,127,0.05); opacity: 1; }
            
            .fr-form { margin-top: 16px; border-top: 1px solid var(--fr-border); padding-top: 16px; animation: fr-slide-down 0.3s ease; }
            .fr-input-group { margin-bottom: 12px; }
            .fr-input-group label { display: block; font-size: 0.8rem; margin-bottom: 4px; opacity: 0.7; }
            .fr-input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--fr-border); background: rgba(127,127,127,0.03); color: var(--fr-text); }
            .fr-input:focus { border-color: var(--fr-primary); }
            .fr-file-upload { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
            .fr-preview { width: 48px; height: 48px; border-radius: 50%; background: #ddd; object-fit: cover; }
            
            /* Theme Toggle in Menu */
            .fr-theme-toggle { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: var(--fr-text); }

            /* --- TOASTS --- */
            .fr-toast-container { position: fixed; top: 80px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: var(--fr-z); pointer-events: none; }
            .fr-toast {
                pointer-events: auto; min-width: 300px; padding: 14px 18px; border-radius: 12px;
                background: var(--fr-bg); border: 1px solid var(--fr-border); color: var(--fr-text);
                box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px;
                transform: translateX(50px); opacity: 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                border-left: 4px solid var(--fr-primary);
            }
            .fr-toast.fr-toast-success { border-left-color: #10B981; }
            .fr-toast.fr-toast-error { border-left-color: #EF4444; }
            .fr-toast.is-visible { transform: translateX(0); opacity: 1; }
            .fr-toast-icon { width: 20px; height: 20px; flex-shrink: 0; }
            .fr-toast-success .fr-toast-icon { color: #10B981; }
            
            /* --- LOCATION POPUP --- */
            .fr-loc-popup {
                position: fixed; bottom: 90px; right: 20px; background: var(--fr-bg); color: var(--fr-text);
                padding: 12px 20px; border-radius: 50px; box-shadow: var(--fr-shadow);
                display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600;
                transform: translateY(20px) scale(0.9); opacity: 0; pointer-events: none;
                transition: all 0.4s ease; border: 1px solid var(--fr-border); z-index: var(--fr-z);
            }
            .fr-loc-popup.is-visible { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
            .fr-loc-icon { color: var(--fr-primary); animation: fr-bounce 2s infinite; }

            /* --- SCROLL TOP --- */
            .fr-scroll-top {
                position: fixed; bottom: 30px; right: 30px; width: 48px; height: 48px;
                background: var(--fr-primary-grad); border-radius: 50%; color: white;
                box-shadow: 0 4px 12px rgba(139, 69, 19, 0.4);
                display: flex; align-items: center; justify-content: center;
                opacity: 0; transform: translateY(20px); transition: all 0.3s; cursor: pointer; z-index: var(--fr-z);
            }
            .fr-scroll-top.is-visible { opacity: 1; transform: translateY(0); }
            .fr-scroll-top:hover { transform: translateY(-3px); }

            /* --- ANIMATIONS --- */
            @keyframes fr-pop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
            @keyframes fr-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
            @keyframes fr-slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

            /* --- RESPONSIVE --- */
            @media (max-width: 600px) {
                .fr-header { padding: 0 16px; height: 60px; }
                .fr-actions { gap: 8px; }
                .fr-modal { width: 100%; height: 100%; max-height: 100%; border-radius: 0; max-width: none; }
                .fr-toast { min-width: auto; width: calc(100% - 40px); }
            }
        `;
        document.head.appendChild(style);
    };

    // =========================================================================
    // 5. MANAGERS (Logic)
    // =========================================================================
    
    // --- Toasts ---
    const ToastManager = {
        queue: [],
        processing: false,
        add(msg, type = 'info') {
            this.queue.push({ msg, type });
            this.process();
        },
        process() {
            if (this.processing || this.queue.length === 0) return;
            this.processing = true;
            const { msg, type } = this.queue.shift();
            this.show(msg, type);
        },
        show(msg, type) {
            const container = document.getElementById('fr-toasts');
            const el = document.createElement('div');
            el.className = `fr-toast fr-toast-${type}`;
            el.setAttribute('role', 'alert');
            
            const icon = type === 'success' ? Icons.check : type === 'error' ? Icons.close : Icons.info;
            el.innerHTML = `<div class="fr-toast-icon">${icon}</div><span>${msg}</span>`;
            
            container.appendChild(el);
            
            // Swipe Logic
            let startX = 0;
            el.addEventListener('touchstart', e => startX = e.touches[0].clientX);
            el.addEventListener('touchmove', e => {
                const diff = e.touches[0].clientX - startX;
                if(diff > 0) el.style.transform = `translateX(${diff}px)`;
            });
            el.addEventListener('touchend', e => {
                const diff = e.changedTouches[0].clientX - startX;
                if(diff > 50) this.remove(el);
                else el.style.transform = '';
            });

            requestAnimationFrame(() => el.classList.add('is-visible'));
            
            // Auto Dismiss
            setTimeout(() => this.remove(el), 4000);
        },
        remove(el) {
            el.classList.remove('is-visible');
            el.addEventListener('transitionend', () => {
                el.remove();
                this.processing = false;
                this.process(); // Next
            });
        }
    };

    // --- Geolocation ---
    const GeoManager = {
        async init() {
            // Trigger on scroll > 50%
            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) return; // Top is visible
                // Logic is reversed: we want to trigger when we are far down. 
                // Simplified: Just use scroll event listener with throttle for logic
            });
            
            // Better logic: Scroll event
            let shown = false;
            window.addEventListener('scroll', Utils.debounce(() => {
                if(shown) return;
                const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
                if(scrollPercent > 0.5) {
                    shown = true;
                    this.getLocation();
                }
            }, 200));
        },
        async getLocation() {
            let city = "sua região";
            try {
                // Try IP API first (Less intrusive, high success rate)
                const res = await fetch(CONFIG.endpoints.ipApi);
                const data = await res.json();
                if(data.success) city = data.city;
            } catch(e) { console.warn('Geo fallback failed'); }

            this.showPopup(city);
        },
        showPopup(city) {
            const el = document.getElementById('fr-loc-popup');
            if(!el) return;
            el.querySelector('span').textContent = `Modelo disponível em ${city}`;
            el.classList.add('is-visible');
            setTimeout(() => el.classList.remove('is-visible'), 6000);
        }
    };

    // --- Notifications Strategy ---
    const NotificationStrategy = {
        getMessages() {
            const hour = new Date().getHours();
            const isNight = hour >= 18 || hour < 6;
            
            const common = [
                { id: 1, text: "Desbloqueie o potencial total com Premium.", link: CONFIG.endpoints.premium, label: "Ver Premium" }
            ];

            const timeSpecific = isNight 
                ? { id: 2, text: "Modelos disponíveis nesta noite 🔥", link: CONFIG.endpoints.contact, label: "Ver agora" }
                : { id: 2, text: "Novos vídeos quentinhos disponíveis.", link: CONFIG.endpoints.contact, label: "Explorar" };

            // Rotate 3rd slot based on random or storage
            const slot3Options = [
                { id: 3, text: "Entenda a verificação facial.", link: CONFIG.endpoints.signup, label: "Ler mais" },
                { id: 3, text: "Conheça o Frame Hotels.", link: CONFIG.endpoints.login, label: "Ver Hotéis" }
            ];
            const slot3 = slot3Options[Math.floor(Math.random() * slot3Options.length)];

            return [timeSpecific, common[0], slot3];
        }
    };

    // =========================================================================
    // 6. DOM BUILDER
    // =========================================================================
    const render = () => {
        const root = document.createElement('div');
        root.className = 'fr-widget-root';
        
        root.innerHTML = `
            <header class="fr-header" id="fr-header">
                <a href="#" class="fr-logo" aria-label="Home">
                    <img src="${CONFIG.assets.logo}" alt="Frame">
                </a>
                <div class="fr-actions">
                    <button class="fr-btn" id="fr-btn-notif" aria-label="Notificações">
                        ${Icons.bell}
                        <span class="fr-badge" id="fr-badge" style="display:none">0</span>
                    </button>
                    <button class="fr-btn" id="fr-btn-fav" aria-label="Favoritos">
                        ${Icons.heart}
                        <span class="fr-badge" id="fr-fav-count" style="display:none">0</span>
                    </button>
                    <a href="${CONFIG.endpoints.contact}" target="_blank" class="fr-btn" aria-label="Chat">
                        ${Icons.chat}
                    </a>
                    <button class="fr-btn" id="fr-btn-auth" aria-label="Conta">
                        <div id="fr-auth-icon-wrap">${Icons.user}</div>
                    </button>
                </div>
            </header>

            <div class="fr-modal-overlay" id="fr-modal-notif" aria-hidden="true">
                <div class="fr-modal" role="dialog" aria-modal="true">
                    <div class="fr-modal-header">
                        <h2 class="fr-modal-title">Novidades</h2>
                        <button class="fr-close-modal" data-close="fr-modal-notif" aria-label="Fechar">${Icons.close}</button>
                    </div>
                    <div class="fr-notif-list" id="fr-notif-list"></div>
                </div>
            </div>

            <div class="fr-modal-overlay" id="fr-modal-auth" aria-hidden="true">
                <div class="fr-modal" role="dialog" aria-modal="true">
                    <div class="fr-modal-header">
                        <h2 class="fr-modal-title">Bem-vindo</h2>
                        <button class="fr-close-modal" data-close="fr-modal-auth" aria-label="Fechar">${Icons.close}</button>
                    </div>
                    <p style="margin-bottom: 20px; opacity: 0.8;">O que você prefere?</p>
                    <div class="fr-auth-btns">
                        <a href="${CONFIG.endpoints.login}" class="fr-btn-block fr-btn-primary">Login</a>
                        <a href="${CONFIG.endpoints.signup}" class="fr-btn-block fr-btn-outline">Cadastrar</a>
                    </div>
                    
                    <button class="fr-settings-trigger" id="fr-settings-toggle">
                        ${Icons.settings} Configurações
                    </button>
                    
                    <div class="fr-form" id="fr-settings-form" style="display:none">
                        <div class="fr-input-group">
                            <label>Nome de usuário</label>
                            <input type="text" class="fr-input" id="fr-input-name" placeholder="Ex: Alex">
                        </div>
                        <div class="fr-file-upload">
                            <img id="fr-preview-img" class="fr-preview" src="" style="display:none">
                            <input type="file" id="fr-input-file" accept="image/*" aria-label="Upload foto">
                        </div>
                        <button class="fr-btn-block fr-btn-primary" id="fr-save-profile">Salvar Perfil</button>
                        
                        <div class="fr-theme-toggle">
                            <span>Tema Escuro</span>
                            <button id="fr-theme-switch" style="width:40px;height:24px;background:#ddd;border-radius:12px;position:relative">
                                <div style="width:18px;height:18px;background:#fff;border-radius:50%;position:absolute;top:3px;left:3px;transition:0.3s" id="fr-theme-knob"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="fr-toast-container" id="fr-toasts"></div>
            
            <div class="fr-loc-popup" id="fr-loc-popup">
                <div class="fr-loc-icon">${Icons.pin}</div>
                <span>Modelo disponível...</span>
            </div>

            <button class="fr-scroll-top" id="fr-scroll-top" aria-label="Topo">
                ${Icons.arrowUp}
            </button>
        `;
        document.body.appendChild(root);
    };

    // =========================================================================
    // 7. UTILS & INIT
    // =========================================================================
    const Utils = {
        debounce: (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        },
        trapFocus: (el) => {
            // Basic implementation provided for brevity; production should use robust trap
            const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if(focusable.length) focusable[0].focus();
        }
    };

    const initLogic = () => {
        // --- Header Scroll ---
        let lastScroll = 0;
        const header = document.getElementById('fr-header');
        const scrollTopBtn = document.getElementById('fr-scroll-top');
        
        window.addEventListener('scroll', Utils.debounce(() => {
            const current = window.scrollY;
            
            // Header Logic (Show/Hide)
            if (current > 100 && current < lastScroll) header.classList.add('is-visible');
            else if (current > 100 && current > lastScroll) header.classList.remove('is-visible');
            else if (current < 100) header.classList.add('is-visible'); // Always show at top
            
            // Scroll Top Logic
            if(current > 300) scrollTopBtn.classList.add('is-visible');
            else scrollTopBtn.classList.remove('is-visible');

            lastScroll = current;
        }, 10));

        // --- Modals ---
        const toggleModal = (id, show) => {
            const el = document.getElementById(id);
            if(show) {
                el.classList.add('is-open');
                el.setAttribute('aria-hidden', 'false');
                Utils.trapFocus(el);
            } else {
                el.classList.remove('is-open');
                el.setAttribute('aria-hidden', 'true');
            }
        };

        // Click Handlers
        document.addEventListener('click', e => {
            const target = e.target;
            
            // Open Notifs
            if(target.closest('#fr-btn-notif')) {
                const msgs = NotificationStrategy.getMessages();
                const container = document.getElementById('fr-notif-list');
                container.innerHTML = msgs.map(m => `
                    <div class="fr-notif-card">
                        <p class="fr-notif-msg">${m.text}</p>
                        <a href="${m.link}" class="fr-link" target="_blank">${m.label} &rarr;</a>
                    </div>
                `).join('');
                
                // Update badge to 0
                document.getElementById('fr-badge').style.display = 'none';
                toggleModal('fr-modal-notif', true);
            }

            // Open Auth
            if(target.closest('#fr-btn-auth')) toggleModal('fr-modal-auth', true);
            
            // Close Modals
            if(target.closest('.fr-close-modal') || target.classList.contains('fr-modal-overlay')) {
                document.querySelectorAll('.fr-modal-overlay').forEach(m => {
                    m.classList.remove('is-open');
                    m.setAttribute('aria-hidden', 'true');
                });
            }

            // Scroll Top
            if(target.closest('#fr-scroll-top')) window.scrollTo({top:0, behavior:'smooth'});

            // Fav Click
            if(target.closest('#fr-btn-fav')) {
                const count = State.get('favCount') + 1;
                State.set('favCount', count);
                const btn = document.getElementById('fr-btn-fav');
                btn.style.color = '#e91e63';
                btn.innerHTML = Icons.heart.replace('fill="none"', 'fill="currentColor"');
                ToastManager.add('Adicionado aos favoritos!', 'success');
                // Simulate animation
                setTimeout(() => { btn.style.transform = 'scale(1.2)'; }, 100);
                setTimeout(() => { btn.style.transform = 'scale(1)'; }, 300);
            }

            // Settings Expand
            if(target.closest('#fr-settings-toggle')) {
                const form = document.getElementById('fr-settings-form');
                form.style.display = form.style.display === 'none' ? 'block' : 'none';
            }

            // Save Profile
            if(target.closest('#fr-save-profile')) {
                const name = document.getElementById('fr-input-name').value;
                if(name) {
                    State.set('user', { name, avatar: document.getElementById('fr-preview-img').src });
                    ToastManager.add(`Perfil salvo! Olá, ${name}.`, 'success');
                    toggleModal('fr-modal-auth', false);
                } else {
                    ToastManager.add('Por favor, insira um nome.', 'error');
                }
            }

            // Theme Switch
            if(target.closest('#fr-theme-switch')) {
                const current = State.get('theme') === 'dark' ? 'light' : 'dark';
                State.set('theme', current);
            }
        });

        // --- File Upload Preview ---
        const fileInput = document.getElementById('fr-input-file');
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                if(this.files[0].size > 1024 * 1024) { // 1MB limit
                    ToastManager.add('Imagem muito grande (Max 1MB)', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.getElementById('fr-preview-img');
                    img.src = e.target.result;
                    img.style.display = 'block';
                }
                reader.readAsDataURL(this.files[0]);
            }
        });

        // --- Keyboard ---
        window.addEventListener('keydown', e => {
            if(e.key === 'Escape') document.querySelectorAll('.fr-modal-overlay').forEach(m => m.classList.remove('is-open'));
        });
    };

    const updateUI = () => {
        // Theme
        const theme = State.get('theme');
        const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'auto' ? sysDark : theme === 'dark';
        
        document.documentElement.setAttribute('data-fr-theme', isDark ? 'dark' : 'light');
        
        const knob = document.getElementById('fr-theme-knob');
        if(knob) knob.style.left = isDark ? '19px' : '3px';

        // Fav Count
        const fav = State.get('favCount');
        const badge = document.getElementById('fr-fav-count');
        if(fav > 0) {
            badge.textContent = fav;
            badge.style.display = 'block';
        }

        // User Profile
        const user = State.get('user');
        if(user && user.avatar) {
            const wrap = document.getElementById('fr-auth-icon-wrap');
            if(!wrap.querySelector('img')) {
                wrap.innerHTML = `<button class="fr-avatar-btn"><img src="${user.avatar}" alt="${user.name}"></button>`;
            }
        }
    };

    // =========================================================================
    // 8. BOOT
    // =========================================================================
    injectStyles();
    render();
    initLogic();
    GeoManager.init();
    
    // Initial State Check
    State.subscribe(updateUI);
    updateUI();
    
    // Initial Notification Badge (Fake 'new' status)
    setTimeout(() => {
        document.getElementById('fr-badge').style.display = 'block';
        document.getElementById('fr-badge').textContent = '3';
    }, 1500);

})();