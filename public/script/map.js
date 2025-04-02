    let isMouseDown = false;
    let startX, startY;
    let isMouseMoving = false;
    let scale = 1;
    let selectedCities = new Set();

    async function loadMap() {
        const mapContainer = document.getElementById('map-container');
        const info = document.getElementById('info');
        const map = await loadSVGMap(mapContainer);

        initializeMapInteractions(map, info);
    }

    async function loadSVGMap(mapContainer) {
        const response = await fetch('public/images/europe.svg');
        mapContainer.innerHTML = await response.text();
        return mapContainer.querySelector('svg');
    }

    function initializeMapInteractions(map, info) {
        setupZoom(map);
        setupDrag(map);
        setupcityHover(map, info);
        setupcityClick(map);
    }

    function setupZoom(map) {
        map.addEventListener('wheel', (event) => {
            event.preventDefault();
            adjustZoom(map, event.deltaY);
        });
    }

    function adjustZoom(map, deltaY) {
        if (deltaY < 0) {
            scale = 0.9;
        } else {
            scale = 1.1;
        }

        const viewBox = map.getAttribute('viewBox').split(' ').map(Number);
        const width = viewBox[2];
        const height = viewBox[3];

        const newWidth = width * scale;
        const newHeight = height * scale;
        const centerX = viewBox[0] + (width - newWidth) / 2;
        const centerY = viewBox[1] + (height - newHeight) / 2;

        map.setAttribute('viewBox', `${centerX} ${centerY} ${newWidth} ${newHeight}`);
    }

    function setupDrag(map) {
        map.addEventListener('mousedown', (event) => startDragging(event, map));
        map.addEventListener('mousemove', (event) => dragMap(event, map));
        map.addEventListener('mouseup', stopDragging);
        map.addEventListener('mouseleave', stopDragging);
    }

    function startDragging(event, map) {
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

    function setupcityHover(map, info) {
        map.querySelectorAll('path').forEach(path => {
            const city = path.getAttribute('zeme') || "Neznámá země";
            const capital = path.getAttribute('hlavni_mesto') || "Neznámé hlavní město";

            path.addEventListener('mouseover', () => {
                info.textContent = `${city} : ${capital}`;
            });

            path.addEventListener('mouseleave', () => {
                info.textContent = 'Najetím myši zobrazíš hlavní město';
            });
        });
    }

    function setupcityClick(map) {
        map.querySelectorAll('path').forEach(path => {
            const city = path.getAttribute('hlavni_mesto') || "Neznáme hlavni mesto";

            path.addEventListener('click', () => {
                if (isMouseMoving) return;

                if (city && !selectedCities.has(city)) {
                    path.classList.add('selected');
                    selectedCities.add(city);
                } else if (city) {
                    path.classList.remove('selected');
                    selectedCities.delete(city);
                }
            });
        });
    }

    loadMap();
