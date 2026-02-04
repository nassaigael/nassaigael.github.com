// update-html-images.js
const fs = require('fs');
const path = require('path');

function updateHTMLWithWebP() {
    const htmlFile = './index.html'; // Votre fichier principal
    
    if (!fs.existsSync(htmlFile)) {
        console.log('❌ HTML file not found');
        return;
    }

    // Lire le contenu HTML
    let htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    console.log('🔄 Updating HTML with WebP support...');
    
    // Liste des images à mettre à jour
    const imageUpdates = [
        // Images principales
        { 
            original: 'src="./assets/images/autre.png"',
            webp: 'src="./assets/images/webp/autre.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/ecrivia.png"',
            webp: 'src="./assets/images/webp/ecrivia.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/planifieo4.png"',
            webp: 'src="./assets/images/webp/planifieo4.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/coca.jpeg"',
            webp: 'src="./assets/images/webp/coca.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/fizanakara.png"',
            webp: 'src="./assets/images/webp/fizanakara.webp"',
            picture: true 
        },
        
        // Gallery images
        { 
            original: 'src="./assets/images/gallery1.jpeg"',
            webp: 'src="./assets/images/webp/gallery1.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/gallery3.jpeg"',
            webp: 'src="./assets/images/webp/gallery3.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/gallery4.jpeg"',
            webp: 'src="./assets/images/webp/gallery4.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/gallery5.jpeg"',
            webp: 'src="./assets/images/webp/gallery5.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/gallery6.jpeg"',
            webp: 'src="./assets/images/webp/gallery6.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/gallery7.jpeg"',
            webp: 'src="./assets/images/webp/gallery7.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/gallery8.jpeg"',
            webp: 'src="./assets/images/webp/gallery8.webp"',
            picture: true 
        },
        { 
            original: 'src="./assets/images/gallery11.jpeg"',
            webp: 'src="./assets/images/webp/gallery11.webp"',
            picture: true 
        },
        
        // Compétences
        { 
            original: 'src="./assets/images/java.png"',
            webp: 'src="./assets/images/webp/java.webp"',
            picture: false // Simple remplacement
        },
        { 
            original: 'src="./assets/images/javascript.png"',
            webp: 'src="./assets/images/webp/javascript.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/postgresql.png"',
            webp: 'src="./assets/images/webp/postgresql.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/react.png"',
            webp: 'src="./assets/images/webp/react.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/tailwind.png"',
            webp: 'src="./assets/images/webp/tailwind.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/web.png"',
            webp: 'src="./assets/images/webp/web.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/figma.png"',
            webp: 'src="./assets/images/webp/figma.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/linux.png"',
            webp: 'src="./assets/images/webp/linux.webp"',
            picture: false 
        },
        
        // Services
        { 
            original: 'src="./assets/images/ux.png"',
            webp: 'src="./assets/images/webp/ux.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/prompt.png"',
            webp: 'src="./assets/images/webp/prompt.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/dev.png"',
            webp: 'src="./assets/images/webp/dev.webp"',
            picture: false 
        },
        { 
            original: 'src="./assets/images/marketing.png"',
            webp: 'src="./assets/images/webp/marketing.webp"',
            picture: false 
        },
    ];

    let updatedCount = 0;
    
    imageUpdates.forEach(update => {
        if (htmlContent.includes(update.original)) {
            if (update.picture) {
                // Remplacer par tag <picture> pour les images importantes
                const pictureTag = `
<picture>
    <source srcset="${update.webp}" type="image/webp">
    <source srcset="${update.original}" type="image/${update.original.includes('.png') ? 'png' : 'jpeg'}">
    <img ${update.original} alt="" loading="lazy">
</picture>`;
                
                // Remplacer l'ancienne balise img
                const imgRegex = new RegExp(`<img[^>]*${update.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`, 'g');
                htmlContent = htmlContent.replace(imgRegex, pictureTag);
                
                console.log(`✅ Added <picture> for: ${update.original}`);
            } else {
                // Simple remplacement pour les petites images
                htmlContent = htmlContent.replace(
                    new RegExp(update.original, 'g'),
                    update.webp
                );
                console.log(`✅ Updated: ${update.original} → ${update.webp}`);
            }
            updatedCount++;
        }
    });

    // Sauvegarder le HTML modifié
    fs.writeFileSync(htmlFile, htmlContent, 'utf8');
    
    console.log(`\n🎉 HTML updated successfully!`);
    console.log(`✅ ${updatedCount} images updated`);
    console.log(`📁 Backup saved as: ${htmlFile}.backup`);
    
    // Créer une backup
    fs.writeFileSync(`${htmlFile}.backup`, htmlContent, 'utf8');
}

// Exécuter
updateHTMLWithWebP();