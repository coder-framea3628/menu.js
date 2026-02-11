/**
 * Frame Widget 2.0 - High Performance Embed
 * Features: Dark Mode, A11Y, Persistent State, Stackable Toasts, Scroll Progress
 */
(function () {
    'use strict';

    // =========================================================================
    // 1. CONFIGURAÇÃO & ESTADO
    // =========================================================================
    const CONFIG = {
        themeKey: 'frame_theme',
        favKey: 'frame_is_favorite',
        readNotifsKey: 'frame_read_notifications',
        assets: {
            logo: 'https://framerusercontent.com/images/JaIvmSW2LTbs0XCR7tnpcmU8xA.png',
            notifIcon: 'https://framerusercontent.com/images/Yr7purGR3rArCX8H8FMYR7b40.png',
            font: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap'
        },
        notifications: [
            { id: 1, text: 'Desbloqueie todas as funcionalidades no Frame Premium.', action: 'Quero ser Premium', url: 'https://frameag.com/premium' },
            { id: 2, text: 'Temos vídeos quentinhos para você! 🔥', action: 'Ver catálogo', url: 'https://frameag.com/models' },
            { id: 3, text: 'Nova funcionalidade de chat disponível.', action: 'Testar agora', url: 'https://frameag.com/chat' }
        ]
    };

    const state = {
        isFav: localStorage.getItem(CONFIG.favKey) === 'true',
        readNotifs: JSON.parse(localStorage.getItem(CONFIG.readNotifsKey) || '[]'),
        scrollRaf: null
    };

    // =========================================================================
    // 2. CSS ENGINE (SCOPED & VARIAVEIS)
    // =========================================================================
    const injectStyles = () => {
        const css = `
        :root {
            --fr-bg: #f8f8f8;
            --fr-surface: rgba(255, 255, 255, 0.95);
            --fr-surface-blur: rgba(255, 255, 255, 0.8);
            --fr-text: #202020;
            --fr-text-muted: #666;
            --fr-border: rgba(0, 0, 0, 0.08);
            --fr-accent: #8E6E4A;
            --fr-accent-grad: linear-gradient(135deg, #8E6E4A, #D5BEA3);
            --fr-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            --fr-z-nav: 9999;
            --fr-z-overlay: 10000;
            --fr-z-toast: 10001;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --fr-bg: #121212;
                --fr-surface: rgba(32, 32, 32, 0.95);
                --fr-surface-blur: rgba(32, 32, 32, 0.8);
                --fr-text: #ffffff;
                --fr-text-muted: #aaa;
                --fr-border: rgba(255, 255, 255, 0.1);
                --fr-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            }
        }

        /* Base Reset para o Widget */
        .fr-widget *, .fr-widget *::before, .fr-widget *::after { box-sizing: border-box; font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; }
        
        /* Navigation */
        #fr-nav {
            position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
            width: 95%; max-width: 1280px;
            background: var(--fr-surface-blur); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border-radius: 0 0 24px 24px; padding: 12px 24px;
            display: flex; align-items: center; justify-content: space-between;
            box-shadow: var(--fr-shadow); border: 1px solid var(--fr-border); border-top: none;
            transition: top 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            z-index: var(--fr-z-nav);
        }
        #fr-nav.active { top: 0; }
        
        .fr-logo { width: 90px; height: auto; display: block; }
        
        .fr-actions { display: flex; align-items: center; gap: 20px; }
        
        .fr-btn-icon {
            background: none; border: none; cursor: pointer; padding: 0;
            width: 28px; height: 28px; position: relative;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s ease;
        }
        .fr-btn-icon:hover { transform: scale(1.1); }
        .fr-btn-icon svg { width: 100%; height: 100%; stroke: var(--fr-text); transition: stroke 0.3s; }
        .fr-btn-icon img { width: 100%; height: 100%; object-fit: contain; }
        
        /* Notif Dot */
        .fr-dot {
            position: absolute; top: -4px; right: -4px;
            width: 16px; height: 16px; background: var(--fr-accent-grad);
            color: #fff; font-size: 10px; font-weight: 700;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            opacity: 0; transform: scale(0); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .fr-dot.visible { opacity: 1; transform: scale(1); animation: fr-pulse 2s infinite; }
        
        /* Notifications Overlay */
        .fr-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
            z-index: var(--fr-z-overlay);
            display: flex; align-items: flex-start; justify-content: flex-end;
            padding: 80px 20px 20px;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .fr-overlay.open { opacity: 1; pointer-events: auto; }
        
        .fr-popup {
            background: var(--fr-surface); color: var(--fr-text);
            width: 100%; max-width: 360px; border-radius: 20px;
            padding: 24px; box-shadow: var(--fr-shadow); border: 1px solid var(--fr-border);
            transform: translateY(-20px); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            max-height: 80vh; overflow-y: auto;
        }
        .fr-overlay.open .fr-popup { transform: translateY(0); }
        
        .fr-popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .fr-popup-header h2 { margin: 0; font-size: 18px; font-weight: 700; }
        
        .fr-notif-list { display: flex; flex-direction: column; gap: 12px; }
        .fr-notif-item {
            background: rgba(127, 127, 127, 0.05); border-radius: 12px; padding: 16px;
            border: 1px solid var(--fr-border);
        }
        .fr-notif-text { font-size: 14px; margin: 0 0 10px; line-height: 1.5; }
        .fr-cta {
            background: var(--fr-accent-grad); color: #fff; border: none;
            width: 100%; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 13px;
            cursor: pointer; transition: opacity 0.2s;
        }
        .fr-cta:hover { opacity: 0.9; }
        .fr-empty-state { text-align: center; color: var(--fr-text-muted); font-size: 14px; padding: 20px; }
        .fr-mark-read { font-size: 12px; color: var(--fr-accent); background: none; border: none; cursor: pointer; text-decoration: underline; margin-top: 10px; width: 100%; }

        /* Favorite State */
        .fr-icon-fav.filled svg { fill: var(--fr-accent); stroke: var(--fr-accent); }

        /* Toasts Stack */
        .fr-toast-container {
            position: fixed; top: 20px; right: 20px; z-index: var(--fr-z-toast);
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        }
        .fr-toast {
            background: var(--fr-surface); color: var(--fr-text);
            padding: 12px 20px; border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-left: 4px solid var(--fr-accent);
            font-size: 14px; font-weight: 600;
            transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            pointer-events: auto; display: flex; align-items: center; gap: 10px;
        }
        .fr-toast.visible { transform: translateX(0); }

        /* Scroll Top with Progress */
        .fr-scroll-top {
            position: fixed; bottom: 30px; right: 30px; width: 48px; height: 48px;
            background: var(--fr-surface); border-radius: 50%;
            box-shadow: var(--fr-shadow); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transform: translateY(20px); transition: all 0.3s;
            z-index: var(--fr-z-nav);
        }
        .fr-scroll-top.visible { opacity: 1; transform: translateY(0); }
        .fr-scroll-top svg.progress-ring { position: absolute; top: 0; left: 0; transform: rotate(-90deg); width: 48px; height: 48px; pointer-events: none; }
        .fr-scroll-top circle { transition: stroke-dashoffset 0.1s; fill: transparent; stroke: var(--fr-accent); stroke-width: 3; }
        .fr-arrow-icon { width: 18px; height: 18px; fill: var(--fr-text); z-index: 2; }

        /* Animations */
        @keyframes fr-pulse { 0% { box-shadow: 0 0 0 0 rgba(142, 110, 74, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(142, 110, 74, 0); } 100% { box-shadow: 0 0 0 0 rgba(142, 110, 74, 0); } }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            #fr-nav { width: 100%; border-radius: 0; border: none; border-bottom: 1px solid var(--fr-border); padding: 10px 16px; }
            .fr-logo { width: 80px; }
            .fr-actions { gap: 16px; }
            .fr-overlay { padding: 0; align-items: flex-end; }
            .fr-popup { max-width: 100%; border-radius: 24px 24px 0 0; max-height: 70vh; }
            .fr-scroll-top { bottom: 20px; right: 20px; width: 42px; height: 42px; }
            .fr-scroll-top svg.progress-ring { width: 42px; height: 42px; }
        }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);

        // Load Font Async
        const link = document.createElement('link');
        link.href = CONFIG.assets.font;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    // =========================================================================
    // 3. HTML BUILDER (TEMPLATE LITERALS)
    // =========================================================================
    const buildHTML = () => {
        const unreadCount = CONFIG.notifications.filter(n => !state.readNotifs.includes(n.id)).length;
        
        return `
        <div class="fr-widget">
            <nav id="fr-nav" aria-label="Menu Principal Frame">
                <img src="${CONFIG.assets.logo}" alt="Frame Logo" class="fr-logo" />
                
                <div class="fr-actions">
                    <button class="fr-btn-icon" id="fr-btn-notif" aria-label="Notificações" aria-haspopup="true" aria-expanded="false">
                        <img src="${CONFIG.assets.notifIcon}" alt="" aria-hidden="true">
                        <span id="fr-badge" class="fr-dot ${unreadCount > 0 ? 'visible' : ''}">${unreadCount}</span>
                    </button>

                    <button class="fr-btn-icon fr-icon-fav ${state.isFav ? 'filled' : ''}" id="fr-btn-fav" aria-label="${state.isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" aria-pressed="${state.isFav}">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>

                    <a href="https://frameag.com/chat" target="_blank" class="fr-btn-icon" aria-label="Abrir Chat">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </a>

                    <a href="https://frameag.com/login" target="_blank" class="fr-btn-icon" aria-label="Login">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </a>
                </div>
            </nav>

            <div id="fr-overlay" class="fr-overlay" role="dialog" aria-modal="true" aria-labelledby="fr-notif-title">
                <div class="fr-popup" id="fr-popup">
                    <div class="fr-popup-header">
                        <h2 id="fr-notif-title">Notificações</h2>
                        <button class="fr-btn-icon" id="fr-close-notif" aria-label="Fechar">&times;</button>
                    </div>
                    <div id="fr-notif-container" class="fr-notif-list">
                        </div>
                    <button id="fr-mark-read" class="fr-mark-read">Marcar todas como lidas</button>
                </div>
            </div>

            <div id="fr-toasts" class="fr-toast-container" aria-live="polite"></div>

            <div id="fr-scroll-top" class="fr-scroll-top" aria-label="Voltar ao topo" role="button">
                <svg class="progress-ring" width="100%" height="100%">
                    <circle stroke="currentColor" stroke-width="3" fill="transparent" r="22" cx="24" cy="24" style="stroke-dasharray: 138.23; stroke-dashoffset: 138.23;"/>
                </svg>
                <svg class="fr-arrow-icon" viewBox="0 0 24 24"><path d="M12 5l7 7 -1.41 1.41L12 7.83l-5.59 5.58L5 12z"/></svg>
            </div>
        </div>
        `;
    };

    // =========================================================================
    // 4. UTILS & HELPERS
    // =========================================================================
    const Utils = {
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        createToast: (msg) => {
            const container = document.getElementById('fr-toasts');
            if (!container) return;

            const el = document.createElement('div');
            el.className = 'fr-toast';
            el.innerHTML = `<span>${msg}</span>`;
            
            container.appendChild(el);
            
            // Trigger animation
            requestAnimationFrame(() => el.classList.add('visible'));

            // Auto remove
            setTimeout(() => {
                el.classList.remove('visible');
                el.addEventListener('transitionend', () => el.remove());
            }, 3000);
        },
        updateBadge: () => {
            const unread = CONFIG.notifications.filter(n => !state.readNotifs.includes(n.id)).length;
            const badge = document.getElementById('fr-badge');
            if(badge) {
                badge.textContent = unread;
                badge.classList.toggle('visible', unread > 0);
            }
        }
    };

    // =========================================================================
    // 5. CORE LOGIC
    // =========================================================================
    const init = () => {
        injectStyles();
        document.body.insertAdjacentHTML('beforeend', buildHTML());

        // Elements
        const nav = document.getElementById('fr-nav');
        const overlay = document.getElementById('fr-overlay');
        const popup = document.getElementById('fr-popup');
        const notifContainer = document.getElementById('fr-notif-container');
        const scrollTopBtn = document.getElementById('fr-scroll-top');
        const progressCircle = scrollTopBtn.querySelector('circle');

        // --- Notification Logic ---
        const renderNotifications = () => {
            notifContainer.innerHTML = '';
            const unread = CONFIG.notifications.filter(n => !state.readNotifs.includes(n.id));
            
            if (unread.length === 0) {
                notifContainer.innerHTML = '<div class="fr-empty-state">Tudo limpo por aqui! ✨</div>';
                document.getElementById('fr-mark-read').style.display = 'none';
                return;
            }

            document.getElementById('fr-mark-read').style.display = 'block';
            unread.forEach(n => {
                const item = document.createElement('div');
                item.className = 'fr-notif-item';
                item.innerHTML = `
                    <p class="fr-notif-text">${n.text}</p>
                    <button class="fr-cta" data-url="${n.url}">${n.action}</button>
                `;
                notifContainer.appendChild(item);
            });

            // Bind actions safely
            notifContainer.querySelectorAll('.fr-cta').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    window.open(e.target.dataset.url, '_blank');
                });
            });
        };

        const toggleOverlay = (show) => {
            if (show) {
                renderNotifications();
                overlay.classList.add('open');
                overlay.setAttribute('aria-hidden', 'false');
                document.getElementById('fr-close-notif').focus();
            } else {
                overlay.classList.remove('open');
                overlay.setAttribute('aria-hidden', 'true');
            }
        };

        document.getElementById('fr-btn-notif').addEventListener('click', () => toggleOverlay(true));
        document.getElementById('fr-close-notif').addEventListener('click', () => toggleOverlay(false));
        overlay.addEventListener('click', (e) => { if(e.target === overlay) toggleOverlay(false); });
        
        // Mark all as read
        document.getElementById('fr-mark-read')?.addEventListener('click', () => {
            state.readNotifs = CONFIG.notifications.map(n => n.id);
            localStorage.setItem(CONFIG.readNotifsKey, JSON.stringify(state.readNotifs));
            Utils.updateBadge();
            renderNotifications();
            Utils.createToast('Todas as notificações marcadas como lidas.');
        });

        // --- Favorites Logic ---
        const favBtn = document.getElementById('fr-btn-fav');
        favBtn.addEventListener('click', () => {
            state.isFav = !state.isFav;
            favBtn.classList.toggle('filled', state.isFav);
            favBtn.setAttribute('aria-label', state.isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
            favBtn.setAttribute('aria-pressed', state.isFav);
            
            localStorage.setItem(CONFIG.favKey, state.isFav);
            Utils.createToast(state.isFav ? 'Adicionado aos Favoritos!' : 'Removido dos Favoritos.');
        });

        // --- Scroll & Scroll-to-Top Logic ---
        const circumference = 2 * Math.PI * 22; // r=22
        if(progressCircle) {
            progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            progressCircle.style.strokeDashoffset = circumference;
        }

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            // Nav Toggle
            nav.classList.toggle('active', scrollTop > 50);

            // Scroll Top & Progress
            if (scrollTop > 300) {
                scrollTopBtn.classList.add('visible');
                // Calculate progress
                const scrollPercent = scrollTop / docHeight;
                const offset = circumference - (scrollPercent * circumference);
                if(progressCircle) progressCircle.style.strokeDashoffset = offset;
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', () => {
            if (!state.scrollRaf) {
                state.scrollRaf = requestAnimationFrame(() => {
                    handleScroll();
                    state.scrollRaf = null;
                });
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // --- Keyboard / Accessibility ---
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                toggleOverlay(false);
                document.getElementById('fr-btn-notif').focus();
            }
        });

        // Initial check for scroll position
        handleScroll();
    };

    // =========================================================================
    // 6. BOOTSTRAP
    // =========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();