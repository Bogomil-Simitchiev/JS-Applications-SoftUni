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
    <br>
    <h2 align="center">Registration</h2>
    <br>
    <form align="center" @submit=${registerHandler}>
    <label for="username">Username:</label>
    <br>
  <input type="text" id="username" name="username" required>
  <br>
  <label for="email">Email:</label>
  <br>
  <input type="email" id="email" name="email" required>
  <br>
  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password" required>
  <br>
  <br>
  <input type="submit" value="Submit">
</form>
    
`

export function registerView(ctx) {
    activeAtags(register, [home, about, recipes, login, create, contact]);
    ctx.render(registerTemplate());
}