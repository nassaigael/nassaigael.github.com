// document.addEventListener('DOMContentLoaded', () => {
//     const langBtn   = document.getElementById('lang-toggle');
//     const langMenu  = document.getElementById('lang-menu');
//     const langOpts  = document.querySelectorAll('.lang-option');
//     const langCurr  = document.querySelector('.lang-current');

//     langBtn.addEventListener('click', e => {
//         e.stopPropagation();
//         langMenu.classList.toggle('show');
//         langBtn.classList.toggle('menu-open');
//     });

//     document.addEventListener('click', e => {
//         if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
//             langMenu.classList.remove('show');
//             langBtn.classList.remove('menu-open');
//         }
//     });

//     langMenu.addEventListener('click', e => {
//         e.stopPropagation();
//     });

//     langOpts.forEach(opt => {
//         opt.addEventListener('click', () => {
//             const lang = opt.dataset.lang;
            
//             const flag = opt.textContent.trim(); 
            
//             langCurr.textContent = flag;
            
//             langOpts.forEach(o => o.classList.remove('active'));
//             opt.classList.add('active');
            
//             langMenu.classList.remove('show');
//             langBtn.classList.remove('menu-open');
            
//             localStorage.setItem('lang', lang);
//             changeLanguage(lang);
//         });
//     });

//     const saved = localStorage.getItem('lang') || 'fr';
//     const active = document.querySelector(`.lang-option[data-lang="${saved}"]`);
//     if (active) active.click();
// });

// function changeLanguage(lang) {
//     console.log('Langue →', lang);
    
//     document.querySelectorAll('[data-lang-fr][data-lang-en]').forEach(el => {
//         el.textContent = lang === 'fr' 
//             ? el.dataset.langFr 
//             : el.dataset.langEn;
//     });
    
//     document.documentElement.lang = lang;
// }

