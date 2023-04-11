import { html } from '../../node_modules/lit-html/lit-html.js'
import { getAllRecipes } from '../requests/requests.js';
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

const recipeTemplate = (recipe) =>
    html`
<div class="card" style="width: 18rem;">
  <img src="${recipe.img}" class="card-img-top" alt="..." height=200px>
  <div class="card-body">
    <h5 class="card-title">${recipe.name}</h5>
    <a href="/details/${recipe._id}" class="btn btn-primary">Details</a>
  </div>
</div>
`

const recipesTemplate = (recipes) =>
    html`
    <h2>Recipes</h2>
    <br>
    <div class="recipes-list">
    ${Object.values(recipes).map(recipe => recipeTemplate(recipe))}
    </div>
`

export function recipesView(ctx) {
  activeAtags(recipes,[home,about,contact,login,register,create])
    getAllRecipes()
    .then(recipes => {
        ctx.render(recipesTemplate(recipes));
    })
}