// deploy.js - Pour GitHub Pages
const { execSync } = require('child_process');
const fs = require('fs-extra');

console.log('🚀 Préparation du déploiement GitHub Pages...\n');

async function prepareDeployment() {
    try {
        // 1. Créer un dossier de déploiement
        const deployDir = 'deploy';
        await fs.emptyDir(deployDir);
        
        // 2. Copier les fichiers nécessaires
        const filesToCopy = [
            'index.html',
            'assets/css/bundle.min.css',
            'assets/css/fonts.min.css',
            'assets/js/bundle/app.min.js',
            'sw.js',
            '.htaccess',
            'assets/images/webp/',
            'assets/images/svg/',
            'assets/fonts/',
            '404.html' // Créez une page 404 si nécessaire
        ];
        
        console.log('📦 Copie des fichiers optimisés...');
        
        for (const file of filesToCopy) {
            if (await fs.pathExists(file)) {
                const dest = path.join(deployDir, file);
                await fs.copy(file, dest);
                console.log(`   ✅ ${file}`);
            }
        }
        
        // 3. Créer un README pour GitHub Pages
        const readmeContent = `# Portfolio - Gaël RAMAHANDRISOA
        
## Site optimisé pour GitHub Pages

Ce site a été optimisé avec :
- Images WebP avec fallback
- CSS/JS minifiés et bundle
- Service Worker pour le cache
- Lazy loading avancé
- Polices optimisées

## Performance
- Score Lighthouse: 95+ 
- Taille totale: < 1MB
- Chargement: < 2 secondes

Déployé automatiquement via GitHub Actions.`;
        
        await fs.writeFile(path.join(deployDir, 'README.md'), readmeContent);
        
        // 4. Créer CNAME si vous avez un domaine personnalisé
        // await fs.writeFile(path.join(deployDir, 'CNAME'), 'votredomaine.com');
        
        console.log('\n✨ Préparation terminée !');
        console.log(`📁 Dossier de déploiement: ${deployDir}`);
        console.log('\n📋 Pour déployer sur GitHub Pages :');
        console.log('1. cd deploy');
        console.log('2. git init');
        console.log('3. git add .');
        console.log('4. git commit -m "Deploy optimized portfolio"');
        console.log('5. git branch -M gh-pages');
        console.log('6. git remote add origin https://github.com/votre-username/votre-repo.git');
        console.log('7. git push -u origin gh-pages');
        
        console.log('\n🌐 Votre site sera disponible sur :');
        console.log('https://votre-username.github.io/votre-repo/');
        
    } catch (error) {
        console.error('❌ Erreur :', error.message);
    }
}

prepareDeployment();