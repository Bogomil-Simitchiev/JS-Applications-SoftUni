import page from '../../node_modules/page/page.mjs';
import { navigateNavbar } from "../utils.js";

const recipeURL = `http://localhost:3030/jsonstore/cookbook/recipes`

export const getAllRecipes = () => fetch(recipeURL).then(res => res.json()).catch(err => console.log(err));

export const loginUser = (user) => {
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

                console.log(localStorage.getItem('user'));

                navigateNavbar();
                page.redirect('/');
            }

        })
        .catch(() => {
            alert('Cannot log in this user!')
        })
}
export function registerUser(user){
    fetch('http://localhost:3030/users/register/', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(user => {
            if (user.code == 403) {
                alert('Cannot register this user!');
                document.querySelector('#email').value = '';
                document.querySelector('#password').value = '';
                document.querySelector('#username').value = '';
            }
            else {
                alert('Successfully registered!');
                localStorage.setItem('user', JSON.stringify(user));
                navigateNavbar();
                page.redirect('/');
            }

        })
        .catch(() => {
            alert('Cannot register this user!')
        })
}