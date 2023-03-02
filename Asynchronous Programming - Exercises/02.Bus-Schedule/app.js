function solve() {

    let infoElement = document.querySelector('.info');
    let stopId = 'depot';
    let stopName = 'Depot';

    function depart() {
        const url = `http://localhost:3030/jsonstore/bus/schedule/${stopId}`;
        fetch(url)
            .then(res => res.json())
            .then(result => {
                stopId = result.next;
                stopName = result.name;
                infoElement.textContent = `Next stop ${stopName}`;
                document.getElementById('depart').disabled = true;
                document.getElementById('arrive').disabled = false;

            });
    }

    function arrive() {
        infoElement.textContent = `Arriving at ${stopName}`;
        document.getElementById('depart').disabled = false;
        document.getElementById('arrive').disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();