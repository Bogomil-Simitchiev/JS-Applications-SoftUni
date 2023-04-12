import { html } from '../../node_modules/lit-html/lit-html.js'
import { getRecipe } from '../requests/requests.js';

const detailsTemplate = () =>
    html`
    <h2>Details</h2>
    
`

export function detailsView(ctx) {
    const id = ctx.params.id;
    const recipe = getRecipe(id);
    recipe.then(result => console.log(result));
    ctx.render(detailsTemplate());
}