const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { minify: minifyCSS } = require('csso');
const { minify: minifyJS } = require('uglify-js');

console.log('🚀 Début de l\'optimisation du portfolio...\n');

async function optimizePortfolio() {
    try {
        await createFolderStructure();
        
        await minifyAndBundleCSS();
        
        await minifyJavaScript();
        
        await optimizeFonts();
        
        await createServiceWorker();
        
        await updateHTML();
        
        await createHTAccess();
        
        await optimizePreloader();
        
        console.log('\n✨✨✨ OPTIMISATION TERMINÉE AVEC SUCCÈS ! ✨✨✨');
        console.log('\n📊 Résumé des optimisations :');
        console.log('✅ Structure de dossiers créée');
        console.log('✅ CSS minifié et bundle créé');
        console.log('✅ JavaScript minifié');
        console.log('✅ Polices optimisées (font-display: swap)');
        console.log('✅ Service Worker généré');
        console.log('✅ HTML mis à jour avec les nouveaux chemins');
        console.log('✅ Fichier .htaccess créé');
        console.log('✅ Preloader optimisé');
        
        console.log('\n🎯 Prochaines étapes :');
        console.log('1. Testez votre site localement');
        console.log('2. Vérifiez que toutes les images s\'affichent');
        console.log('3. Déployez sur GitHub Pages');
        console.log('4. Vérifiez le score Lighthouse');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'optimisation :', error.message);
    }
}

// ============================================
// FONCTIONS D'OPTIMISATION
// ============================================

async function createFolderStructure() {
    console.log('📁 Création de la structure de dossiers...');
    
    const folders = [
        'assets/css/minified',
        'assets/js/minified',
        'assets/js/bundle',
        'assets/fonts',
        'assets/images/optimized',
        'assets/images/webp',
        'assets/images/original',
        'assets/images/svg/minified',
        'sw' 
    ];
    
    for (const folder of folders) {
        await fs.ensureDir(folder);
        console.log(`   ✅ ${folder}`);
    }
}

async function minifyAndBundleCSS() {
    console.log('\n🎨 Minification et bundle CSS...');
    
    const cssFiles = [
        'assets/css/all.min.css',
        'assets/css/boostrap.min.css', 
        'assets/css/magnific-popup.min.css',
        'assets/css/style.css'
    ];
    
    let bundleContent = '';
    
    for (const file of cssFiles) {
        if (await fs.pathExists(file)) {
            const content = await fs.readFile(file, 'utf8');
            
            const minified = minifyCSS(content).css;
            
            const minFileName = path.join('assets/css/minified', path.basename(file, '.css') + '.min.css');
            await fs.writeFile(minFileName, minified);
            
            bundleContent += minified + '\n';
            
            console.log(`   ✅ ${path.basename(file)} → minifié`);
        }
    }
    
    bundleContent += `
/* Font display optimization */
@font-face {
    font-family: 'Kodchasan';
    font-display: swap;
}

* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
`;
    
    await fs.writeFile('assets/css/bundle.min.css', bundleContent);
    console.log('   ✅ Bundle CSS créé: assets/css/bundle.min.css');
    
    const originalSize = await getTotalSize(cssFiles);
    const minifiedSize = Buffer.byteLength(bundleContent, 'utf8');
    
    console.log(`   📊 Taille: ${formatBytes(originalSize)} → ${formatBytes(minifiedSize)} (${((1 - minifiedSize/originalSize) * 100).toFixed(1)}% réduit)`);
}

async function minifyJavaScript() {
    console.log('\n⚡ Minification JavaScript...');
    
    const jsFiles = [
        'assets/javascript/script.js',
        'assets/javascript/langage_circle.js',
        'assets/javascript/cursor.js',
        'assets/javascript/formulary.js',
        'assets/javascript/langage.js'
    ];
    
    let bundleContent = '';
    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;
    
    for (const file of jsFiles) {
        if (await fs.pathExists(file)) {
            const content = await fs.readFile(file, 'utf8');
            totalOriginalSize += Buffer.byteLength(content, 'utf8');
            
            try {
                const result = minifyJS(content, {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        dead_code: true
                    },
                    mangle: {
                        toplevel: true
                    },
                    output: {
                        comments: false
                    }
                });
                
                if (result.error) {
                    console.log(`   ⚠️  ${path.basename(file)}: ${result.error.message}`);
                    bundleContent += content + '\n';
                } else {
                    const minified = result.code;
                    totalMinifiedSize += Buffer.byteLength(minified, 'utf8');
                    
                    const minFileName = path.join('assets/js/minified', path.basename(file, '.js') + '.min.js');
                    await fs.writeFile(minFileName, minified);
                    
                    bundleContent += minified + '\n';
                    console.log(`   ✅ ${path.basename(file)} → minifié`);
                }
            } catch (error) {
                console.log(`   ⚠️  Erreur minification ${path.basename(file)}: ${error.message}`);
                bundleContent += content + '\n';
            }
        }
    }
    
    const lazyLoadScript = `
// Lazy loading avancé
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = [].slice.call(document.querySelectorAll('img[data-src], iframe[data-src]'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyElement = entry.target;
                    lazyElement.src = lazyElement.dataset.src;
                    lazyElement.classList.add('loaded');
                    lazyImageObserver.unobserve(lazyElement);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback pour les vieux navigateurs
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
        });
    }
});

// Optimisation du cursor (30fps au lieu de 60fps)
if (document.querySelector('.cursor')) {
    let cursorRAF;
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorRAF) cancelAnimationFrame(cursorRAF);
        
        setTimeout(function() {
            cursorRAF = requestAnimationFrame(function() {
                const cursor = document.querySelector('.cursor');
                if (cursor) {
                    cursor.style.left = mouseX + 'px';
                    cursor.style.top = mouseY + 'px';
                }
            });
        }, 32); // ≈30fps
    });
}
`;
    
    bundleContent += lazyLoadScript;
    
    await fs.writeFile('assets/js/bundle/app.min.js', bundleContent);
    console.log('   ✅ Bundle JS créé: assets/js/bundle/app.min.js');
    
    console.log(`   📊 Taille JS: ${formatBytes(totalOriginalSize)} → ${formatBytes(totalMinifiedSize)} (${((1 - totalMinifiedSize/totalOriginalSize) * 100).toFixed(1)}% réduit)`);
}

