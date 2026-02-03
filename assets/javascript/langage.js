// langage.js - Version avec transitions intégrées
document.addEventListener('DOMContentLoaded', () => {
    // ====================================== AJOUT DES STYLES CSS DIRECTEMENT =====================================
    const style = document.createElement('style');
    style.textContent = `
        .language-transition-element {
            transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out !important;
        }
        
        .language-fade-out {
            opacity: 0 !important;
            transform: translateY(10px) !important;
        }
        
        .language-fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .lang-current.animating {
            animation: flagSpin 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        @keyframes flagSpin {
            0% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(0) rotate(180deg);
                opacity: 0;
            }
            51% {
                transform: scale(0) rotate(180deg);
                opacity: 0;
            }
            100% {
                transform: scale(1) rotate(360deg);
                opacity: 1;
            }
        }
        
        body.language-changing {
            cursor: wait !important;
        }
        
        body.language-changing *:not(.lang-btn):not(.lang-option) {
            cursor: wait !important;
        }
        
        .language-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .language-transition-overlay.active {
            opacity: 1;
            pointer-events: all;
        }
        
        .language-wave {
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.6) 25%, 
                rgba(255, 255, 255, 0.9) 50%, 
                rgba(255, 255, 255, 0.6) 75%, 
                transparent 100%);
            z-index: 9999;
            pointer-events: none;
        }
        
        .language-wave.active {
            animation: waveAnimation 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes waveAnimation {
            0% {
                left: -100%;
                opacity: 0.8;
            }
            100% {
                left: 100%;
                opacity: 0;
            }
        }
        
        .lang-option.active {
            position: relative;
        }
        
        .lang-option.active::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 10%;
            width: 80%;
            border-radius: 2px;
            animation: activePulse 2s infinite;
        }
        
        @keyframes activePulse {
            0%, 100% {
                opacity: 0.7;
                transform: scaleX(1);
            }
            50% {
                opacity: 1;
                transform: scaleX(1.1);
            }
        }
        
        [data-key]:not(img):not(button):not(input):not(textarea) {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        img[data-key-alt] {
            transition: opacity 0.5s ease !important;
        }
        
        input[data-key-placeholder] {
            transition: border-color 0.3s ease, opacity 0.3s ease;
        }
        
        .lang-btn:hover .lang-current:not(.animating) {
            animation: gentlePulse 1s infinite;
        }
        
        @keyframes gentlePulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);
    // ====================================== FIN DES STYLES CSS =====================================

    const langBtn = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');
    const langOpts = document.querySelectorAll('.lang-option');
    const langCurr = document.querySelector('.lang-current');

    // État global des traductions
    let translations = {
        about: {},
        contact: {},
        home: {},
        navigation: {},
        portfolio: {},
        resume: {},
        services: {},
        skill: {},
        social: {},
        modal: {}
    };

    // Variables pour gérer les transitions
    let currentLang = localStorage.getItem('lang') || 'fr';
    let isTransitioning = false;

    // Créer les éléments d'animation
    function createTransitionElements() {
        // Overlay de fond
        const overlay = document.createElement('div');
        overlay.className = 'language-transition-overlay';
        document.body.appendChild(overlay);
        
        // Effet de vague
        const wave = document.createElement('div');
        wave.className = 'language-wave';
        document.body.appendChild(wave);
        
        return { overlay, wave };
    }

    // Animation de fade out
    function fadeOutTransition() {
        const elements = document.querySelectorAll('[data-key], [data-key-alt], [data-key-placeholder]');
        
        elements.forEach(el => {
            if (!el.classList.contains('language-transition-element')) {
                el.classList.add('language-transition-element');
            }
            el.classList.add('language-fade-out');
        });
        
        document.body.classList.add('language-changing');
        
        return new Promise(resolve => setTimeout(resolve, 200));
    }

    // Animation de fade in
    function fadeInTransition() {
        const elements = document.querySelectorAll('[data-key], [data-key-alt], [data-key-placeholder]');
        
        elements.forEach(el => {
            el.classList.remove('language-fade-out');
            el.classList.add('language-fade-in');
        });
        
        return new Promise(resolve => {
            setTimeout(() => {
                elements.forEach(el => {
                    el.classList.remove('language-fade-in');
                });
                document.body.classList.remove('language-changing');
                resolve();
            }, 300);
        });
    }

    // Animation du drapeau
    function animateFlag(newFlag) {
        langCurr.classList.add('animating');
        
        return new Promise(resolve => {
            setTimeout(() => {
                langCurr.textContent = newFlag;
                setTimeout(() => {
                    langCurr.classList.remove('animating');
                    resolve();
                }, 500);
            }, 250);
        });
    }

    // Effet de vague sur l'écran
    function playWaveAnimation() {
        const wave = document.querySelector('.language-wave');
        if (wave) {
            wave.classList.add('active');
            setTimeout(() => {
                wave.classList.remove('active');
            }, 800);
        }
    }

    // Charger toutes les traductions
    async function loadTranslations(lang) {
        const files = [
            'about', 'contact', 'home', 'navigation', 
            'portfolio', 'resume', 'services', 'skill',
            'social', 'modal'
        ];
        
        const promises = files.map(file => 
            fetch(`./assets/data/${file}.json`)
                .then(response => {
                    if (!response.ok) throw new Error(`Fichier ${file}.json non trouvé`);
                    return response.json();
                })
                .then(data => {
                    translations[file] = data[lang.toUpperCase()] || data[lang] || data.FR;
                })
                .catch(error => {
                    console.error(`Erreur chargement ${file}.json:`, error);
                    translations[file] = {};
                })
        );
        
        await Promise.all(promises);
    }

    // Appliquer les traductions avec animations
    async function applyTranslationsWithAnimation() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        try {
            // 1. Créer les éléments d'animation si nécessaire
            if (!document.querySelector('.language-transition-overlay')) {
                createTransitionElements();
            }
            
            // 2. Activer l'overlay
            const overlay = document.querySelector('.language-transition-overlay');
            if (overlay) overlay.classList.add('active');
            
            // 3. Animation de fade out
            await fadeOutTransition();
            
            // 4. Lancer l'effet de vague
            playWaveAnimation();
            
            // 5. Appliquer les nouvelles traductions
            applyTranslations();
            
            // 6. Animation de fade in
            await fadeInTransition();
            
            // 7. Désactiver l'overlay
            if (overlay) overlay.classList.remove('active');
            
        } catch (error) {
            console.error('Erreur lors de la transition:', error);
        } finally {
            isTransitioning = false;
        }
    }

    // Appliquer les traductions
    function applyTranslations() {
        // Traduire les éléments avec data-key
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.dataset.key;
            const keys = key.split('.');
            
            let value = translations;
            for (const k of keys) {
                value = value[k];
                if (value === undefined) {
                    console.warn(`Clé de traduction manquante: ${key}`);
                    value = '';
                    break;
                }
            }
            
            if (value !== undefined && value !== '') {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.hasAttribute('placeholder')) {
                        element.placeholder = value;
                    } else if (element.type === 'button' || element.type === 'submit') {
                        element.value = value;
                    }
                } else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
                    element.alt = value;
                } else {
                    element.textContent = value;
                }
            }
        });

        // Traduire les textes alternatifs d'images avec data-key-alt
        document.querySelectorAll('[data-key-alt]').forEach(img => {
            const key = img.dataset.keyAlt;
            const keys = key.split('.');
            
            let value = translations;
            for (const k of keys) {
                value = value[k];
                if (value === undefined) break;
            }
            
            if (value !== undefined) {
                img.alt = value;
            }
        });

        // Mettre à jour l'attribut lang du document
        document.documentElement.lang = currentLang;
    }

    // Gestionnaire de changement de langue avec animations
    async function changeLanguage(lang) {
        if (currentLang === lang || isTransitioning) return;
        
        console.log('Changement langue →', lang);
        
        try {
            // Charger les nouvelles traductions
            await loadTranslations(lang);
            
            // Appliquer avec animations
            await applyTranslationsWithAnimation();
            
            // Mettre à jour la langue courante
            currentLang = lang;
            
            // Stocker la langue sélectionnée
            localStorage.setItem('lang', lang);
            
            // Animer le drapeau
            const flag = lang === 'fr' ? '🇫🇷' : '🇬🇧';
            await animateFlag(flag);
            
            console.log('Traductions appliquées avec succès');
            
        } catch (error) {
            console.error('Erreur lors du changement de langue:', error);
        }
    }

    // Événements pour le sélecteur de langue
    langBtn.addEventListener('click', e => {
        e.stopPropagation();
        langMenu.classList.toggle('show');
        langBtn.classList.toggle('menu-open');
    });

    document.addEventListener('click', e => {
        if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
            langMenu.classList.remove('show');
            langBtn.classList.remove('menu-open');
        }
    });

    langMenu.addEventListener('click', e => {
        e.stopPropagation();
    });

    langOpts.forEach(opt => {
        opt.addEventListener('click', async () => {
            const lang = opt.dataset.lang;
            
            // Mettre à jour l'état visuel
            langOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            langMenu.classList.remove('show');
            langBtn.classList.remove('menu-open');
            
            // Changer la langue avec animations
            await changeLanguage(lang);
        });
    });

    // Initialisation au chargement
    async function init() {
        const savedLang = localStorage.getItem('lang') || 'fr';
        
        // Créer les éléments d'animation
        createTransitionElements();
        
        // Activer l'option correspondante
        const activeOpt = document.querySelector(`.lang-option[data-lang="${savedLang}"]`);
        if (activeOpt) {
            activeOpt.classList.add('active');
        }
        
        // Charger et appliquer les traductions (sans animation au chargement)
        await loadTranslations(savedLang);
        applyTranslations();
        
        // Mettre à jour le drapeau
        const flag = savedLang === 'fr' ? '🇫🇷' : '🇬🇧';
        langCurr.textContent = flag;
        
        currentLang = savedLang;
    }

    // Démarrer l'initialisation
    init();
});