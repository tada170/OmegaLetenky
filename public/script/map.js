async function loadMap() {
    const response = await fetch('../images/europe.svg');
    document.getElementById('map-container').innerHTML = await response.text();

    const mapa = document.querySelector('#map-container svg');
    const info = document.getElementById('info');
    let selectedCountries = new Set();

    let isMouseDown = false;
    let startX, startY;
    let isMouseMoving = false;
    let scale = 1;

    mapa.addEventListener('wheel', (event) => {
        event.preventDefault();

        if (event.deltaY < 0) {
            scale = 0.9;
        } else {
            scale = 1.1;
        }

        const viewBox = mapa.getAttribute('viewBox').split(' ').map(Number);
        const width = viewBox[2];
        const height = viewBox[3];

        const newWidth = width * scale;
        const newHeight = height * scale;

        const centerX = viewBox[0] + (width - newWidth) / 2;
        const centerY = viewBox[1] + (height - newHeight) / 2;

        mapa.setAttribute('viewBox', `${centerX} ${centerY} ${newWidth} ${newHeight}`);
    });

    mapa.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        startX = event.clientX;
        startY = event.clientY;
        isMouseMoving = false;
        mapa.style.cursor = 'grabbing';
    });

    mapa.addEventListener('mousemove', (event) => {
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
    });

    mapa.addEventListener('mouseup', () => {
        isMouseDown = false;
        mapa.style.cursor = 'grab';
    });

    mapa.addEventListener('mouseleave', () => {
        isMouseDown = false;
        mapa.style.cursor = 'default';
    });

    mapa.querySelectorAll('path').forEach(path => {
        const country = path.getAttribute('zeme') || "Neznámá země";
        const capital = path.getAttribute('hlavni_mesto') || "Neznámé hlavní město";

        path.addEventListener('mouseover', () => {
            info.textContent = `${country} : ${capital}`;
        });

        path.addEventListener('mouseleave', () => {
            info.textContent = 'Najetím myši zobrazíš hlavní město';
        });

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
