import { html, render } from '../node_modules/lit-html/lit-html.js'
import { navigate } from "./utils.js";
import page from '../node_modules/page/page.mjs'

function registerHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  let email = formData.get('email');
  let password = formData.get('password');

  if (email !== '' && password !== '') {
    let user = {
      email,
      password
    }
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
}

const registerTemplate = () => html`
<h1>Registration</h1>
<form @submit=${registerHandler}>
  <label for="email">Email:</label><br>
  <input type="text" id="email" name="email"><br>

  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>

  <input type="submit" value="Submit">
</form>
`
const root = document.getElementById('root');

export function registerView() {
  render(registerTemplate(), root);
}