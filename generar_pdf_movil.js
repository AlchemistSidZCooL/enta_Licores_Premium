const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

const DIR = '/home/sidzcool/GeminiSolutions/01_Proyectos_Activos/Venta_Licores_Premium/img';

const licores = [
    { img: 'dom_perignon.png', name: 'Dom Pérignon Luminous 2015', type: 'Champagne LED', price: '220€', ref: '310€' },
    { img: 'don_julio.png', name: 'Don Julio Reposado', type: 'Tequila', price: '50€', ref: '60€' },
    { img: 'zacapa.png', name: 'Zacapa Centenario 23', type: 'Ron Gran Reserva', price: '45€', ref: '55€' },
    { img: 'moet.png', name: 'Moët & Chandon Rosé', type: 'Champagne Impérial', price: '45€', ref: '60€' },
    { img: 'belvedere.png', name: 'Belvedere Vodka', type: 'Vodka Super Premium', price: '33€', ref: '38€' },
    { img: 'old_parr.png', name: 'Grand Old Parr 12', type: 'Whisky Escocés', price: '30€', ref: '38€' },
    { img: 'brockmans.png', name: 'Brockmans Gin', type: 'Ginebra Premium', price: '28€', ref: '35€' },
    { img: 'martin_millers.png', name: 'Martin Miller\'s Gin', type: 'Ginebra', price: '22€', ref: '28€' },
    { img: 'flor_cana.png', name: 'Flor de Caña 7 Años', type: 'Ron', price: '16€', ref: '21€' },
    { img: 'bombay.png', name: 'Bombay Dry Gin', type: 'Ginebra', price: '12€', ref: '13€' },
    { img: 'beronia.png', name: 'Bodegas Beronia Rioja (x3)', type: 'Vino Tinto', price: '8€ /ud', ref: '9€' }
];

let itemsHtml = '';
for (let item of licores) {
    let imgPath = `file://${DIR}/${item.img}`;
    itemsHtml += `
    <div class="item">
        <div class="image-box">
            <img src="${imgPath}" alt="${item.name}">
        </div>
        <div class="details">
            <div class="title">${item.name}</div>
            <div class="subtitle">${item.type}</div>
            <div class="pricing">
                <span class="price-sale">${item.price}</span>
                <span class="price-ref">Antes: ${item.ref}</span>
            </div>
        </div>
    </div>
    `;
}

const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Outfit', sans-serif; 
            background-color: #0b090f; /* Dark luxury bg */
            background-image: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15), transparent 50%),
                              radial-gradient(circle at 50% 100%, rgba(80, 40, 120, 0.15), transparent 50%);
            color: #ffffff; 
            width: 480px; 
            margin: 0 auto;
        }
        
        .page { padding: 40px 25px; }
        
        .header {
            text-align: center;
            padding-bottom: 30px;
            margin-bottom: 35px;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: 0; left: 50%; transform: translateX(-50%);
            width: 150px; height: 2px;
            background: linear-gradient(90deg, transparent, #d4af37, transparent);
        }
        .header h1 { 
            font-family: 'Playfair Display', serif; 
            font-size: 38px; 
            color: #f3e5ab; 
            margin-bottom: 12px; 
            line-height: 1.15;
            letter-spacing: 1px;
        }
        .header p { 
            font-size: 16px; 
            color: #a0a0a0; 
            font-weight: 300;
            letter-spacing: 0.5px;
        }
        
        .grid { display: flex; flex-direction: column; gap: 20px; }
        
        .item {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 16px;
            padding: 16px;
            page-break-inside: avoid;
            position: relative;
            overflow: hidden;
        }
        .item::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 100%);
            z-index: 0;
        }
        
        .image-box {
            width: 110px; height: 130px;
            flex-shrink: 0; 
            background: #000;
            border-radius: 10px; margin-right: 20px;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.05);
            z-index: 1;
        }
        .image-box img { width: 100%; height: 100%; object-fit: cover; }
        
        .details { flex-grow: 1; z-index: 1; }
        .title { 
            font-family: 'Playfair Display', serif;
            font-size: 22px; font-weight: 600; color: #fff; 
            line-height: 1.2; margin-bottom: 6px; 
        }
        .subtitle { 
            font-size: 12px; color: #d4af37; 
            text-transform: uppercase; letter-spacing: 1.5px; 
            margin-bottom: 12px; font-weight: 600;
        }
        
        .pricing { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; }
        .price-sale { 
            font-family: 'Playfair Display', serif; 
            font-size: 30px; font-weight: 700; color: #d4af37; 
        }
        .price-ref { font-size: 14px; color: #777; text-decoration: line-through; }
        
        .lote-banner {
            margin-top: 45px;
            background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0.8) 100%);
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: #fff;
            padding: 35px 25px;
            border-radius: 16px;
            text-align: center;
            page-break-inside: avoid;
        }
        .lote-banner h2 { 
            font-family: 'Playfair Display', serif; 
            color: #f3e5ab; font-size: 28px; 
            margin-bottom: 15px; line-height: 1.2; 
        }
        .lote-banner p { font-size: 16px; margin-bottom: 20px; color: #b0b0b0; line-height: 1.5; font-weight: 300; }
        .lote-price { font-size: 46px; font-weight: 700; color: #d4af37; display: block; margin-bottom: 5px; font-family: 'Playfair Display', serif; }
        .lote-ref { font-size: 18px; color: #777; text-decoration: line-through; }
        
        .footer { text-align: center; margin-top: 40px; font-size: 16px; color: #888; padding-bottom: 20px; font-weight: 300;}
        .footer strong { color: #d4af37; font-size: 22px; display: block; margin-top: 8px; font-weight: 600;}
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>Colección de<br>Licores Premium</h1>
            <p>100% Originales y Precintadas<br>Entrega Exclusiva en Madrid Centro</p>
        </div>
        
        <div class="grid">
            ${itemsHtml}
        </div>
        
        <div class="lote-banner">
            <h2>Oferta Exclusiva Lote Completo</h2>
            <p>Adquiere la colección completa de 13 botellas ideal para eventos y hostelería (48% dto.)</p>
            <span class="lote-price">450€</span>
            <span class="lote-ref">Valor en tienda: 869€</span>
        </div>
        
        <div class="footer">
            <p>Contacto / Reservas vía WhatsApp: <br><strong>+34 641 868 620</strong></p>
        </div>
    </div>
</body>
</html>
`;

(async () => {
    fs.writeFileSync('temp_print.html', html);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + path.resolve('temp_print.html'), { waitUntil: 'networkidle0' });

    await page.pdf({
        path: 'Catalogo_Licores_Premium_Movil.pdf',
        width: '480px',
        height: '800px',
        printBackground: true,
        margin: { top: '0', bottom: '0', left: '0', right: '0' }
    });

    await browser.close();
    fs.unlinkSync('temp_print.html');
})();
