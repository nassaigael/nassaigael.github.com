// 

document.addEventListener('DOMContentLoaded', () => {
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

    let currentLang = localStorage.getItem('lang') || 'fr';

    // Gestionnaire de changement de langue
    async function changeLanguage(lang) {
        console.log('Changement langue →', lang);
        currentLang = lang;
        
        try {
            await loadTranslations(lang);
            applyTranslations();
            
            // Stocker la langue sélectionnée
            localStorage.setItem('lang', lang);
            
            // Mettre à jour le drapeau
            const flag = lang === 'fr' ? '🇫🇷' : '🇬🇧';
            langCurr.textContent = flag;
            
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
            
            // Changer la langue
            await changeLanguage(lang);
        });
    });

    // Initialisation au chargement
    async function init() {
        const savedLang = localStorage.getItem('lang') || 'fr';
        
        // Activer l'option correspondante
        const activeOpt = document.querySelector(`.lang-option[data-lang="${savedLang}"]`);
        if (activeOpt) {
            activeOpt.classList.add('active');
        }
        
        // Charger et appliquer les traductions
        await changeLanguage(savedLang);
    }

    // Démarrer l'initialisation
    init();
});