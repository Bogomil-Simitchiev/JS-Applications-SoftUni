import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

const aboutTemplate = () =>
    html`
    <h2 align="center">About us</h2>
    <main id="aboutMain">
      <h3 style="font-style:italic;">Welcome to Recipe Website</h3>
      <p>At Recipe Website, we're passionate about cooking and sharing delicious recipes with the world. Whether you're a beginner or an experienced home cook, our website has something for everyone.</p>
      <br>
      <h3 style="font-style:italic;">Our Community</h3>
      <p>We believe that food is more than just sustenance - it's a way to bring people together. That's why we have a thriving community of food lovers who share their own recipes, tips, and tricks with each other. Join our community and connect with other passionate home cooks!</p>
    </main>
    <footer>
      <p>&copy; 2023 Recipe Website</p>
    </footer>
    
`

export function aboutView(ctx) {
    activeAtags(about, [home, recipes, login, register, create, contact]);
    ctx.render(aboutTemplate());
}