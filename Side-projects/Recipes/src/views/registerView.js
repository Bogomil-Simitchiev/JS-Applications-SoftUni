import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';
import { registerUser } from '../requests/requests.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

function registerHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (email !== '' && password !== '' && username !== '') {
        const user = {
            username,
            email,
            password
        }
        registerUser(user);
    }
}

const registerTemplate = () =>
html`
    <form class="modal-content animate" @submit=${registerHandler}>
     <h2 align="center">Registration</h2>
    <div class="container">
      <label for="username"><b>Username:</b></label>
      <input type="text" placeholder="Enter username" name="username" required>
      <br>
      <br>
      <label for="email"><b>Email:</b></label>
      <input type="email" placeholder="Enter email" name="email" required>
      <br>
      <br>
      <label for="password"><b>Password:</b></label>
      <input type="password" placeholder="Enter password" name="password" required>
      <br>
      <br>
      <input type="submit" value="Register">
    </div>
    <div class="container" style="background-color:#f1f1f1">
    </div>
  </form>  
`

export function registerView(ctx) {
    activeAtags(register, [home, about, recipes, login, create, contact]);
    ctx.render(registerTemplate());
}