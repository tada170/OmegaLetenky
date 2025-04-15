const resultElement = document.getElementById('result');
const calculatedRouteElement = document.getElementById('calculated-route');
const totalPriceElement = document.getElementById('total-price');
const adultPrice = document.getElementById('adult-price');
const childPrice = document.getElementById('child-price');


/**
 * Odesílá vybraná města, počet dospělých, dětí, informace o nejlepší trase a letecké společnosti na server.
 * Po úspěšném odeslání dat načte výsledek a zobrazí nejlepší trasu a cenu.
 *
 * @returns {void} Funkce nevrací hodnotu. Data jsou odeslána na server a na základě odpovědi je aktualizován obsah stránky.
 */
async function sendSelectedCities() {
    const cities = Array.from(selectedCities)
    if (cities.length <= 1) {
        displayError('Musíš vybrat alespoň 2 města.');
        return;
    }

    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
    const findBestPath = document.querySelectorAll('input[type="checkbox"]:checked').length > 0;
    const airline = document.getElementById("airline").value;

    let isValidAirline = false;
    for (let i = 0; i < airlines.length; i++) {
        if (airlines[i].code === airline) {
            isValidAirline = true;
            break;
        }
    }

    if (adults < 1 || children < 0 || !isValidAirline) {
        displayError('Neplatné vstupy.');
        return;
    }

    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";

    try {
        const response = await fetch('/data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selected: cities, best_path: findBestPath, adults, children, airline})
        });

        if (!response.ok) {
            throw new Error('Chyba při ukládání dat.');
        }

        const resultResponse = await fetch('/result');
        const resultData = await resultResponse.json();

        if (resultResponse.ok) {
            displayRouteAndPrice(resultData);
        } else {
            displayError('Chyba při výpočtu cesty - do státu pravděpodobně neexistuje žádná letenka');
        }
    } catch (error) {
        displayError('Chyba při spojení se serverem.');
    } finally {
        hideLoading();
    }
}

/**
 * Zobrazuje nejlepší trasu a ceny za dospělé a děti.
 *
 * @param {Object} resultData - Data z odpovědi serveru obsahující nejlepší trasu a ceny.
 * @param {Array} resultData.best_path - Pole obsahující města v nejlepší trase.
 * @param {number} resultData.total_price - Celková cena za všechny cestující.
 * @param {number} resultData.adult_price - Cena za jednoho dospělého.
 * @param {number} resultData.child_price - Cena za jedno dítě.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze aktualizuje DOM s nejlepší trasou a cenami.
 */
function displayRouteAndPrice(resultData) {
    resultElement.style.display = "block";
    let route = '';
    for (let i = 0; i < resultData.best_path.length; i++) {
        route += resultData.best_path[i].city;
        if (i < resultData.best_path.length - 1) {
            route += ' → ';
        }
    }
    calculatedRouteElement.textContent = `Nejlepší trasa: ${route}`;
    totalPriceElement.textContent = `Celková cena: ${resultData.total_price} Kč`;
    adultPrice.textContent = `Celková cena za dospělé: ${resultData.adult_price} Kč`;
    childPrice.textContent = `Celková cena za dítě: ${resultData.child_price} Kč`;
}

/**
 * Zobrazuje chybovou zprávu na stránce místo výsledků.
 *
 * @param {string} message - Chybová zpráva, která bude zobrazena.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze aktualizuje DOM a zobrazuje chybovou zprávu.
 */
function displayError(message) {
    resultElement.style.display = "block";
    calculatedRouteElement.textContent = '';
    adultPrice.textContent = '';
    childPrice.textContent = '';
    totalPriceElement.textContent = message;
}

/**
 * Skryje prvek indikující načítání.
 *
 * @returns {void} Funkce nevrací hodnotu, pouze skryje prvek s ID "loading".
 */
function hideLoading() {
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "none";
}
