// langage.js - Version corrigée
document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');
    const langOpts = document.querySelectorAll('.lang-option');
    const langCurr = document.querySelector('.lang-current');

    // État global des traductions
    let translations = {};

    let currentLang = localStorage.getItem('lang') || 'fr';

    // Charger toutes les traductions
    async function loadTranslations(lang) {
        const files = [
            'about', 'contact', 'home', 'navigation',
            'portfolio', 'resume', 'services', 'skill',
            'social', 'modal'
        ];

        try {
            const promises = files.map(file =>
                fetch(`./assets/data/${file}.json`)
                    .then(response => {
                        if (!response.ok) throw new Error(`Fichier ${file}.json non trouvé`);
                        return response.json();
                    })
                    .then(data => {
                        // Utiliser la langue en majuscule
                        const langKey = lang.toUpperCase();
                        translations[file] = data[langKey] || data[lang] || data.FR || {};
                    })
                    .catch(error => {
                        console.error(`Erreur chargement ${file}.json:`, error);
                        translations[file] = {};
                    })
            );

            await Promise.all(promises);
        } catch (error) {
            console.error('Erreur générale de chargement:', error);
        }
    }

    // Fonction utilitaire améliorée pour accéder aux valeurs
    function getTranslationValue(key) {
        const keys = key.split('.');
        
        // Chercher dans tous les fichiers de traduction
        for (const file in translations) {
            let value = translations[file];
            let found = true;
            
            for (const k of keys) {
                if (value === undefined || value === null) {
                    found = false;
                    break;
                }
                
                // Gérer les indices de tableau
                if (!isNaN(k) && Array.isArray(value)) {
                    value = value[parseInt(k)];
                } else if (typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    found = false;
                    break;
                }
            }
            
            if (found && value !== undefined) {
                return value;
            }
        }
        
        // Si non trouvé, essayer avec une recherche moins stricte
        console.warn(`Clé non trouvée: ${key}, tentative de recherche alternative...`);
        
        // Essayer sans le préfixe du fichier
        const lastKey = keys[keys.length - 1];
        for (const file in translations) {
            if (translations[file][lastKey]) {
                return translations[file][lastKey];
            }
        }
        
        return undefined;
    }

    // Correction des clés problématiques
    function fixKeyIssues(key) {
        const keyMap = {
            // Section CV - problèmes identifiés
            'resume.degrees.title': 'resume.degrees.0.title',
            'resume.degrees.school': 'resume.degrees.0.school',
            'resume.degrees.description': 'resume.degrees.0.description',
            
            // Section Portfolio - problèmes identifiés
            'projects.name': 'portfolio.projects.0.name',
            'projects.type': 'portfolio.projects.0.type',
            'projets.link': 'portfolio.projects.0.link',
            
            // Section Skills - problèmes identifiés  
            'skills.section_title': 'skill.section_title',
            'skills.main_title': 'skill.main_title',
            'skills.description': 'skill.description',
            'skills.language_skills': 'skill.language_skills',
            'technical_skills': 'skill.technical_skills',
            'languages.name': 'skill.languages.0.name',
            'languages.level': 'skill.languages.0.level',
            'technologies.name': 'skill.technologies.0.name',
            'technologies.percentage': 'skill.technologies.0.percentage',
            
            // Section Contact - bouton manquant
            'contact.form.send': 'contact.form.send'
        };

        return keyMap[key] || key;
    }

    // Appliquer les traductions
    function applyTranslations() {
        console.log('Application des traductions pour:', currentLang, translations);

        // 1. D'abord les éléments avec data-key simples
        document.querySelectorAll('[data-key]').forEach(element => {
            let key = element.dataset.key;
            
            // Corriger les clés problématiques
            key = fixKeyIssues(key);
            
            const value = getTranslationValue(key);
            
            if (value === undefined) {
                console.warn(`Clé de traduction manquante: ${key} (original: ${element.dataset.key})`);
                return;
            }

            // Appliquer la traduction selon le type d'élément
            applyTranslationToElement(element, value);
        });

        // 2. Gérer les cas spéciaux pour les sections avec des tableaux
        
        // Section CV - Gérer les diplômes multiples (0, 1, 2)
        updateSectionWithArray('resume.degrees', 3, ['title', 'school', 'description']);
        
        // Section Services - Gérer les services (0, 1, 2, 3)
        updateSectionWithArray('services.services', 4, ['title', 'descriptionOne']);
        
        // Section Skills - Gérer les langues (0, 1)
        updateSectionWithArray('skill.languages', 2, ['name', 'level']);
        
        // Section Skills - Gérer les technologies (0-7)
        updateSectionWithArray('skill.technologies', 8, ['name', 'percentage']);
        
        // Section Portfolio - Gérer les projets (0-3)
        updateSectionWithArray('portfolio.projects', 4, ['name', 'type']);

        // Mettre à jour l'attribut lang du document
        document.documentElement.lang = currentLang;

        // Mettre à jour les drapeaux des boutons de langue
        updateLanguageButtons();
    }

    // Fonction pour mettre à jour les sections avec des tableaux
    function updateSectionWithArray(baseKey, count, subKeys) {
        for (let i = 0; i < count; i++) {
            subKeys.forEach(subKey => {
                const key = `${baseKey}.${i}.${subKey}`;
                const value = getTranslationValue(key);
                
                if (value) {
                    // Chercher tous les éléments avec cette clé
                    const elements = document.querySelectorAll(`[data-key*="${baseKey}.${i}.${subKey}"]`);
                    
                    elements.forEach(element => {
                        applyTranslationToElement(element, value);
                    });
                    
                    // Chercher aussi avec l'ancienne syntaxe (sans indice)
                    const oldKey = `${baseKey}.${subKey}`;
                    const oldElements = document.querySelectorAll(`[data-key="${oldKey}"]`);
                    
                    oldElements.forEach(element => {
                        // Vérifier si cet élément correspond à l'index actuel
                        const parent = element.closest('.service_box, .skill_circle, .education, .content_main1 > div, .content_main2 > div');
                        if (parent) {
                            const index = Array.from(parent.parentNode.children).indexOf(parent);
                            if (index === i) {
                                applyTranslationToElement(element, value);
                            }
                        }
                    });
                }
            });
        }
    }

    // Fonction pour appliquer une traduction à un élément
    function applyTranslationToElement(element, value) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.hasAttribute('placeholder')) {
                element.placeholder = value;
            } else if (element.type === 'submit' || element.type === 'button') {
                element.value = value;
            } else {
                element.value = value;
            }
        } else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
            element.alt = value;
        } else if (element.tagName === 'A' && element.hasAttribute('href')) {
            // Ne pas modifier les liens qui ont déjà un contenu spécifique
            if (!element.innerHTML.includes('<img') && !element.innerHTML.includes('<i>')) {
                element.textContent = value;
            }
        } else if (element.tagName === 'BUTTON') {
            // Pour les boutons, vérifier s'il y a un span à l'intérieur
            const span = element.querySelector('span');
            if (span) {
                span.textContent = value;
            } else {
                // Vérifier s'il y a du texte direct
                const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === 3);
                if (textNodes.length > 0) {
                    // Garder les éléments HTML (icônes) et remplacer seulement le texte
                    const htmlElements = Array.from(element.childNodes).filter(node => node.nodeType === 1);
                    element.innerHTML = '';
                    htmlElements.forEach(el => element.appendChild(el));
                    element.appendChild(document.createTextNode(value));
                } else {
                    element.textContent = value;
                }
            }
        } else if (element.tagName === 'LABEL') {
            element.textContent = value;
        } else {
            element.textContent = value;
        }
    }

    // Mettre à jour les boutons de langue
    function updateLanguageButtons() {
        const activeOpt = document.querySelector(`.lang-option[data-lang="${currentLang}"]`);
        const flag = currentLang === 'fr' ? '🇫🇷' : '🇬🇧';

        if (langCurr) {
            langCurr.textContent = flag;
        }

        if (activeOpt) {
            langOpts.forEach(opt => opt.classList.remove('active'));
            activeOpt.classList.add('active');
        }
    }

    // Gestionnaire de changement de langue
    async function changeLanguage(lang) {
        console.log('Changement langue →', lang);
        currentLang = lang;

        try {
            await loadTranslations(lang);
            applyTranslations();

            // Stocker la langue sélectionnée
            localStorage.setItem('lang', lang);

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
            langMenu.classList.remove('show');
            langBtn.classList.remove('menu-open');

            // Changer la langue
            await changeLanguage(lang);
        });
    });

    // Initialisation au chargement
    async function init() {
        console.log('Initialisation des traductions...');

        // Charger et appliquer les traductions
        await changeLanguage(currentLang);

        // Ajouter un délai pour s'assurer que tout est chargé
        setTimeout(() => {
            // Reappliquer les traductions au cas où des éléments seraient ajoutés dynamiquement
            applyTranslations();
        }, 1000);
    }

    // Démarrer l'initialisation
    init();
});