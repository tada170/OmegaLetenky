let isMouseDown = false;
let startX, startY;
let isMouseMoving = false;
let scale = 1;
let selectedCities = new Set();
const selected = document.getElementById('selected-cities');

async function loadMap() {
    const mapContainer = document.getElementById('map-container');
    const info = document.getElementById('info');
    const map = await loadSVGMap(mapContainer);
    initializeMapInteractions(map, info);
}

async function loadSVGMap(mapContainer) {
    const response = await fetch('static/images/europe.svg');
    mapContainer.innerHTML = await response.text();
    return mapContainer.querySelector('svg');
}

function initializeMapInteractions(map, info) {
    setupZoom(map);
    setupDrag(map);
    setupCityHover(map, info);
    setupCityClick(map);
}

function setupZoom(map) {
    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        adjustZoom(map, event.deltaY);
    });
}

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

function setupDrag(map) {
    map.addEventListener('mousedown', (event) => startDragging(event));
    map.addEventListener('mousemove', (event) => dragMap(event, map));
    map.addEventListener('mouseup', stopDragging);
    map.addEventListener('mouseleave', stopDragging);
}

function startDragging(event) {
    isMouseDown = true;
    startX = event.clientX;
    startY = event.clientY;
    isMouseMoving = false;
    event.target.style.cursor = 'grabbing';
}

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

function stopDragging(event) {
    isMouseDown = false;
    event.target.style.cursor = 'default';
}

function setupCityHover(map, info) {
    map.querySelectorAll('path').forEach(path => {
        const city = path.getAttribute('zeme') || "Neznámá země";
        const capital = path.getAttribute('hlavni_mesto') || "Neznámé hlavní město";

        path.addEventListener('mouseover', () => showCityInfo(info, city, capital));
        path.addEventListener('mouseleave', () => clearCityInfo(info));
    });
}

function showCityInfo(info, city, capital) {
    info.textContent = `${city} : ${capital}`;
}

function clearCityInfo(info) {
    info.textContent = 'Najetím myši zobrazíš hlavní město';
}

function setupCityClick(map) {
    map.querySelectorAll('path').forEach(path => {
        const cityInfo = getCityInfo(path);

        path.addEventListener('click', () => handleCityClick(path, cityInfo));
    });
}

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

function handleCityClick(path, cityInfo) {
    if (isMouseMoving) return;

    if (!selectedCities.has(cityInfo)) {
        selectCity(path, cityInfo);
    } else {
        deselectCity(path, cityInfo);
    }
}

function selectCity(path, cityInfo) {
    path.classList.add('selected');
    selectedCities.add(cityInfo);
    addCityToSelection(cityInfo);
}

function deselectCity(path, cityInfo) {
    path.classList.remove('selected');
    selectedCities.delete(cityInfo);
    removeCityFromSelection(cityInfo);
}

function addCityToSelection(cityInfo) {
    const country = document.createElement("li");
    country.textContent = cityInfo.city;
    selected.appendChild(country);
}

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
