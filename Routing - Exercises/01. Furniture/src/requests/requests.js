const urlCatalog = `http://localhost:3030/data/catalog/`;
import { navigate } from "../utils.js";
import page from '../../node_modules/page/page.mjs';

export async function getAll() {
    let result = await fetch(urlCatalog);
    let response = await result.json();
    return response;
}
export async function getSingleFurniture(id) {
    let result = await fetch(urlCatalog + id);
    let response = await result.json();
    return response;
}
export async function getAllMyFurnitures(userId) {
    let result = await fetch(urlCatalog + `?where=_ownerId%3D%22${userId}%22`);
    let response = await result.json();
    return response;
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
export function delFurniture(id, user) {
    fetch(urlCatalog + id, {
        method: 'DELETE',
        headers:{
            'content-type': 'application/json',
            'X-Authorization': user.accessToken
        }
    })
        .then(res => res.json())
        .then(() => {
            alert('Successfully deleted!');
            page.redirect('/');
        })
        .catch(err => console.log(err))
}
export function postRegister(user){
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
export function createFurniture(furniture,user) {
    fetch(urlCatalog, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': user.accessToken
        },
        body: JSON.stringify(furniture)
    })
        .then(res => res.json())
        .then(() => {
            alert('Successfully created!')
            page.redirect(`/`);

        })
        .catch(() => {
            console.log('Cannot create furniture!')
        })
}
