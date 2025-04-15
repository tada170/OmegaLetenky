# OmegaLetenky

## Popis projektu
Tento projekt je aplikace pro predikci cen letenek na základě vzdálenosti, počtu přestupů a dalších parametrů. Využívá strojové učení pro trénování modelu, který predikuje cenu na základě historických dat. Model je postaven na algoritmu Random Forest, který je optimalizován pro správnou predikci cen. Projekt zahrnuje také frontend pro vizualizaci dat a interakci s uživatelem.

## Požadavky
- Python 3 a více  

Pro instalaci požadovaných knihoven doporučujeme použít virtuální prostředí (například pomocí `venv` nebo `virtualenv`).

## Instalace a spuštění
1. vytvoření virtualního prostředí

```bash  
cd OmegaLetenka 
python3 -m venv venv
```  
2. aktivace virtualního prostředí
```bash
source venv/bin/activate
```
3. stahování závislostí
```bash
pip install -r requirements.txt
```

4. spuštění aplikace
```bash
python -m server  
```

## Konfigurace portu a IP adresy

Konfigurace portu a IP adresy se provádí v souboru `.env`. Tento soubor je nutné upravit podle vašich potřeb.

# Ovládání mapy

Pohyb mapy: Pomocí levého tlačítka myši můžete mapu posouvat. Stačí kliknout a držet levé tlačítko myši, a jakmile začnete pohybovat myší, mapa se začne pohybovat.

Zoomování: Pro zoomování (přiblížení nebo oddálení) použijte kolečko myši. Když kolečkem posouváte nahoru, mapa se přiblíží (zoom in), a když posouváte dolů, mapa se oddálí (zoom out).


# Seznam zdrojů

1. [SVG mapy Evropy (SimpleMaps)](https://simplemaps.com/resources/svg-europe)
2. [MDN Web Docs - SVG viewBox atribut](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox)
3. [Načítání SVG z externího souboru pomocí JavaScriptu (StackOverflow)](https://stackoverflow.com/questions/70401341/load-svg-from-file-using-javascript)
4. [Python Logging knihovna (Oficiální dokumentace)](https://docs.python.org/3/library/logging.html)
5. [2-opt algoritmus pro řešení problému obchodního cestujícího v Pythonu (StackOverflow)](https://stackoverflow.com/questions/53275314/2-opt-algorithm-to-solve-the-travelling-salesman-problem-in-python)
6. [2-opt algoritmus na Wikipedii](https://en.wikipedia.org/wiki/2-opt)
7. [Branch and Bound algoritmus na Wikipedii](https://en.wikipedia.org/wiki/Branch_and_bound)
8. [Vzdálenost na kouli: Haversinova formule (Esri)](https://community.esri.com/t5/coordinate-reference-systems-blog/distance-on-a-sphere-the-haversine-formula/ba-p/902128)
9. [Flask Quickstart (Oficiální dokumentace)](https://flask.palletsprojects.com/en/stable/quickstart/)


