import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { getAllMyFurnitures } from '../requests/requests.js';

const root = document.querySelector('.container');

const myFurnitureTemplate = () =>
    html`
<div class="row space-top">
<div class="col-md-12">
    <h1>My Furniture</h1>
    <p>This is a list of your publications.</p>
</div>
</div>
`


const templateItems = (items) =>
    html`
    <div class="row space-top">

${items.map(item => html`   
<div class="col-md-4">
<div class="card text-white bg-primary">
    <div class="card-body">
            <img src="${item.img}" />
            <p>${item.description}</p>
            <footer>
                <p>Price: <span>${item.price} $</span></p>
            </footer>
            <div>
                <a href="${`/details/${item._id}`}" class="btn btn-info">Details</a>
            </div>
    </div>
</div>
</div>
`)}
</div>
`
export async function myFurnitureView() {
    const user = JSON.parse(localStorage.getItem('user'));
    let informations = await getAllMyFurnitures(user._id);
    let templates = [];
    templates.push(myFurnitureTemplate());
    templates.push(templateItems(informations));

    render(templates, root);
}