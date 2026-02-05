const { execSync } = require('child_process');

console.log('📦 Installation des dépendances d\'optimisation...\n');

try {
    const dependencies = [
        'csso',
        'uglify-js', 
        'fs-extra',
        'imagemin',
        'imagemin-webp',
        'imagemin-mozjpeg',
        'imagemin-pngquant'
    ];
    
    console.log('Installation des packages...');
    
    dependencies.forEach(pkg => {
        try {
            execSync(`npm list ${pkg}`, { stdio: 'ignore' });
            console.log(`✅ ${pkg} (déjà installé)`);
        } catch (e) {
            console.log(`📦 Installation de ${pkg}...`);
            execSync(`npm install ${pkg} --save-dev`, { stdio: 'inherit' });
        }
    });
    
    console.log('\n✨ Toutes les dépendances sont installées !');
    console.log('\nMaintenant exécutez :');
    console.log('node optimize-portfolio.js');
    
} catch (error) {
    console.error('❌ Erreur lors de l\'installation :', error.message);
}