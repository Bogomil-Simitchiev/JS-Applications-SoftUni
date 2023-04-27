import page from '../../node_modules/page/page.mjs';
import { getToken } from '../utils/utils.js';

const loginURL = `http://localhost:3030/users/login/`;
const registerURL = `http://localhost:3030/users/register/`;
const logoutURL = `http://localhost:3030/users/logout/`;
const albumsURL = `http://localhost:3030/data/albums?sortBy=_createdOn%20desc&distinct=name`;

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

//get all albums

export const getAllAlbums = () =>
    fetch(albumsURL)
        .then(res => res.json())
        .catch(err => alert(err));