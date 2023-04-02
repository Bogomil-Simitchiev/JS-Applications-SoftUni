import { html, render } from '../node_modules/lit-html/lit-html.js'
import { navigate } from './utils.js';
import page from '../node_modules/page/page.mjs'

function loginHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let email = formData.get('email');
    let password = formData.get('password');

    if (email != '' && password != '') {
        let user = {
            email,
            password
        }
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
}

const loginTemplate = () => html`
<h1>Log in</h1>
<form @submit=${loginHandler}>
  <label for="email">Email:</label><br>
  <input type="text" id="email" name="email"><br>

  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>

  <input type="submit" value="Submit">
</form>
`
const root = document.getElementById('root');

export function loginView() {
    render(loginTemplate(), root);
}
