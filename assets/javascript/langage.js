// Language Switcher avec icône RemixIcon
document.addEventListener('DOMContentLoaded', () => {
    const langBtn   = document.getElementById('lang-toggle');
    const langMenu  = document.getElementById('lang-menu');
    const langOpts  = document.querySelectorAll('.lang-option');
    const langCurr  = document.querySelector('.lang-current');

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

    // Sélection langue
    langOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.dataset.lang;
            
            const flag = opt.textContent.trim(); 
            
            langCurr.textContent = flag;
            
            langOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            langMenu.classList.remove('show');
            langBtn.classList.remove('menu-open');
            
            localStorage.setItem('lang', lang);
            changeLanguage(lang);
        });
    });

    const saved = localStorage.getItem('lang') || 'fr';
    const active = document.querySelector(`.lang-option[data-lang="${saved}"]`);
    if (active) active.click();
});

function changeLanguage(lang) {
    console.log('Langue →', lang);
    
    document.querySelectorAll('[data-lang-fr][data-lang-en]').forEach(el => {
        el.textContent = lang === 'fr' 
            ? el.dataset.langFr 
            : el.dataset.langEn;
    });
    
    document.documentElement.lang = lang;
}