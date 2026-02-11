/**
 * Frame Menu - PROIBIDA COPIA OU REPRODUÇÃO SEM AUTORIZAÇÃO EXPRESSA DA PLATAFORMA FRAMEAG.COM E FRAME TECNOLOGIA LTDA
 * Architecture: State-Driven UI, Event Delegation, Adaptive UX
 * Features: Geo-Location, Smart Toasts (Swipe), Contextual Notifications, A11Y
 */
(function () {
    'use strict';

    // =========================================================================
    // 1. CONSTANTS, I18N & ASSETS
    // =========================================================================
    const CONSTANTS = {
        keys: {
            theme: 'fr_theme',
            fav: 'fr_fav',
            location: 'fr_loc_cache',
            userStats: 'fr_user_stats',
            userProfile: 'fr_user_profile'
        },
        api: {
            geo: 'https://ipwho.is/'
        },
        assets: {
            logo: 'https://framerusercontent.com/images/JaIvmSW2LTbs0XCR7tnpcmU8xA.png',
            font: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
        },
        ui: {
            maxNotifs: 3,
            toastDuration: 4000
        }
    };

    const I18N = {
        pt: {
            loadingLoc: 'Localizando...',
            locFallback: 'Disponível na sua região',
            locPrefix: 'Esta modelo está disponível em',
            dayGreeting: 'Vídeos quentinhos disponíveis 🔥',
            nightGreeting: 'Encontre modelos nesta noite 🔥',
            loginTitle: 'Acesse sua conta na Frame',
            loginDesc: 'Escolha como deseja continuar:',
            btnLogin: 'Entrar',
            btnRegister: 'Cadastrar',
            settingsTitle: 'Configurar conta',
            labelName: 'Seu nome de exibição',
            labelUser: 'Escolha seu user (@)',
            btnSave: 'Salvar meu perfil',
            premiumTease: 'Assinar Frame Premium',
            emptyNotif: 'Tudo livre por aqui.',
            toast: {
                favAdd: 'Modelo adicionada as favoritas',
                favRem: 'Modelo removida das favoritas',
                welcome: 'Bem-vindo de volta a Frame.',
                locSuccess: 'Localização atualizada.',
                error: 'Ocorreu um erro. Tente novamente.'
            }
        }
    };

    // =========================================================================
    // 2. STATE MANAGEMENT (Mini Store)
    // =========================================================================
    const Store = {
        state: {
            isFav: localStorage.getItem(CONSTANTS.keys.fav) === 'true',
            location: JSON.parse(localStorage.getItem(CONSTANTS.keys.location) || 'null'),
            stats: JSON.parse(localStorage.getItem(CONSTANTS.keys.userStats) || '{"chatClicks":0, "dismissToasts":0}'),
            profile: JSON.parse(localStorage.getItem(CONSTANTS.keys.userProfile) || '{"name":"", "handle":""}'),
            activeModal: null, // 'notifications', 'login-action', 'settings'
            timeOfDay: new Date().getHours() >= 6 && new Date().getHours() < 18 ? 'day' : 'night'
        },
        listeners: [],
        
        subscribe(fn) {
            this.listeners.push(fn);
        },
        
        setState(newState) {
            this.state = { ...this.state, ...newState };
            this.listeners.forEach(fn => fn(this.state));
            
            // Persistence logic
            if (newState.hasOwnProperty('isFav')) localStorage.setItem(CONSTANTS.keys.fav, this.state.isFav);
            if (newState.hasOwnProperty('stats')) localStorage.setItem(CONSTANTS.keys.userStats, JSON.stringify(this.state.stats));
            if (newState.hasOwnProperty('profile')) localStorage.setItem(CONSTANTS.keys.userProfile, JSON.stringify(this.state.profile));
            if (newState.hasOwnProperty('location')) localStorage.setItem(CONSTANTS.keys.location, JSON.stringify(this.state.location));
        },

        get() { return this.state; }
    };

    // =========================================================================
    // 3. SERVICES (Logic Layer)
    // =========================================================================
    const Services = {
        async fetchLocation() {
            // Return cached if fresh (less than 1 hour - simplified logic here, just checking existence)
            if (Store.get().location) return;

            try {
                const res = await fetch(CONSTANTS.api.geo);
                if (!res.ok) throw new Error();
                const data = await res.json();
                
                if (data.success) {
                    Store.setState({ location: { city: data.city, region: data.region_code } });
                }
            } catch (e) {
                console.warn('Frame: Geo API failed, using fallback.');
            }
        },

        getSmartNotifications() {
            const { timeOfDay, stats } = Store.get();
            const pool = [
                // 1. Time Based
                {
                    id: 'time-feat',
                    text: timeOfDay === 'day' ? I18N.pt.dayGreeting : I18N.pt.nightGreeting,
                    action: 'Ver catálogo',
                    url: 'https://frameag.com/models',
                    priority: 1
                },
                // 2. Feature Based (Dynamic)
                {
                    id: 'chat-feat',
                    text: stats.chatClicks > 3 ? 'Precisa de ajuda exclusiva? Fale conosco.' : 'Nova funcionalidade de Chat disponível.',
                    action: stats.chatClicks > 3 ? 'Chamar suporte' : 'Testar agora',
                    url: 'https://frameag.com/chat',
                    priority: 2
                },
                // 3. Context Based
                {
                    id: 'hotel-feat',
                    text: 'Conheça o Frame Hotels, sua experiência exclusiva em redes parceiras.',
                    action: 'Reservar agora',
                    url: 'https://www.frameag.com/hotels',
                    priority: 3
                },
                // 4. Fallback / Educational
                {
                    id: 'verify-feat',
                    text: 'Entenda tudo sobre verificação facial.',
                    action: 'Saber mais',
                    url: 'https://www.frameag.com/verificacao',
                    priority: 4
                }
            ];

            // Filter logic: Always show top 3 based on priority
            // In a real app, we would filter out "read" IDs here
            return pool.sort((a,b) => a.priority - b.priority).slice(0, CONSTANTS.ui.maxNotifs);
        },

        trackAction(type) {
            const stats = Store.get().stats;
            if (type === 'chat') stats.chatClicks++;
            if (type === 'dismiss') stats.dismissToasts++;
            Store.setState({ stats });
        }
    };

    // =========================================================================
    // 4. STYLES (CSS-in-JS)
    // =========================================================================
    const injectStyles = () => {
        const css = `
        :root {
            --fr-bg-dark: #121212;
            --fr-surface: #1E1E1E;
            --fr-surface-blur: rgba(30, 30, 30, 0.85);
            --fr-text: #ffffff;
            --fr-text-muted: #A0A0A0;
            --fr-border: rgba(255, 255, 255, 0.08);
            --fr-accent: #8E6E4A;
            --fr-accent-grad: linear-gradient(135deg, #8E6E4A, #C7AB8F);
            --fr-accent-hover: linear-gradient(135deg, #A4825D, #D5BEA3);
            --fr-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            --fr-success: #8E6E4A;
            --fr-error: #e74c3c;
            --fr-info: #3498db;
            --fr-z-nav: 99999;
        }

        /* RESET & BASE */
        .fr-widget { font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; color: var(--fr-text); }
        .fr-widget *, .fr-widget *::before, .fr-widget *::after { box-sizing: border-box; outline: none; }
        
        /* ICONS */
        .fr-icon { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

        /* HEADER (Always Dark Theme) */
        #fr-nav {
            position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
            width: 95%; max-width: 1280px;
            background: var(--fr-surface-blur); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border-radius: 0 0 24px 24px; padding: 12px 24px;
            display: flex; align-items: center; justify-content: space-between;
            box-shadow: var(--fr-shadow); border: 1px solid var(--fr-border); border-top: none;
            transition: top 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: var(--fr-z-nav);
        }
        #fr-nav.active { top: 0; }
        .fr-logo { width: 90px; height: auto; display: block; }
        .fr-actions { display: flex; align-items: center; gap: 20px; }
        
        .fr-btn-icon {
            background: none; border: none; cursor: pointer; padding: 0;
            color: var(--fr-text); transition: all 0.2s ease;
            position: relative; display: flex; align-items: center; justify-content: center;
        }
        .fr-btn-icon:hover { color: #fff; transform: translateY(-1px); }
        .fr-btn-icon:active { transform: translateY(1px); }
        
     .fr-dot {
    position: absolute;
    top: -6px;
    right: -6px;

    min-width: 18px;
    height: 18px;
    padding: 0 5px;

    background: var(--fr-accent);
    color: #fff;

    border-radius: 999px;
    border: 2px solid var(--fr-surface);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 10px;
    font-weight: 700;
    line-height: 1;

    opacity: 0;
    transform: scale(0.6);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    box-shadow: 0 0 0 rgba(142, 110, 74, 0.6);
}

.fr-dot.visible {
    opacity: 1;
    transform: scale(1);
    animation: fr-pulse 2.2s infinite;
}

@keyframes fr-pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(142, 110, 74, 0.5);
    }
    70% {
        box-shadow: 0 0 0 8px rgba(142, 110, 74, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(142, 110, 74, 0);
    }
}

        /* MODAL SYSTEM (Generic) */
        .fr-backdrop {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
            z-index: 100000; display: flex; opacity: 0; pointer-events: none;
            transition: opacity 0.3s ease;
            /* Layout specific to type */
        }
        .fr-backdrop.open { opacity: 1; pointer-events: auto; }
        
        /* Layout: Notifications (Top Right) */
        .fr-backdrop[data-mode="notifications"] { justify-content: flex-end; align-items: flex-start; padding: 80px 20px 0; }
        /* Layout: Center (Login/Settings) */
        .fr-backdrop[data-mode="login-action"], .fr-backdrop[data-mode="settings"] { justify-content: center; align-items: center; padding: 20px; }

        .fr-popup {
            background: var(--fr-surface); width: 100%; max-width: 380px;
            border-radius: 20px; padding: 24px;
            border: 1px solid var(--fr-border); box-shadow: var(--fr-shadow);
            transform: translateY(10px) scale(0.98); opacity: 0;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: none; /* Hidden by default */
        }
        
        .fr-backdrop.open .fr-popup { transform: translateY(0) scale(1); opacity: 1; display: block; }

        .fr-popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .fr-popup-header h2 { margin: 0; font-size: 18px; font-weight: 700; color: #fff; }
        
        .fr-close-btn { 
            background: rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; 
            border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s;
        }
        .fr-close-btn:hover { background: rgba(255,255,255,0.2); }

        /* LOCATION BLOCK */
        .fr-loc-block {
            display: flex; align-items: center; gap: 12px;
            background: rgba(142, 110, 74, 0.1); border: 1px solid rgba(142, 110, 74, 0.2);
            padding: 12px; border-radius: 12px; margin-bottom: 16px;
        }
        .fr-loc-icon { color: var(--fr-accent); width: 20px; height: 20px; flex-shrink: 0; }
        .fr-loc-text span { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; margin-bottom: 2px; }
        .fr-loc-text strong { display: block; font-size: 14px; font-weight: 600; color: #fff; }

        /* NOTIFICATIONS LIST */
        .fr-notif-item { 
            background: rgba(255,255,255,0.03); border: 1px solid var(--fr-border);
            padding: 16px; border-radius: 12px; margin-bottom: 12px;
            transition: background 0.2s;
        }
        .fr-notif-item:hover { background: rgba(255,255,255,0.06); }
        .fr-notif-text { font-size: 14px; color: #ddd; margin: 0 0 12px; line-height: 1.5; }
        
        /* PREMIUM BUTTONS */
        .fr-btn {
            width: 100%; padding: 12px; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer;
            border: none; transition: transform 0.2s, opacity 0.2s; text-align: center; text-decoration: none; display: inline-block;
        }
        .fr-btn:active { transform: scale(0.98); }
        .fr-btn-primary { background: var(--fr-accent-grad); color: #fff; box-shadow: 0 4px 15px rgba(142, 110, 74, 0.3); }
        .fr-btn-primary:hover { background: var(--fr-accent-hover); }
        
        .fr-btn-outline { background: transparent; border: 1px solid var(--fr-border); color: #fff; margin-top: 10px; }
        .fr-btn-outline:hover { border-color: #fff; }

        .fr-btn-small { padding: 8px 16px; width: auto; font-size: 12px; }

        /* ACTION POPUP (Login) */
        .fr-action-grid { display: flex; flex-direction: column; gap: 12px; }

        /* SETTINGS POPUP */
        .fr-input {
            width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--fr-border);
            color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 12px;
            font-size: 14px; transition: border-color 0.2s;
        }
        .fr-input:focus { border-color: var(--fr-accent); }
        .fr-premium-link {
            margin-top: 16px; padding: 12px; border-radius: 8px; background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
            border: 1px solid var(--fr-border); display: flex; align-items: center; gap: 10px;
            text-decoration: none; color: #fff; font-size: 13px; position: relative; overflow: hidden;
        }
        .fr-premium-link::after {
            content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shine 3s infinite;
        }
        @keyframes shine { 100% { left: 200%; } }

        /* TOASTS */
        .fr-toast-container {
            position: fixed; top: 20px; right: 20px; z-index: 100001;
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        }
        .fr-toast {
            background: var(--fr-surface); color: #fff; min-width: 280px; max-width: 340px;
            padding: 14px 20px; border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            border-left: 4px solid var(--fr-accent);
            font-size: 13px; font-weight: 500;
            transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
            pointer-events: auto; display: flex; align-items: center; justify-content: space-between;
            user-select: none; touch-action: pan-y;
        }
        .fr-toast.visible { transform: translateX(0); }
        .fr-toast.swiping { transition: none; }
        .fr-toast.success { border-left-color: var(--fr-success); }
        .fr-toast.error { border-left-color: var(--fr-error); }
        .fr-toast.info { border-left-color: var(--fr-info); }

        /* SCROLL TOP */
        .fr-scroll-top {
            position: fixed; bottom: 30px; right: 30px; width: 48px; height: 48px;
            background: var(--fr-accent-grad); color: #fff;
            border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; opacity: 0; transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 99990; border: 1px solid rgba(255,255,255,0.2);
        }
        .fr-scroll-top.visible { opacity: 1; transform: translateY(0); }
        .fr-scroll-top:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.5); }
        
        @media (max-width: 768px) {
            #fr-nav { width: 100%; border-radius: 0; border: none; border-bottom: 1px solid var(--fr-border); padding: 10px 16px; }
            .fr-backdrop[data-mode="notifications"] { padding: 0; align-items: flex-end; }
            .fr-popup { max-width: 100%; border-radius: 20px 20px 0 0; border-bottom: none; }
            .fr-scroll-top { bottom: 20px; right: 20px; width: 42px; height: 42px; }
        }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        
        // Font
        const link = document.createElement('link');
        link.href = CONSTANTS.assets.font;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    // =========================================================================
    // 5. DOM TEMPLATES
    // =========================================================================
    const Icons = {
        bell: '<svg class="fr-icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
        user: '<svg class="fr-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        heart: '<svg class="fr-icon" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
        chat: '<svg class="fr-icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
        mapPin: '<svg class="fr-loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        arrowUp: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>',
        crown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z"/></svg>'
    };

    const buildHTML = () => {
        return `
        <div class="fr-widget">
            <nav id="fr-nav">
                <img src="${CONSTANTS.assets.logo}" alt="Frame" class="fr-logo" />
                <div class="fr-actions">
                    <button class="fr-btn-icon" id="fr-btn-notif" aria-label="Notificações">${Icons.bell}<span class="fr-dot visible" id="fr-notif-badge">3</span></button>
                    <button class="fr-btn-icon" id="fr-btn-fav" aria-label="Favoritos">${Icons.heart}</button>
                    <a href="https://frameag.com/chat" class="fr-btn-icon" aria-label="Chat">${Icons.chat}</a>
                    <button class="fr-btn-icon" id="fr-btn-login" aria-label="Login">${Icons.user}</button>
                </div>
            </nav>

            <div id="fr-backdrop" class="fr-backdrop" aria-hidden="true">
                
                <div id="fr-view-notif" class="fr-popup" role="dialog" aria-modal="true">
                    <div class="fr-popup-header">
                        <h2>Notificações</h2>
                        <button class="fr-close-btn" aria-label="Fechar">${Icons.close}</button>
                    </div>
                    
                    <div id="fr-location-block" class="fr-loc-block">
                        ${Icons.mapPin}
                        <div class="fr-loc-text">
                            <span>${I18N.pt.locPrefix}</span>
                            <strong id="fr-loc-val">${I18N.pt.loadingLoc}</strong>
                        </div>
                    </div>

                    <div id="fr-notif-list"></div>
                </div>

                <div id="fr-view-action" class="fr-popup" role="dialog" aria-modal="true">
                    <div class="fr-popup-header">
                        <h2>${I18N.pt.loginTitle}</h2>
                        <button class="fr-close-btn">${Icons.close}</button>
                    </div>
                    <p style="margin-bottom:20px; color:var(--fr-text-muted); font-size:14px;">${I18N.pt.loginDesc}</p>
                    <div class="fr-action-grid">
                        <a href="https://www.frameag.com/login" class="fr-btn fr-btn-primary">${I18N.pt.btnLogin}</a>
                        <a href="https://www.frameag.com/cadastro" class="fr-btn fr-btn-outline">${I18N.pt.btnRegister}</a>
                        <button id="fr-btn-settings" style="background:none; border:none; color:var(--fr-text-muted); font-size:12px; margin-top:10px; cursor:pointer; text-decoration:underline;">${I18N.pt.settingsTitle}</button>
                    </div>
                </div>

                <div id="fr-view-settings" class="fr-popup" role="dialog" aria-modal="true">
                    <div class="fr-popup-header">
                        <h2>${I18N.pt.settingsTitle}</h2>
                        <button class="fr-close-btn">${Icons.close}</button>
                    </div>
                    
                    <input type="text" id="fr-input-name" class="fr-input" placeholder="${I18N.pt.labelName}">
                    <input type="text" id="fr-input-handle" class="fr-input" placeholder="${I18N.pt.labelUser}">
                    
                    <button id="fr-btn-save" class="fr-btn fr-btn-primary">${I18N.pt.btnSave}</button>
                    
                    <a href="https://www.frameag.com/premium" class="fr-premium-link">
                        ${Icons.crown}
                        <span>${I18N.pt.premiumTease}</span>
                    </a>
                </div>

            </div>

            <div id="fr-toasts" class="fr-toast-container"></div>

            <button id="fr-scroll-top" class="fr-scroll-top" aria-label="Topo">${Icons.arrowUp}</button>
        </div>
        `;
    };

    // =========================================================================
    // 6. UI LOGIC & INTERACTIONS
    // =========================================================================
    const UI = {
        elems: {},

        init() {
            document.body.insertAdjacentHTML('beforeend', buildHTML());
            this.bindElements();
            this.bindEvents();
            this.renderState(Store.get());
            
            // Subscribe to state changes
            Store.subscribe(this.renderState.bind(this));
            
            // Init Async Services
            Services.fetchLocation();
        },

        bindElements() {
            const $ = (id) => document.getElementById(id);
            this.elems = {
                nav: $('fr-nav'),
                backdrop: $('fr-backdrop'),
                popups: {
                    notifications: $('fr-view-notif'),
                    action: $('fr-view-action'),
                    settings: $('fr-view-settings')
                },
                notifList: $('fr-notif-list'),
                locVal: $('fr-loc-val'),
                btnFav: $('fr-btn-fav'),
                scrollTop: $('fr-scroll-top'),
                inputName: $('fr-input-name'),
                inputHandle: $('fr-input-handle')
            };
        },

        toggleModal(mode) { // mode: 'notifications', 'login-action', 'settings' or null
            const { backdrop, popups } = this.elems;
            
            if (!mode) {
                backdrop.classList.remove('open');
                backdrop.setAttribute('aria-hidden', 'true');
                setTimeout(() => {
                    Object.values(popups).forEach(el => el.style.display = 'none');
                    Store.setState({ activeModal: null });
                }, 300); // Wait transition
                return;
            }

            // Open logic
            Store.setState({ activeModal: mode });
            backdrop.setAttribute('data-mode', mode);
            
            // Hide all first
            Object.values(popups).forEach(el => el.style.display = 'none');
            
            // Show specific
            if (mode === 'notifications') {
                this.renderNotifications();
                popups.notifications.style.display = 'block';
            } else if (mode === 'login-action') {
                popups.action.style.display = 'block';
            } else if (mode === 'settings') {
                const p = Store.get().profile;
                this.elems.inputName.value = p.name || '';
                this.elems.inputHandle.value = p.handle || '';
                popups.settings.style.display = 'block';
            }

            // Force reflow for animation
            void backdrop.offsetWidth;
            backdrop.classList.add('open');
            backdrop.setAttribute('aria-hidden', 'false');
            
            // Focus trap (simple version)
            const closeBtn = popups[mode].querySelector('.fr-close-btn');
            if (closeBtn) closeBtn.focus();
        },

        renderNotifications() {
            const list = Services.getSmartNotifications();
            const container = this.elems.notifList;
            
            if (list.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:20px; opacity:0.6;">${I18N.pt.emptyNotif}</div>`;
                return;
            }

            container.innerHTML = list.map(n => `
                <div class="fr-notif-item">
                    <p class="fr-notif-text">${n.text}</p>
                    <a href="${n.url}" target="_blank" class="fr-btn fr-btn-primary fr-btn-small">${n.action}</a>
                </div>
            `).join('');
        },

        renderState(state) {
            // Update Fav Icon
            const favSvg = this.elems.btnFav.querySelector('svg');
            if (state.isFav) {
            favSvg.style.fill = 'var(--fr-accent)';
            favSvg.style.stroke = 'var(--fr-accent)';
            } else {
            favSvg.style.fill = 'none';
            favSvg.style.stroke = 'currentColor';
            }

            // Update Location Text
            if (state.location) {
                this.elems.locVal.textContent = `${state.location.city}, ${state.location.region}`;
            } else {
                this.elems.locVal.textContent = I18N.pt.locFallback;
            }
        },

        showToast(msg, type = 'info') {
            const container = document.getElementById('fr-toasts');
            const el = document.createElement('div');
            el.className = `fr-toast ${type}`;
            el.innerHTML = `<span>${msg}</span>`;
            
            // Adaptive UX: If user dismisses too many, stop showing info toasts
            if (type === 'info' && Store.get().stats.dismissToasts > 5) return;

            container.appendChild(el);
            requestAnimationFrame(() => el.classList.add('visible'));

            // Swipe Logic
            let startX = 0;
            el.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive: true});
            el.addEventListener('touchmove', e => {
                const diff = e.touches[0].clientX - startX;
                if (diff > 0) {
                    el.classList.add('swiping');
                    el.style.transform = `translateX(${diff}px)`;
                }
            }, {passive: true});
            el.addEventListener('touchend', e => {
                const diff = e.changedTouches[0].clientX - startX;
                if (diff > 100) {
                    remove();
                    Services.trackAction('dismiss');
                } else {
                    el.classList.remove('swiping');
                    el.style.transform = '';
                }
            });

            const remove = () => {
                el.classList.remove('visible');
                setTimeout(() => el.remove(), 400);
            };

            setTimeout(remove, CONSTANTS.ui.toastDuration);
        },

        bindEvents() {
            // Modal Triggers
            document.getElementById('fr-btn-notif').onclick = () => this.toggleModal('notifications');
            document.getElementById('fr-btn-login').onclick = () => this.toggleModal('login-action');
            document.getElementById('fr-btn-settings').onclick = () => this.toggleModal('settings');
            
            // Close Modals (Delegation)
            this.elems.backdrop.onclick = (e) => {
                if (e.target === this.elems.backdrop || e.target.closest('.fr-close-btn')) {
                    this.toggleModal(null);
                }
            };

            // Fav Toggle
            this.elems.btnFav.onclick = () => {
                const newVal = !Store.get().isFav;
                Store.setState({ isFav: newVal });
                this.showToast(newVal ? I18N.pt.toast.favAdd : I18N.pt.toast.favRem, 'success');
            };

            // Save Profile
            document.getElementById('fr-btn-save').onclick = () => {
                Store.setState({
                    profile: {
                        name: this.elems.inputName.value,
                        handle: this.elems.inputHandle.value
                    }
                });
                this.showToast('Perfil salvo com sucesso!', 'success');
                this.toggleModal(null);
            };

            // Scroll Logic
            window.addEventListener('scroll', () => {
                const y = window.scrollY;
                this.elems.nav.classList.toggle('active', y > 50);
                this.elems.scrollTop.classList.toggle('visible', y > 400);
            }, { passive: true });

            this.elems.scrollTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

            // Keyboard Escape
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.toggleModal(null);
            });
            
            // Track Chat Clicks
            document.querySelector('[href*="chat"]').addEventListener('click', () => Services.trackAction('chat'));
        }
    };

    // =========================================================================
    // 7. BOOTSTRAP
    // =========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { injectStyles(); UI.init(); });
    } else {
        injectStyles();
        UI.init();
    }

})();