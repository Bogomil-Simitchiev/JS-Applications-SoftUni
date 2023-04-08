import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { getSingleFurniture } from '../requests/requests.js';
const root = document.querySelector('.container');

const templateForUserWithDot = (info) =>
html`
<div class="row space-top">
<div class="col-md-12">
    <h1>Furniture Details</h1>
</div>
</div>
<div class="row space-top">
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src=".${info.img}" />
        </div>
    </div>
</div>
<div class="col-md-4">
    <p>Make: <span>${info.make}</span></p>
    <p>Model: <span>${info.model}</span></p>
    <p>Year: <span>${info.year}</span></p>
    <p>Description: <span>${info.description}</span></p>
    <p>Price: <span>${info.price} $</span></p>
    <p>Material: <span>${info.material}</span></p>
    <div>
   <a href="/edit/${info._id}" class="btn btn-info">Edit</a>
   <a href="/delete/${info._id}" class="btn btn-red">Delete</a>
</div>
</div>
</div>
`
const templateForUserWithoutDot = (info) => 
html`
<div class="row space-top">
<div class="col-md-12">
    <h1>Furniture Details</h1>
</div>
</div>
<div class="row space-top">
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src="${info.img}" />
        </div>
    </div>
</div>
<div class="col-md-4">
    <p>Make: <span>${info.make}</span></p>
    <p>Model: <span>${info.model}</span></p>
    <p>Year: <span>${info.year}</span></p>
    <p>Description: <span>${info.description}</span></p>
    <p>Price: <span>${info.price} $</span></p>
    <p>Material: <span>${info.material}</span></p>
    <div>
   <a href="/edit/${info._id}" class="btn btn-info">Edit</a>
   <a href="/delete/${info._id}" class="btn btn-red">Delete</a>
</div>
</div>
</div>
`
const templateForNotUserWithDot = (info) => 
html`
<div class="row space-top">
<div class="col-md-12">
    <h1>Furniture Details</h1>
</div>
</div>
<div class="row space-top">
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src=".${info.img}" />
        </div>
    </div>
</div>
<div class="col-md-4">
    <p>Make: <span>${info.make}</span></p>
    <p>Model: <span>${info.model}</span></p>
    <p>Year: <span>${info.year}</span></p>
    <p>Description: <span>${info.description}</span></p>
    <p>Price: <span>${info.price} $</span></p>
    <p>Material: <span>${info.material}</span></p>
</div>
</div>
`
const templateForNotUserWithoutDot = (info) => 
html`
<div class="row space-top">
<div class="col-md-12">
    <h1>Furniture Details</h1>
</div>
</div>
<div class="row space-top">
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src="${info.img}" />
        </div>
    </div>
</div>
<div class="col-md-4">
    <p>Make: <span>${info.make}</span></p>
    <p>Model: <span>${info.model}</span></p>
    <p>Year: <span>${info.year}</span></p>
    <p>Description: <span>${info.description}</span></p>
    <p>Price: <span>${info.price} $</span></p>
    <p>Material: <span>${info.material}</span></p>
</div>
</div>
`

function detailsForUserTemplate(info) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user._id == info._ownerId) {
        if (info.img.startsWith('.')) {
            return templateForUserWithDot(info);
        } else {
            return templateForUserWithoutDot(info);
        }
    } else {
        if (info.img.startsWith('.')) {
            return templateForNotUserWithDot(info);
        } else {
            return templateForNotUserWithoutDot(info);
        }
    }

}

function detailsForNotUserTemplate(info) {
    if (info.img.startsWith('.')) {
        return templateForNotUserWithDot(info);
    } else {
        return templateForNotUserWithoutDot(info);
    }
}

export async function detailsView(ctx) {
    const user = JSON.parse(localStorage.getItem('user'));
    let templates = [];
    if (user) {
        const furniture = await getSingleFurniture(ctx.params.id);
        if (furniture._ownerId == user._id) {
            templates.push(detailsForUserTemplate(furniture));
        } else {
            templates.push(detailsForNotUserTemplate(furniture));
        }

    } else {
        const furniture = await getSingleFurniture(ctx.params.id);
        templates.push(detailsForNotUserTemplate(furniture));
    }
    render(templates, root);
}