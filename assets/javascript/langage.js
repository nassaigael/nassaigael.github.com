// Language Switcher avec icône RemixIcon
document.addEventListener('DOMContentLoaded', () => {
    const langBtn   = document.getElementById('lang-toggle');
    const langMenu  = document.getElementById('lang-menu');
    const langOpts  = document.querySelectorAll('.lang-option');
    const langCurr  = document.querySelector('.lang-current');

    // Toggle menu
    langBtn.addEventListener('click', e => {
        e.stopPropagation();
        langMenu.classList.toggle('show');
    });

    // Fermer au clic extérieur
    document.addEventListener('click', e => {
        if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
            langMenu.classList.remove('show');
        }
    });

    // Sélection langue
    langOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.dataset.lang;
            
            // Mise à jour visuelle
            langCurr.textContent = lang.toUpperCase();
            langOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            langMenu.classList.remove('show');
            
            // Sauvegarde + applique
            localStorage.setItem('lang', lang);
            changeLanguage(lang);
        });
    });

    // Charger langue précédente
    const saved = localStorage.getItem('lang') || 'fr';
    const active = document.querySelector(`.lang-option[data-lang="${saved}"]`);
    if (active) active.click();
});

// Fonction à compléter pour traduire tes textes
function changeLanguage(lang) {
    console.log('Langue →', lang);
    
    // Exemple rapide avec data-attributes
    document.querySelectorAll('[data-lang-fr][data-lang-en]').forEach(el => {
        el.textContent = lang === 'fr' 
            ? el.dataset.langFr 
            : el.dataset.langEn;
    });
}