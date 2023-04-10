import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

const contactTemplate = () =>
    html`
    <h2>Contact us</h2>
    
`

export function contactView(ctx) {
    activeAtags(contact,[home,about,recipes,login,register,create])
    ctx.render(contactTemplate());
}