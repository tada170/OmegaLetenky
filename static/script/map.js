let isMouseDown = false;
let startX, startY;
let isMouseMoving = false;
let scale = 1;
let selectedCities = new Set();
const selected = document.getElementById('selected-cities');

/**
 * Načte mapu z externího souboru SVG a inicializuje interakce s mapou.
 *
 * @returns {void} Funkce nevrací hodnotu. Načítá mapu a připraví interakce.
 */
async function loadMap() {
    const mapContainer = document.getElementById('map-container');
    const info = document.getElementById('info');
    const map = await loadSVGMap(mapContainer);
    initializeMapInteractions(map, info);
}

/**
 * Načte SVG soubor mapy z externího umístění.
 *
 * @param {HTMLElement} mapContainer - Element, do kterého bude mapa načtena.
 *
 * @returns {Promise<SVGElement>} Vracení elementu SVG mapy po načtení.
 */
async function loadSVGMap(mapContainer) {
    const response = await fetch('static/images/europe.svg');
    mapContainer.innerHTML = await response.text();
    return mapContainer.querySelector('svg');
}

/**
 * Inicializuje všechny interakce s mapou, jako je zoom, drag, hover a kliknutí na města.
 *
 * @param {SVGElement} map - SVG element mapy.
 * @param {HTMLElement} info - Element pro zobrazení informací o městě.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze nastaví interakce na mapě.
 */
function initializeMapInteractions(map, info) {
    setupZoom(map);
    setupDrag(map);
    setupCityHover(map, info);
    setupCityClick(map);
}

/**
 * Nastaví zoomování na mapě pomocí kolečka myši.
 *
 * @param {SVGElement} map - SVG element mapy.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze nastaví událost pro zoomování.
 */
function setupZoom(map) {
    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        adjustZoom(map, event.deltaY);
    });
}

/**
 * Upraví velikost a pozici mapy na základě deltaY kolečka myši.
 *
 * @param {SVGElement} map - SVG element mapy.
 * @param {number} deltaY - Změna pozice kolečka myši, podle které se mění zoom.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze upraví `viewBox` atribut mapy.
 */
function adjustZoom(map, deltaY) {
    scale = deltaY < 0 ? 0.9 : 1.1;

    console.log(map)
    const viewBox = map.getAttribute('viewBox').split(' ').map(Number);

    console.log(viewBox)
    const width = viewBox[2];
    const height = viewBox[3];

    const newWidth = width * scale;
    const newHeight = height * scale;
    const centerX = viewBox[0] + (width - newWidth) / 2;
    const centerY = viewBox[1] + (height - newHeight) / 2;

    map.setAttribute('viewBox', `${centerX} ${centerY} ${newWidth} ${newHeight}`);
}

/**
 * Nastaví interakce pro tahání mapy myší.
 *
 * @param {SVGElement} map - SVG element mapy.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze nastaví události pro dragování.
 */
function setupDrag(map) {
    map.addEventListener('mousedown', (event) => startDragging(event));
    map.addEventListener('mousemove', (event) => dragMap(event, map));
    map.addEventListener('mouseup', stopDragging);
    map.addEventListener('mouseleave', stopDragging);
}

/**
 * Inicializuje začátek dragování mapy při stisknutí tlačítka myši.
 *
 * @param {MouseEvent} event - Událost při stisknutí tlačítka myši.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze nastaví příznaky pro tahání mapy.
 */
function startDragging(event) {
    isMouseDown = true;
    startX = event.clientX;
    startY = event.clientY;
    isMouseMoving = false;
    event.target.style.cursor = 'grabbing';
}

/**
 * Upravuje pozici mapy během tahání na základě pohybu myši.
 *
 * @param {MouseEvent} event - Událost pohybu myši.
 * @param {SVGElement} map - SVG element mapy.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze upraví `viewBox` atribut mapy.
 */
function dragMap(event, map) {
    if (!isMouseDown) return;

    isMouseMoving = true;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    const viewBox = map.getAttribute('viewBox').split(' ').map(Number);
    const speedScale = viewBox[2] / 1000;

    viewBox[0] -= dx * speedScale;
    viewBox[1] -= dy * speedScale;
    map.setAttribute('viewBox', `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`);

    startX = event.clientX;
    startY = event.clientY;
}

/**
 * Ukončí tahání mapy po uvolnění tlačítka myši nebo opuštění mapy.
 *
 * @param {MouseEvent} event - Událost při uvolnění tlačítka myši nebo opuštění mapy.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze resetuje příznaky pro tahání mapy.
 */
function stopDragging(event) {
    isMouseDown = false;
    event.target.style.cursor = 'default';
}

/**
 * Nastaví interakce pro zobrazení informací o městě při najetí myši na mapu.
 *
 * @param {SVGElement} map - SVG element mapy.
 * @param {HTMLElement} info - Element pro zobrazení informací o městě.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze nastaví události pro hover.
 */
