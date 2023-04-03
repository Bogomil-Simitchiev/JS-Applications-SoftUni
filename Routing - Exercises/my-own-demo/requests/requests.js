import { navigate } from '../views/utils.js';
import page from '../node_modules/page/page.mjs'

const urlCars = `http://localhost:3030/jsonstore/cars/`

export function getInfoAboutCars() {
    return fetch(urlCars).then(res => res.json()).catch(err => console.log(err));
}
export function getInfoAboutSingleCar(id) {
    return fetch(urlCars + id).then(res => res.json()).catch(err => console.log(err));
}
export function postRegistration(user) {
    fetch('http://localhost:3030/users/register/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(user => {
            alert('Successfully registration!')
            localStorage.setItem('user', JSON.stringify(user));
            navigate();
            page.redirect('/');
        })
        .catch(() => {
            alert('Cannot register this user!');
        })
}
export function postLogIn(user) {
    fetch('http://localhost:3030/users/login/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(user => {
            if (user.code == 403) {
                alert('Cannot log in this user!');
                document.querySelector('#email').value = '';
                document.querySelector('#password').value = '';
            }
            else {
                alert('Successfully logged in!');
                localStorage.setItem('user', JSON.stringify(user));
                navigate();
                page.redirect('/');
            }

        })
        .catch(() => {
            alert('Cannot log in this user!')
        })

}

export function createCar(car) {
    fetch(urlCars, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(car)
    })
        .then(res => res.json())
        .then(result => {
            alert('Successfully created!')
            page.redirect(`/cars/${result._id}`);

        })
        .catch(() => {
            console.log('Cannot create car article!')
        })
}

export function delCar(id) {
    fetch(urlCars + id, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(() => {
            alert('Successfully deleted!');
            page.redirect('/catalog');
        })
        .catch(err => console.log(err))
}
export function editCar(id, car) {
    fetch(urlCars + id, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(car)
    })
        .then(res => res.json())
        .then(result => {
            alert('Successfully edited!')
            page.redirect(`/cars/${result._id}`);

        })
        .catch(() => {
            console.log('Cannot edit car article!')
        })
}