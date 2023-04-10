import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

const createTemplate = () =>
    html`
    <h2>Create recipe</h2>
    
`

export function createView(ctx) {
    activeAtags(create, [home, about, recipes, login, register, contact]);
    ctx.render(createTemplate());
}