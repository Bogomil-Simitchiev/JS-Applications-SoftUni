export function getInfoAboutCars() {
    return fetch('http://localhost:3030/jsonstore/cars/').then(res => res.json()).catch(err => console.log(err));
}
export function getInfoAboutSingleCar(id) {
    return fetch(`http://localhost:3030/jsonstore/cars/${id}`).then(res => res.json()).catch(err => console.log(err));
}