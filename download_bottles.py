import os
import requests
from duckduckgo_search import DDGS

os.makedirs('img', exist_ok=True)

queries = {
    "dom_perignon": "Dom Perignon vintage champagne bottle white background png",
    "don_julio": "Don Julio Reposado tequila bottle white background png",
    "zacapa": "Ron Zacapa Centenario 23 bottle white background png",
    "moet": "Moet Chandon Imperial champagne bottle white background png",
    "belvedere": "Belvedere Vodka bottle white background png",
    "diplomatico": "Diplomatico Reserva Exclusiva rum bottle white background",
    "brockmans": "Brockmans Gin bottle white background",
    "martin_millers": "Martin Millers Gin bottle white background",
    "chivas": "Chivas Regal 12 Whisky bottle white background",
    "jack_daniels": "Jack Daniels No 7 Whiskey bottle white background",
    "bombay": "Bombay Sapphire Gin bottle white background",
    "variados": "group of liquor bottles white background",
    "beronia": "Bodegas Beronia red wine bottle white background"
}

ddgs = DDGS()

for filename, query in queries.items():
    print(f"Buscando: {query}")
    try:
        results = ddgs.images(query, max_results=1)
        if results:
            image_url = results[0]['image']
            print(f"Descargando de {image_url}")
            try:
                img_data = requests.get(image_url, timeout=5).content
                with open(f"img/{filename}.jpg", 'wb') as handler:
                    handler.write(img_data)
            except Exception as e:
                print(f"Error descargando {image_url}: {e}")
        else:
            print(f"No se encontraron imágenes para {query}")
    except Exception as e:
        print(f"Error buscando {query}: {e}")

print("Terminado.")
