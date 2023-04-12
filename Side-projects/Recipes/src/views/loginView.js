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
    <form class="modal-content animate" @submit=${loginHandler}>
     <h2 align="center">Log in</h2>
    <div class="container">
      <label for="email"><b>Email:</b></label>
      <input type="email" placeholder="Enter email" name="email" id="email" required>
      <br>
      <br>
      <label for="password"><b>Password:</b></label>
      <input type="password" placeholder="Enter password" name="password" id="password" required>
      <br>
      <br>
      <input type="submit" value="Login">
    </div>
    <div class="container" style="background-color:#f1f1f1">  
    </div>
  </form>  
`

export function loginView(ctx) {
    activeAtags(login, [home, about, recipes, register, create, contact]);
    ctx.render(loginTemplate());
}