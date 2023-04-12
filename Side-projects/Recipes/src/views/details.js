import { html } from '../../node_modules/lit-html/lit-html.js'
import { getRecipe } from '../requests/requests.js';

const detailsTemplate = (recipe) =>
html`
    <h3 align="center">
     <a class="previous" href="/recipes"><-- previous</a>  Details for ${recipe.name}</h3>    
    <div id="container">
	<img class="recipe-image" src="${recipe.img}" alt="Image of ${recipe.name}">

	<h2>Ingredients:</h2>
	<div class="recipe-ingredients">
		<ul>
            ${recipe.ingredients.map(ingredient=>html`<li>${ingredient}</li>`)}
		</ul>
	</div>

	<h2>Steps:</h2>
	<div class="recipe-steps">
		<ol>
        ${recipe.steps.map(step=>html`<li>${step}</li>`)}
		</ol>
	</div>
</div>
`

export function detailsView(ctx) {
    const id = ctx.params.id;
    const recipe = getRecipe(id);
    recipe.then(result => {
        ctx.render(detailsTemplate(result));
    })
}