function setupCityHover(map, info) {
    map.querySelectorAll('path').forEach(path => {
        const city = path.getAttribute('zeme') || "Neznámá země";
        const capital = path.getAttribute('hlavni_mesto') || "Neznámé hlavní město";

        path.addEventListener('mouseover', () => showCityInfo(info, city, capital));
        path.addEventListener('mouseleave', () => clearCityInfo(info));
    });
}

/**
 * Zobrazí informace o městě (název města a hlavní město) při najetí myši.
 *
 * @param {HTMLElement} info - Element pro zobrazení informací o městě.
 * @param {string} city - Název města.
 * @param {string} capital - Hlavní město dané země.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze aktualizuje textový obsah elementu `info`.
 */
function showCityInfo(info, city, capital) {
    info.textContent = `${city} : ${capital}`;
}

/**
 * Vymaže zobrazené informace o městě při opuštění města myší.
 *
 * @param {HTMLElement} info - Element pro zobrazení informací o městě.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze resetuje textový obsah elementu `info`.
 */
function clearCityInfo(info) {
    info.textContent = 'Najetím myši zobrazíš hlavní město';
}

/**
 * Nastaví interakce pro kliknutí na město na mapě, aby se město vybralo nebo zrušilo výběr.
 *
 * @param {SVGElement} map - SVG element mapy.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze nastaví událost pro kliknutí na města.
 */
function setupCityClick(map) {
    map.querySelectorAll('path').forEach(path => {
        const cityInfo = getCityInfo(path);

        path.addEventListener('click', () => handleCityClick(path, cityInfo));
    });
}

/**
 * Získá informace o městě, jako je název země, města, zeměpisná šířka a délka.
 *
 * @param {SVGElement} path - Cesta, která reprezentuje město na mapě.
 *
 * @returns {Object} Vrací objekt s informacemi o městě.
 * @returns {string} return.country - Název země.
 * @returns {string} return.city - Název města.
 * @returns {string} return.latitude - Zeměpisná šířka hlavního města.
 * @returns {string} return.longitude - Zeměpisná délka hlavního města.
 */
function getCityInfo(path) {
    const country = path.getAttribute('zeme') || "Neznámá země";
    const city = path.getAttribute('hlavni_mesto') || "Neznámé hlavní město";
    const latitude = path.getAttribute('hlavni_mesto_latitude') || "N/A";
    const longitude = path.getAttribute('hlavni_mesto_longitude') || "N/A";

    return {
        country: country,
        city: city,
        latitude: latitude,
        longitude: longitude,
    };
}

/**
 * Zpracovává kliknutí na město. Město je buď vybráno nebo zrušeno.
 *
 * @param {SVGElement} path - Cesta reprezentující město na mapě.
 * @param {Object} cityInfo - Informace o městě.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze vybere nebo zruší výběr města.
 */
function handleCityClick(path, cityInfo) {
    if (isMouseMoving) return;

    if (!selectedCities.has(cityInfo)) {
        selectCity(path, cityInfo);
    } else {
        deselectCity(path, cityInfo);
    }
}

/**
 * Vybere město a přidá ho do seznamu vybraných měst.
 *
 * @param {SVGElement} path - Cesta reprezentující město na mapě.
 * @param {Object} cityInfo - Informace o městě.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze označí město jako vybrané a přidá ho do seznamu.
 */
function selectCity(path, cityInfo) {
    path.classList.add('selected');
    selectedCities.add(cityInfo);
    addCityToSelection(cityInfo);
}

/**
 * Zruší výběr města a odstraní ho ze seznamu vybraných měst.
 *
 * @param {SVGElement} path - Cesta reprezentující město na mapě.
 * @param {Object} cityInfo - Informace o městě.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze odstraní město z výběru.
 */
function deselectCity(path, cityInfo) {
    path.classList.remove('selected');
    selectedCities.delete(cityInfo);
    removeCityFromSelection(cityInfo);
}

/**
 * Přidá město do seznamu vybraných měst na stránce.
 *
 * @param {Object} cityInfo - Informace o městě, které bude přidáno do seznamu.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze přidá město do seznamu na stránce.
 */
function addCityToSelection(cityInfo) {
    const country = document.createElement("li");
    country.textContent = cityInfo.city;
    selected.appendChild(country);
}

/**
 * Odebere město ze seznamu vybraných měst na stránce.
 *
 * @param {Object} cityInfo - Informace o městě, které bude odstraněno z výběru.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze odstraní město z DOM seznamu.
 */
function removeCityFromSelection(cityInfo) {
    const items = selected.getElementsByTagName('li');
    for (let item of items) {
        if (item.textContent === cityInfo.city) {
            selected.removeChild(item);
            break;
        }
    }
}

loadMap();