async function optimizeFonts() {
    console.log('\n🔤 Optimisation des polices...');
    
    const fontsCSS = `
/* Kodchasan - Subset pour le français */
@font-face {
    font-family: 'Kodchasan';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('https://fonts.googleapis.com/css2?family=Kodchasan:wght@400&display=swap&subset=latin-ext&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%C3%A0%C3%A2%C3%A9%C3%A8%C3%AA%C3%AF%C3%AE%C3%B4%C3%B9%C3%BB%C3%A7.%2C%3A%3B%21%3F%27%22%28%29%5B%5D%7B%7D%2F%5C%2B-%3D_%40%23%24%25%5E%26%2A');
}

@font-face {
    font-family: 'Kodchasan';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('https://fonts.googleapis.com/css2?family=Kodchasan:wght@600&display=swap&subset=latin-ext&text=Ga%C3%ABlRAMAHANDRISOA%C3%80PROPOSD%C3%89VELOPPEURWEBSP%C3%89CIALISTECOMP%C3%89TENCESPORTFOLIOSERVICESCONTACT');
}

/* Fallback system fonts */
body {
    font-family: 'Kodchasan', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
`;
    
    await fs.writeFile('assets/css/fonts.min.css', fontsCSS);
    console.log('   ✅ Polices optimisées avec font-display: swap');
}

async function createServiceWorker() {
    console.log('\n⚙️ Création du Service Worker...');
    
    const swContent = `
const CACHE_NAME = 'portfolio-v1.0.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './assets/css/bundle.min.css',
    './assets/js/bundle/app.min.js',
    './assets/css/fonts.min.css',
    './assets/images/webp/autre.webp',
    './assets/images/svg/home.svg',
    './assets/images/svg/about.svg',
    './assets/images/svg/resume.svg',
    './assets/images/svg/services.svg',
    './assets/images/svg/skills.svg',
    './assets/images/svg/portfolio.svg',
    './assets/images/svg/contact.svg'
];

// Installation
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Mise en cache des assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activation
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Suppression ancien cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch avec cache puis réseau
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non-GET et certaines URLs
    if (event.request.method !== 'GET' || 
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('analytics')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then(response => {
                        // Ne mettre en cache que les réponses valides
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('Fetch failed; returning offline page', error);
                        // Vous pourriez retourner une page offline ici
                    });
            })
    );
});
`;
    
    await fs.writeFile('sw.js', swContent);
    console.log('   ✅ Service Worker créé: sw.js');
}

