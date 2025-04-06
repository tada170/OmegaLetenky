const airlines = [
    { code: '4U', name: 'Germanwings' },
    { code: 'A3', name: 'Aegean Airlines' },
    { code: 'AF', name: 'Air France' },
    { code: 'AY', name: 'Finnair' },
    { code: 'BA', name: 'British Airways' },
    { code: 'BT', name: 'Air Baltic' },
    { code: 'DE', name: 'Condor' },
    { code: 'DY', name: 'Norwegian Air Shuttle' },
    { code: 'EI', name: 'Aer Lingus' },
    { code: 'FB', name: 'Bulgaria Air' },
    { code: 'FR', name: 'Ryanair' },
    { code: 'GQ', name: 'Sardinia Airlines' },
    { code: 'HR', name: 'Croatia Airlines' },
    { code: 'HV', name: 'Transavia' },
    { code: 'IB', name: 'Iberia' },
    { code: 'JU', name: 'Air Serbia' },
    { code: 'KL', name: 'KLM' },
    { code: 'KM', name: 'Air Malta' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'LO', name: 'LOT Polish Airlines' },
    { code: 'LX', name: 'Swiss International Air Lines' },
    { code: 'MS', name: 'EgyptAir' },
    { code: 'OS', name: 'Austrian Airlines' },
    { code: 'OU', name: 'Croatia Airlines' },
    { code: 'PC', name: 'Pegasus Airlines' },
    { code: 'QS', name: 'Smartwings' },
    { code: 'RO', name: 'Tarom' },
    { code: 'SK', name: 'SAS' },
    { code: 'SN', name: 'Brussels Airlines' },
    { code: 'TP', name: 'TAP Air Portugal' },
    { code: 'U2', name: 'EasyJet' },
    { code: 'VY', name: 'Vueling' },
    { code: 'W6', name: 'Wizz Air' }
];

const airlineSelect = document.getElementById('airline');

airlines.forEach(airline => {
    const option = document.createElement('option');
    option.value = airline.code;
    option.textContent = `${airline.name}`;
    airlineSelect.appendChild(option);
});
