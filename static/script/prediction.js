const resultElement = document.getElementById('result');
const calculatedRouteElement = document.getElementById('calculated-route');
const totalPriceElement = document.getElementById('total-price');
const adultPrice = document.getElementById('adult-price');
const childPrice = document.getElementById('child-price');


async function sendSelectedCities() {
    const cities = Array.from(selectedCities);
    if (cities.length <= 1) {
        displayError('Musíš vybrat alespoň 2 města.');
        return;
    }

    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";

    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
    const findBestPath = document.querySelectorAll('input[type="checkbox"]:checked').length > 0;

    try {
        const response = await fetch('/data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selected: cities, best_path: findBestPath, adults, children})
        });

        const resultData = await response.json();

        if (response.ok) {
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
    const route = resultData.best_path.map(cityInfo => cityInfo.city).join(' → ');
    calculatedRouteElement.textContent = `Nejlepší trasa: ${route}`;
    totalPriceElement.textContent = `Celková cena: ${resultData.total_price} Kč`;
    adultPrice.textContent = `Celková cena za dospělé: ${resultData.adult_price} Kč`;
    childPrice.textContent = `Celková cena za dítě: ${resultData.child_price} Kč`;
}

function displayError(message) {
    resultElement.style.display = "block";
    calculatedRouteElement.textContent = '';
    totalPriceElement.textContent = message;
}

function hideLoading() {
    const loadingElement = document.getElementById("loading");
    loadingElement.classList.add('hide-loading');
    setTimeout(() => {
        loadingElement.style.display = "none";
    }, 1000);
}