async function updateHTML() {
    console.log('\n📄 Mise à jour du HTML...');
    
    let html = await fs.readFile('index.html', 'utf8');
    
    html = html.replace(
        /<link rel="stylesheet" href="\.\/assets\/css\/[^"]+"[^>]*>/g,
        ''
    );
    
    const cssBundleTag = `
    <!-- CSS Bundle (optimisé) -->
    <link rel="stylesheet" href="./assets/css/bundle.min.css">
    <link rel="stylesheet" href="./assets/css/fonts.min.css">`;
    
    html = html.replace('</head>', cssBundleTag + '\n    </head>');
    
    const scriptTagsToRemove = [
        'assets/javascript/jquery.min.js',
        'assets/javascript/magnific-popup.min.js',
        'assets/javascript/langage_circle.js',
        'assets/javascript/cursor.js',
        'assets/javascript/bootstrap.bundle.min.js',
        'assets/javascript/slick.min.js',
        'assets/javascript/hexagon_animation/particles.min.js',
        'assets/javascript/spider_animation/spider_animation.js',
        'assets/javascript/script.js',
        'assets/javascript/formulary.js',
        'assets/javascript/langage.js'
    ];
    
    scriptTagsToRemove.forEach(script => {
        const regex = new RegExp(`<script[^>]*src=["'][^"']*${script}[^"']*["'][^>]*><\\/script>`, 'g');
        html = html.replace(regex, '');
    });
    
    const jsBundleTag = `
    <!-- JS Bundle (optimisé) -->
    <script src="./assets/js/bundle/app.min.js" defer></script>
    
    <!-- Service Worker Registration -->
    <script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
    </script>`;
    
    html = html.replace('</body>', jsBundleTag + '\n    </body>');
    
    const preloadTags = `
    <!-- Preload critical fonts -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Kodchasan:wght@400&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kodchasan:wght@400&display=swap"></noscript>`;
    
    html = html.replace('</head>', preloadTags + '\n    </head>');
    
    html = html.replace(/<img(?![^>]*loading=)([^>]*)>/g, '<img$1 loading="lazy">');
    
    html = html.replace(
        /<iframe([^>]*)src="([^"]+)"([^>]*)>/g,
        '<iframe$1src="about:blank" data-src="$2"$3 loading="lazy">'
    );
    
    const metaTags = `
    <!-- Performance optimizations -->
    <meta http-equiv="Cache-Control" content="public, max-age=31536000">
    <meta name="theme-color" content="#000000">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`;
    
    html = html.replace('</head>', metaTags + '\n    </head>');
    
    await fs.writeFile('index.html', html);
    console.log('   ✅ HTML mis à jour avec optimisations');
}

async function createHTAccess() {
    console.log('\n📝 Création du fichier .htaccess...');
    
    const htaccess = `
# Optimisation pour GitHub Pages (via Cloudflare)
# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml
    AddOutputFilterByType DEFLATE text/css text/javascript application/javascript application/json
    AddOutputFilterByType DEFLATE application/xml application/xhtml+xml application/rss+xml
    AddOutputFilterByType DEFLATE application/x-font-ttf application/x-font-opentype
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Cache headers
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # CSS, JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # Fonts
    ExpiresByType application/x-font-ttf "access plus 1 year"
    ExpiresByType application/x-font-opentype "access plus 1 year"
    ExpiresByType application/x-font-woff "access plus 1 year"
    
    # HTML
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Error pages
ErrorDocument 404 /404.html

# Redirects (si nécessaire)
# Redirect 301 /old-page.html /new-page.html
`;
    
    await fs.writeFile('.htaccess', htaccess);
    console.log('   ✅ Fichier .htaccess créé');
}

async function optimizePreloader() {
    console.log('\n🌀 Optimisation du Preloader...');
    
    const preloaderOptimization = `
// Preloader optimisé
document.addEventListener('DOMContentLoaded', function() {
    const loaderWrapper = document.getElementById('loader-wrapper');
    
    if (!loaderWrapper) return;
    
    // Cacher le preloader après 1.5s max
    const maxLoadTime = 1500;
    let loadTimer = setTimeout(function() {
        hidePreloader();
    }, maxLoadTime);
    
    // Cacher quand la page est vraiment prête
    window.addEventListener('load', function() {
        clearTimeout(loadTimer);
        setTimeout(hidePreloader, 300);
    });
    
    function hidePreloader() {
        if (loaderWrapper) {
            loaderWrapper.classList.add('loaded');
            setTimeout(function() {
                if (loaderWrapper && loaderWrapper.parentNode) {
                    loaderWrapper.style.display = 'none';
                    // Libérer la mémoire
                    loaderWrapper.innerHTML = '';
                }
            }, 800);
        }
    }
    
    // Animation de chargement optimisée
    const progressBar = document.querySelector('.circle-progress');
    if (progressBar) {
        let progress = 0;
        const interval = setInterval(function() {
            progress += 10;
            if (progress <= 100) {
                progressBar.style.strokeDashoffset = 100 - progress;
            } else {
                clearInterval(interval);
            }
        }, 50);
    }
});
`;
    
    const bundlePath = 'assets/js/bundle/app.min.js';
    if (await fs.pathExists(bundlePath)) {
        let bundleContent = await fs.readFile(bundlePath, 'utf8');
        bundleContent = preloaderOptimization + bundleContent;
        await fs.writeFile(bundlePath, bundleContent);
        console.log('   ✅ Preloader optimisé dans le bundle');
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

async function getTotalSize(files) {
    let total = 0;
    for (const file of files) {
        if (await fs.pathExists(file)) {
            const stats = await fs.stat(file);
            total += stats.size;
        }
    }
    return total;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ============================================
// EXÉCUTION PRINCIPALE
// ============================================

try {
    require('csso');
    require('uglify-js');
    require('fs-extra');
    
    optimizePortfolio();
    
} catch (error) {
    console.log('\n📦 Installation des dépendances nécessaires...');
    console.log('Veuillez exécuter :');
    console.log('npm install csso uglify-js fs-extra');
    console.log('\nEnsuite : node optimize-portfolio.js');
}