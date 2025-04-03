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
