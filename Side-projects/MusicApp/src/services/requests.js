import page from '../../node_modules/page/page.mjs';
import { getToken } from '../utils/utils.js';

const loginURL = `http://localhost:3030/users/login/`;
const registerURL = `http://localhost:3030/users/register/`;
const logoutURL = `http://localhost:3030/users/logout/`;
const albumsURL = `http://localhost:3030/data/albums`;

//login request
export function loginUser(user) {
    fetch(loginURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(user => {
            if (user.code == 403) {
                alert('Cannot log in this user!');
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';

            } else {
                localStorage.setItem('user', JSON.stringify(user));
                page.redirect('/');
            }

        })
        .catch(err => {
            alert('Cannot logged in this user!');
        })

}

//logout request
export const logoutUser = () => fetch(logoutURL, { headers: { 'X-Authorization': getToken() } }).then(() => {
    localStorage.removeItem('user');
});

//register request
export function registerUser(user) {
    fetch(registerURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            page.redirect('/');
        })
        .catch(err => {
            alert(err);
        })

}

//create album
export function createAlbum(newAlbum) {
    fetch(albumsURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': getToken()
        },
        body: JSON.stringify(newAlbum)

    })
        .then(() => {
            page.redirect('/catalog');
        })
        .catch(err => alert(err));
}

//edit album
export function editAlbum(editedAlbum, id) {
    fetch(albumsURL + `/${id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': getToken()
        },
        body: JSON.stringify(editedAlbum)

    })
        .then(res => res.json())
        .then(data => {
            page.redirect(`/details/${data._id}`)
        })
        .catch(err => alert(err));
}
export function deleteAlbum(id) {
    fetch(albumsURL + `/${id}`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': getToken()
        }
    })
        .then(() => {
            page.redirect('/catalog');
        })
        .catch(err => alert(err));
}

//search albums
export const searchAlbums = (search) => {
    const query = encodeURIComponent(`name LIKE "${search}"`);
    return fetch(albumsURL + `?where=${query}`)

}

//get all albums
export const getAllAlbums = () =>
    fetch(albumsURL + `?sortBy=_createdOn%20desc&distinct=name`)
        .then(res => res.json())
        .catch(err => alert(err));


//get single album
export const getAlbum = (id) =>
    fetch(albumsURL + `/${id}`)
        .then(res => res.json())
        .catch(err => alert(err));
