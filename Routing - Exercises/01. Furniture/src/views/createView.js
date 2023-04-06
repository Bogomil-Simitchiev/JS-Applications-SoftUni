import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { createFurniture } from '../requests/requests.js';

const root = document.querySelector('.container');

function createHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const make = formData.get('make');
    const year = formData.get('year');
    const model = formData.get('model');
    const description = formData.get('description');
    const price = formData.get('price');
    const img = formData.get('img');
    const material = formData.get('material');

    if (make != '' && model != '' && year != '' && description != '' && price != '' && img != '' && material != '') {
        console.log('Make: ' + make);
        console.log('Year: ' + year);
        console.log('Model: ' + model);
        console.log('Description: ' + description);
        console.log('Price: ' + price);
        console.log('Img: ' + img);
        console.log('Material: ' + material);

        // TODO: make validation for the css classes
        
        const user = JSON.parse(localStorage.getItem('user'));

        const furniture = {
            _ownerId: user._id,
            make,
            model,
            year,
            description,
            price,
            img,
            material,

        }
        createFurniture(furniture, user);

    }



}

const createTemplate = () =>
    html`
<div class="row space-top">
<div class="col-md-12">
    <h1>Create New Furniture</h1>
    <p>Please fill all fields.</p>
</div>
</div>
<form @submit=${createHandler}>
<div class="row space-top">
    <div class="col-md-4">
        <div class="form-group">
            <label class="form-control-label" for="new-make">Make</label>
            <input class="form-control" id="new-make" type="text" name="make">
        </div>
        <div class="form-group has-success">
            <label class="form-control-label" for="new-model">Model</label>
            <input class="form-control" id="new-model" type="text" name="model">
        </div>
        <div class="form-group has-danger">
            <label class="form-control-label" for="new-year">Year</label>
            <input class="form-control" id="new-year" type="number" name="year">
        </div>
        <div class="form-group">
            <label class="form-control-label" for="new-description">Description</label>
            <input class="form-control" id="new-description" type="text" name="description">
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label class="form-control-label" for="new-price">Price</label>
            <input class="form-control" id="new-price" type="number" name="price">
        </div>
        <div class="form-group">
            <label class="form-control-label" for="new-image">Image</label>
            <input class="form-control" id="new-image" type="text" name="img">
        </div>
        <div class="form-group">
            <label class="form-control-label" for="new-material">Material (optional)</label>
            <input class="form-control" id="new-material" type="text" name="material">
        </div>
        <input type="submit" class="btn btn-primary" value="Create" />
    </div>
</div>
</form>
`
export function createView() {
    render(createTemplate(), root);
}