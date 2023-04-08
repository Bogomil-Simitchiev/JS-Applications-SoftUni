import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { createFurniture } from '../requests/requests.js';
import { activeAtags } from '../utils.js';
const root = document.querySelector('.container');

const catalogLink = document.getElementById('catalogLink');
const createLink = document.getElementById('createLink');
const profileLink = document.getElementById('profileLink');
const logoutBtn = document.getElementById('logoutBtn');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');

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

    if (make != '' && model != '' && year != '' && description != '' && price != '' && img != '') {

        let isValidMake = true;
        let isValidModel = true;
        let isValidYear = true;
        let isValidDescription = true;
        let isValidPrice = true;

        if (img == '') {
            document.getElementById('new-image').classList.add('is-invalid');
        }

        //make validation
        if (make.length < 4) {
            isValidMake = false;
            document.getElementById('new-make').classList.remove('is-valid');
            document.getElementById('new-make').classList.add('is-invalid');
        } else {
            isValidMake = true;
            document.getElementById('new-make').classList.remove('is-invalid');
            document.getElementById('new-make').classList.add('is-valid');
        }

        //model validation
        if (model.length < 4) {
            isValidModel = false;
            document.getElementById('new-model').classList.remove('is-valid');
            document.getElementById('new-model').classList.add('is-invalid');
        } else {
            isValidModel = true;
            document.getElementById('new-model').classList.remove('is-invalid');
            document.getElementById('new-model').classList.add('is-valid');
        }

        //year validation
        if (year >= 1950 && year <= 2050) {
            isValidYear = true;
            document.getElementById('new-year').classList.remove('is-invalid');
            document.getElementById('new-year').classList.add('is-valid');
        } else {
            isValidYear = false;
            document.getElementById('new-year').classList.remove('is-valid');
            document.getElementById('new-year').classList.add('is-invalid');
        }

        //description validation
        if (description.length <= 10) {
            isValidDescription = false;
            document.getElementById('new-description').classList.remove('is-valid');
            document.getElementById('new-description').classList.add('is-invalid');
        } else {
            isValidDescription = true;
            document.getElementById('new-description').classList.remove('is-invalid');
            document.getElementById('new-description').classList.add('is-valid');
        }

        //price validation
        if (price < 0) {
            isValidPrice = false;
            document.getElementById('new-price').classList.remove('is-valid');
            document.getElementById('new-price').classList.add('is-invalid');
        } else {
            isValidPrice = true;
            document.getElementById('new-price').classList.remove('is-invalid');
            document.getElementById('new-price').classList.add('is-valid');
        }


        if (isValidMake && isValidModel && isValidYear && isValidDescription && isValidPrice) {
            const user = JSON.parse(localStorage.getItem('user'));

            document.getElementById('new-image').classList.remove('is-invalid');
            document.getElementById('new-image').classList.add('is-valid');

            const furniture = {
                _ownerId: user._id,
                make,
                model,
                year: Number(year),
                description,
                price: Number(price),
                img,
                material,
            }
            createFurniture(furniture, user);
        }

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
    activeAtags(createLink, [registerLink, profileLink, logoutBtn, catalogLink, loginLink]);
    render(createTemplate(), root);
}