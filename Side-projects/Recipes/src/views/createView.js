import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

function createHandler(e) {
    e.preventDefault();
    console.log('ready to create');
}

const createTemplate = () =>
html`
   <form class="modal-content animate" @submit=${createHandler}>
     <h2 align="center">Create a recipe</h2>
    <div class="container">
      <label for="name"><b>Name of recipe:</b></label>
      <input type="text" placeholder="Enter name" name="name" required>
      <br>
      <br>
      <label for="img"><b>Img URL:</b></label><br>
      <input type="url" placeholder="Enter img url" name="img" required>
      <br>
      <br>
      <label for="steps"><b>Steps:</b></label><br>
      <textarea id="steps" name="steps" required></textarea><br>
      <label for="ingredients"><b>Ingredients:</b></label><br>
      <textarea id="ingredients" name="ingredients" required></textarea><br><br>
      <input type="submit" value="Create">
    </div>
    <div class="container" style="background-color:#f1f1f1">  
    </div>
  </form>  
`

export function createView(ctx) {
    activeAtags(create, [home, about, recipes, login, register, contact]);
    ctx.render(createTemplate());
}