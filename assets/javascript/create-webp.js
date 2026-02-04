const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP() {
    const imageDir = './assets/images';
    const outputDir = './assets/images/webp';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        const files = fs.readdirSync(imageDir);
        
        console.log(`📁 Found ${files.length} files in ${imageDir}`);
        
        let convertedCount = 0;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

        for (const file of files) {
            const filePath = path.join(imageDir, file);
            const ext = path.extname(file).toLowerCase();
            
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const nameWithoutExt = path.parse(file).name;
                const outputPath = path.join(outputDir, `${nameWithoutExt}.webp`);
                
                console.log(`🔄 Converting: ${file}`);
                
                try {
                    await sharp(filePath)
                        .webp({ 
                            quality: 80,
                            effort: 6
                        })
                        .toFile(outputPath);
                    
                    convertedCount++;
                    console.log(`✅ Converted: ${file} → ${nameWithoutExt}.webp`);
                } catch (err) {
                    console.error(`❌ Error converting ${file}:`, err.message);
                }
            }
        }
        
        console.log(`\n🎉 Conversion complete!`);
        console.log(`✅ Converted ${convertedCount} images to WebP`);
        console.log(`📁 Output directory: ${outputDir}`);
        
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

convertToWebP();