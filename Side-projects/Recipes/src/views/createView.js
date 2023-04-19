import { html } from '../../node_modules/lit-html/lit-html.js'
import { postRecipe } from '../requests/requests.js';
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

  const formData = new FormData(e.currentTarget);
  const name = formData.get('name');
  const img = formData.get('img');
  const steps = formData.get('steps');
  const ingredients = formData.get('ingredients');

  const user = JSON.parse(localStorage.getItem('user'));

  const detailsRecipe = {
    name,
    img,
    'steps': Array.from(steps.split('\n')).filter(x => x !== ''),
    'ingredients': Array.from(ingredients.split('\n')).filter(x => x !== ''),
    '_ownerId': user._id
  }
  postRecipe(detailsRecipe, user);
}

const createTemplate = () =>
  html`
   <form class="modal-content animate" @submit=${createHandler}>
     <h2 align="center">Create a recipe</h2>
    <div class="container">
      <label for="name"><b>Name of recipe:</b></label>
      <input type="text" placeholder="Enter name" name="name" id="name" required>
      <br>
      <br>
      <label for="img"><b>Img URL:</b></label><br>
      <input type="url" placeholder="Enter img url" name="img" id="img" required>
      <br>
      <br>
      <label for="steps"><b>Steps:</b></label><br>
      <textarea id="steps" name="steps" id="steps" required></textarea><br>
      <label for="ingredients"><b>Ingredients:</b></label><br>
      <textarea id="ingredients" name="ingredients" id="ingredients" required></textarea><br><br>
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