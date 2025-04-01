async function loadMap() {
    const mapContainer = document.getElementById('map-container');
    const info = document.getElementById('info');
    const mapa = await loadSVGMap(mapContainer);

    let selectedCountries = new Set();
    let isMouseDown = false;
    let startX, startY;
    let isMouseMoving = false;
    let scale = 1;

    setupZoom(mapa);
    setupDrag(mapa);
    setupCountryHover(mapa, info);
    setupCountryClick(mapa, selectedCountries, isMouseMoving);
}

async function loadSVGMap(mapContainer) {
    const response = await fetch('../images/europe.svg');
    const svgText = await response.text();
    mapContainer.innerHTML = svgText;
    return mapContainer.querySelector('svg');
}

function setupZoom(mapa) {
    mapa.addEventListener('wheel', (event) => {
        event.preventDefault();
        adjustZoom(mapa, event.deltaY);
    });
}

function adjustZoom(mapa, deltaY) {
    const scale = deltaY < 0 ? 0.9 : 1.1;
    const viewBox = mapa.getAttribute('viewBox').split(' ').map(Number);
    const width = viewBox[2];
    const height = viewBox[3];

    const newWidth = width * scale;
    const newHeight = height * scale;
    const centerX = viewBox[0] + (width - newWidth) / 2;
    const centerY = viewBox[1] + (height - newHeight) / 2;

    mapa.setAttribute('viewBox', `${centerX} ${centerY} ${newWidth} ${newHeight}`);
}

function setupDrag(mapa) {
    mapa.addEventListener('mousedown', (event) => startDragging(event, mapa));
    mapa.addEventListener('mousemove', (event) => dragMap(event, mapa));
    mapa.addEventListener('mouseup', stopDragging);
    mapa.addEventListener('mouseleave', stopDragging);
}

function startDragging(event, mapa) {
    isMouseDown = true;
    startX = event.clientX;
    startY = event.clientY;
    isMouseMoving = false;
    mapa.style.cursor = 'grabbing';
}

function dragMap(event, mapa) {
    if (!isMouseDown) return;

    isMouseMoving = true;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    const viewBox = mapa.getAttribute('viewBox').split(' ').map(Number);
    const speedScale = viewBox[2] / 1000;

    viewBox[0] -= dx * speedScale;
    viewBox[1] -= dy * speedScale;
    mapa.setAttribute('viewBox', `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`);

    startX = event.clientX;
    startY = event.clientY;
}

function stopDragging() {
    isMouseDown = false;
    mapa.style.cursor = 'default';
}

function setupCountryHover(mapa, info) {
    mapa.querySelectorAll('path').forEach(path => {
        const country = path.getAttribute('zeme') || "Neznámá země";
        const capital = path.getAttribute('hlavni_mesto') || "Neznámé hlavní město";

        path.addEventListener('mouseover', () => {
            info.textContent = `${country} : ${capital}`;
        });

        path.addEventListener('mouseleave', () => {
            info.textContent = 'Najetím myši zobrazíš hlavní město';
        });
    });
}

function setupCountryClick(mapa, selectedCountries, isMouseMoving) {
    mapa.querySelectorAll('path').forEach(path => {
        const country = path.getAttribute('zeme') || "Neznámá země";

        path.addEventListener('click', () => {
            if (isMouseMoving) return;

            if (country && !selectedCountries.has(country)) {
                path.classList.add('selected');
                selectedCountries.add(country);
            } else if (country) {
                path.classList.remove('selected');
                selectedCountries.delete(country);
            }
        });
    });
}

loadMap();
