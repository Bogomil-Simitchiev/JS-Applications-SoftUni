import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

const registerTemplate = () =>
    html`
    <h2>Registration</h2>
    
`

export function registerView(ctx) {
    activeAtags(register, [home, about, recipes, login, create, contact]);
    ctx.render(registerTemplate());
}