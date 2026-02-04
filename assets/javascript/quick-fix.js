import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('./index.html', 'utf8');

html = html.replace(/srcset="src="/g, 'srcset="');

const fixes = [
    // Portfolio images
    {
        search: '<img src="./assets/images/ecrivia.png" alt=""',
        replace: '<img class="content-image" src="./assets/images/ecrivia.png" alt="food_app" data-key-alt="portfolio.alt.ecrivia"'
    },
    {
        search: '<img src="./assets/images/planifieo4.png" alt=""',
        replace: '<img class="content-image" src="./assets/images/planifieo4.png" alt="planifieo4" data-key-alt="portfolio.alt.planifieo"'
    },
    {
        search: '<img src="./assets/images/coca.jpeg" alt=""',
        replace: '<img class="content-image" src="./assets/images/coca.jpeg" alt="city_3Dview" data-key-alt="portfolio.alt.generative"'
    },
    {
        search: '<img src="./assets/images/fizanakara.png" alt=""',
        replace: '<img class="content-image" src="./assets/images/fizanakara.png" alt="content_img" data-key-alt="portfolio.alt.fizanakara"'
    },
    // Modal
    {
        search: '<img src="./assets/images/planifieo4.png" alt=""',
        replace: '<img class="pop-up-video" src="./assets/images/planifieo4.png" alt="planifieo4" data-key-alt="modal.alt.planifieo"'
    }
];

fixes.forEach(fix => {
    html = html.replace(fix.search, fix.replace);
});

html = html.replace(/<img((?!loading=)[^>]*)>/g, '<img$1 loading="lazy">');

writeFileSync('./index.html', html);
console.log('✅ HTML fixed successfully!');