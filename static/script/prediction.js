async function sendSelectedCities() {
    const resultElement = document.getElementById('result');
    const calculatedRouteElement = document.getElementById('calculated-route');
    const totalPriceElement = document.getElementById('total-price');

    const cities = Array.from(selectedCities);

    if (cities.length <= 1) {
        resultElement.style.display = "block";
        calculatedRouteElement.textContent = '';
        totalPriceElement.textContent = 'Musíš vybrat alespoň 2 města.';
        return;
    }
    let find_best_path;

    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";

    try {
        find_best_path = document.querySelectorAll('input[type="checkbox"]:checked').length > 0;
        const response = await fetch('/data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selected: cities, best_path: find_best_path})
        });

        const resultData = await response.json();

        if (response.ok) {
            resultElement.style.display = "block";
            const route = resultData.best_path.map(cityInfo => cityInfo.city).join(' → ');
            calculatedRouteElement.textContent = `Nejlepší trasa: ${route}`;
            totalPriceElement.textContent = `Celková cena: ${resultData.total_price} Kč`;
        } else {
            calculatedRouteElement.textContent = '';
            totalPriceElement.textContent = 'Chyba při výpočtu cesty.';
        }
    } catch (error) {
        calculatedRouteElement.textContent = '';
        totalPriceElement.textContent = 'Chyba při spojení se serverem.';
    } finally {
        loadingElement.classList.add('hide-loading');
        setTimeout(() => {
            loadingElement.style.display = "none";
        }, 1000);
    }
}
