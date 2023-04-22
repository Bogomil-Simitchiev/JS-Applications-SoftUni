import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

function contactHandler(e) {
    e.preventDefault();

    console.log('contact us!');
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';

}

const contactTemplate = () =>
html`
    <h2>Contact us</h2>
    <form class="modal-content animate" @submit=${contactHandler}>
    <div class="container">
      <label for="name">Name:</label><br>
      <input type="text" id="name" name="name" required>
      <br>
      <br>
      <label for="email">Email:</label><br>
      <input type="email" id="email" name="email" required>
      <br>
      <br>
      <label for="message">Message:</label><br>
      <textarea id="message" name="message" rows="4" cols="50" required></textarea><br><br>
      <input type="submit" value="Send">
    </div>
    <div class="container" style="background-color:#f1f1f1">  
    </div>
  </form>  
`

export function contactView(ctx) {
    activeAtags(contact, [home, about, recipes, login, register, create])
    ctx.render(contactTemplate());
}