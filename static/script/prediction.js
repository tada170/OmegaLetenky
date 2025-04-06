const resultElement = document.getElementById('result');
const calculatedRouteElement = document.getElementById('calculated-route');
const totalPriceElement = document.getElementById('total-price');
const adultPrice = document.getElementById('adult-price');
const childPrice = document.getElementById('child-price');

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
            displayError('Chyba při výpočtu cesty.');
        }
    } catch (error) {
        displayError('Chyba při spojení se serverem.');
    } finally {
        hideLoading();
    }
}

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

function displayError(message) {
    resultElement.style.display = "block";
    calculatedRouteElement.textContent = '';
    adultPrice.textContent = '';
    childPrice.textContent = '';
    totalPriceElement.textContent = message;
}

function hideLoading() {
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "none";
}
