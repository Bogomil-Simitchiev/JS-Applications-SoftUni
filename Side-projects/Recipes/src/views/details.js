import { html } from '../../node_modules/lit-html/lit-html.js'
import { getRecipe } from '../requests/requests.js';

const detailsForNotUserTemplate = (recipe) =>
	html`
    <h3 align="center">
     <a class="previous" href="/recipes"><-- previous</a>  Details for ${recipe.name}</h3>    
    <div id="container">
	<img class="recipe-image" src="${recipe.img}" alt="Image of ${recipe.name}">

	<h2>Ingredients:</h2>
	<div class="recipe-ingredients">
		<ul>
            ${recipe.ingredients.map(ingredient => html`<li>${ingredient}</li>`)}
		</ul>
	</div>

	<h2>Steps:</h2>
	<div class="recipe-steps">
		<ol>
        ${recipe.steps.map(step => html`<li>${step}</li>`)}
		</ol>
	</div>
</div>
`

function deleteRecipe(e) {
	const id = e.currentTarget.parentNode.id;
	console.log(id);
	// TODO: create delete logic
}

const detailsForUserTemplate = (recipe) =>
	html`
    <h3 align="center" id="${recipe._id}">
     <a class="previous" href="/recipes"><-- previous</a><button class="deleteTag" @click=${deleteRecipe}>Delete</button>  Details for ${recipe.name}</h3>    
    <div id="container">
	<img class="recipe-image" src="${recipe.img}" alt="Image of ${recipe.name}">

	<h2>Ingredients:</h2>
	<div class="recipe-ingredients">
		<ul>
            ${recipe.ingredients.map(ingredient => html`<li>${ingredient}</li>`)}
		</ul>
	</div>

	<h2>Steps:</h2>
	<div class="recipe-steps">
		<ol>
        ${recipe.steps.map(step => html`<li>${step}</li>`)}
		</ol>
	</div>
</div>
`
export function detailsView(ctx) {
	const id = ctx.params.id;
	const user = JSON.parse(localStorage.getItem('user'));
	const recipe = getRecipe(id);

	recipe.then(result => {
		if (user) {
			if (user._id == result._ownerId) {
				ctx.render(detailsForUserTemplate(result));
			} else {
				ctx.render(detailsForNotUserTemplate(result));
			}

		} else {
			ctx.render(detailsForNotUserTemplate(result));
		}
	})
}