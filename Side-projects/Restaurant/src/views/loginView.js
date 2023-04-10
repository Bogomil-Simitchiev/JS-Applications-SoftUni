import { html } from '../../node_modules/lit-html/lit-html.js'
import { loginUser } from '../requests/requests.js';
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

function loginHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get('email');
    const password = formData.get('password');
    if (email !== '' && password !== '') {
        const user = {
            email,
            password
        }
        loginUser(user);
    }


}

const loginTemplate = () =>
    html`
    <br>
    <h2 align="center">Log In</h2>
    <br>
    <form align="center" @submit=${loginHandler}>
  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email">
  <br>
  <br>
  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password">
  <br>
  <br>
  <input type="submit" value="Submit">
</form>
    
`

export function loginView(ctx) {
    activeAtags(login, [home, about, recipes, register, create, contact]);
    ctx.render(loginTemplate());
}