document.addEventListener('DOMContentLoaded', async () => {
    // Éléments du sélecteur de langue
    const langBtn   = document.getElementById('lang-toggle');
    const langMenu  = document.getElementById('lang-menu');
    const langOpts  = document.querySelectorAll('.lang-option');
    const langCurr  = document.querySelector('.lang-current');

    // Cache des données de langue
    let languageData = {};

    // Fonction pour charger les données JSON
    async function loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${url}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`[ERREUR] Impossible de charger ${url} :`, error);
            return {};
        }
    }

    // Gestion ouverture/fermetre du menu langue
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

    langMenu.addEventListener('click', e => e.stopPropagation());

    /**
     * Fonction utilitaire pour obtenir une valeur d'un objet en utilisant un chemin de clés
     * Exemple: getValueByPath(data, 'home.section_title') ou getValueByPath(data, 'resume.degrees[0].title')
     */
    function getValueByPath(obj, path) {
        if (!obj || !path) return null;
        
        const keys = path.split('.');
        let value = obj;
        
        for (const key of keys) {
            if (!value) return null;
            
            // Gérer les tableaux comme resume.degrees[0]
            const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
            if (arrayMatch) {
                const arrayName = arrayMatch[1];
                const arrayIndex = parseInt(arrayMatch[2]);
                if (value[arrayName] && value[arrayName][arrayIndex]) {
                    value = value[arrayName][arrayIndex];
                } else {
                    return null;
                }
            } else {
                value = value[key];
            }
        }
        
        return value;
    }

    /**
     * Met à jour tout le contenu pour une langue donnée
     * @param {string} lang - 'FR' ou 'EN'
     */
    async function updateContent(lang) {
        lang = lang.toUpperCase();
        console.log(`→ Mise à jour pour la langue : ${lang}`);

        try {
            // Charger toutes les données de langue
            const sections = ['home', 'about', 'resume', 'services', 'skill', 'portfolio', 'contact', 'navigation'];
            
            // Charger toutes les sections en parallèle
            const loadPromises = sections.map(section => 
                loadJSON(`./assets/data/${section}.json`)
            );
            
            const allData = await Promise.all(loadPromises);
            
            // Créer un objet avec toutes les données
            const allTranslations = {};
            sections.forEach((section, index) => {
                if (allData[index] && allData[index][lang]) {
                    allTranslations[section] = allData[index][lang];
                }
            });
            
            console.log('Données chargées:', allTranslations);
            
            // 1. Mettre à jour la navigation
            if (allTranslations.navigation) {
                // Navigation fixe (PC)
                const navLinks = document.querySelectorAll('.link_name');
                const navKeys = ['home', 'about', 'resume', 'services', 'skill', 'portfolio', 'contact'];
                
                navLinks.forEach((link, index) => {
                    const key = navKeys[index];
                    if (allTranslations.navigation[key]) {
                        link.textContent = allTranslations.navigation[key];
                    }
                });
                
                // Navigation mobile
                const mobileSpans = document.querySelectorAll('.sidescreen_sub .icons2 span');
                mobileSpans.forEach((span, index) => {
                    const key = navKeys[index];
                    if (allTranslations.navigation[key]) {
                        span.textContent = allTranslations.navigation[key];
                    }
                });
            }
            
            // 2. Mettre à jour tous les éléments avec data-key
            const allElements = document.querySelectorAll('[data-key]');
            console.log(`Éléments à mettre à jour: ${allElements.length}`);
            
            allElements.forEach(element => {
                const dataKey = element.getAttribute('data-key');
                if (!dataKey) return;
                
                // Déterminer la section à partir de la data-key
                // Exemple: "home.section_title" → section = "home"
                const sectionMatch = dataKey.match(/^([a-zA-Z]+)\./);
                if (!sectionMatch) return;
                
                const section = sectionMatch[1];
                if (!allTranslations[section]) return;
                
                // Obtenir la valeur traduite
                const translatedValue = getValueByPath(allTranslations[section], dataKey.substring(section.length + 1));
                
                if (translatedValue && typeof translatedValue === 'string') {
                    // Mettre à jour l'élément selon son type
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translatedValue;
                    } else if (element.tagName === 'LABEL') {
                        element.textContent = translatedValue;
                    } else if (element.tagName === 'A' && element.hasAttribute('href')) {
                        // Pour les liens, garder le href mais mettre à jour le texte
                        element.textContent = translatedValue;
                    } else {
                        element.textContent = translatedValue;
                    }
                    
                    console.log(`✓ ${dataKey} → "${translatedValue}"`);
                }
            });
            
            // 3. Mettre à jour les éléments spéciaux qui ne sont pas couverts par data-key
            
            // Bouton "Recrutez-moi"
            if (allTranslations.home && allTranslations.home.hire_me) {
                const hireMeSpans = document.querySelectorAll('.hire_me span');
                hireMeSpans.forEach(span => {
                    span.textContent = allTranslations.home.hire_me;
                });
            }
            
            // Bouton "Télécharger le CV"
            if (allTranslations.home && allTranslations.home.download_cv) {
                const downloadSpans = document.querySelectorAll('.download_cv span');
                downloadSpans.forEach(span => {
                    if (!span.closest('.hire_me') && !span.closest('.view_project')) {
                        span.textContent = allTranslations.home.download_cv;
                    }
                });
            }
            
            // Bouton "Voir le projet" dans le popup
            const viewProjectSpan = document.querySelector('.view_project .view-text');
            if (viewProjectSpan) {
                viewProjectSpan.textContent = lang === 'FR' ? 'Voir le projet' : 'View project';
            }
            
            // Titre de la galerie dans le popup
            const galleryTitle = document.querySelector('.city_gallery');
            if (galleryTitle && allTranslations.portfolio && allTranslations.portfolio.projects && 
                allTranslations.portfolio.projects[2] && allTranslations.portfolio.projects[2].name) {
                galleryTitle.textContent = allTranslations.portfolio.projects[2].name;
            }
            
            // Mettre à jour la langue HTML
            document.documentElement.lang = lang.toLowerCase();
            console.log('✓ Traduction terminée');
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour du contenu:', error);
        }
    }

    // ────────────────────────────────────────────────
    // Changement de langue au clic
    langOpts.forEach(opt => {
        opt.addEventListener('click', async () => {
            const lang = opt.dataset.lang.toUpperCase();

            langCurr.textContent = opt.textContent.trim();

            langOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            langMenu.classList.remove('show');
            langBtn.classList.remove('menu-open');

            localStorage.setItem('lang', lang);
            await updateContent(lang);
        });
    });

    // ────────────────────────────────────────────────
    // Chargement initial
    let savedLang = localStorage.getItem('lang') || 'FR';
    savedLang = savedLang.toUpperCase();

    const activeBtn = document.querySelector(`.lang-option[data-lang="${savedLang.toLowerCase()}"]`);
    if (activeBtn) {
        // Initialiser sans cliquer (pour éviter les problèmes d'événements)
        activeBtn.classList.add('active');
        langCurr.textContent = activeBtn.textContent.trim();
        updateContent(savedLang);
    } else {
        await updateContent('FR');
    }
});

// Fonctions pour le menu hamburger
function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}