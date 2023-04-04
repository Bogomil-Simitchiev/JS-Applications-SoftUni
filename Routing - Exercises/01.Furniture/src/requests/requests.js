const urlCatalog = `http://localhost:3030/data/catalog/`;
import { navigate } from "../utils.js";
import page from '../../node_modules/page/page.mjs';

export async function getAll() {
    let result = await fetch(urlCatalog);
    let response = await result.json();
    return response;
}
export async function getAllMyFurnitures(userId) {
    let result = await fetch(urlCatalog +`?where=_ownerId%3D%22${userId}%22`);
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