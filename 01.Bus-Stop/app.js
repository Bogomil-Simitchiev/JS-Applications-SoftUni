function getInfo() {
    let stopNameElement = document.getElementById('stopName');
    let stopIdElement = document.getElementById('stopId');
    let busesUlElement = document.getElementById('buses');

    let url = `http://localhost:3030/jsonstore/bus/businfo/${stopIdElement.value}`;
    fetch(url)
        .then(res => res.json())
        .then(result => {
            stopNameElement.textContent = result.name;
            for (const key in result.buses) {
                let liElement = document.createElement('li');
                liElement.textContent = `Bus ${key} arrives in ${result.buses[key]} minutes`;
                busesUlElement.appendChild(liElement);
            }
        })
        .catch(() => {
            stopNameElement.textContent = 'Error';
            let liElements = busesUlElement.querySelectorAll('li');
            liElements.forEach(liElement => liElement.remove());
        })

}