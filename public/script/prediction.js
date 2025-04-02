async function getPrediction(departure, arrival, changes, airline) {
    if (selectedCities.size === 0) {
        alert("Žádné země nejsou vybrány.");
        return;
    }
    const response = await fetch('/predict', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({departure, arrival, changes, airline})
    });
    const data = await response.json();
    console.log('Predikovaná cena:', data.price);
    const prediction = document.getElementById('prediction');
    prediction.textContent = `Predikovaná cena: ${data.price.toFixed(2)} kc`;
}

async function sendSelectedCities() {
    if (selectedCities.size === 0) {
        alert("Žádné země nejsou vybrány.");
        return;
    }

    const response = await fetch('/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({selected: Array.from(selectedCities)}),
    });

    const result = await response.json();
    console.log("Odpověď serveru:", result);
}