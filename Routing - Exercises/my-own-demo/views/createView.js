import { html } from '../lib/lit-html.js'
import { createCar } from '../service/requests.js';

function handlerSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = JSON.parse(localStorage.getItem('user'));

    let brand = formData.get('brand');
    let year = formData.get('year');
    let info = formData.get('info');
    let img = formData.get('img');

    if (brand != '' && year != '' && info != '' && img != '') {
        let car = {
            brand,
            year,
            info,
            img,
            userId:user._id
        }
        createCar(car);
    }

}

const createTemplate = () => 
html`
<form @submit=${handlerSubmit}>
  <label for="brand">Brand:</label><br>
  <input type="text" id="brand" name="brand"><br>

  <label for="year">Year:</label><br>
  <input type="text" id="year" name="year"><br>

  <label for="info">Information:</label><br>
  <textarea id="info" name="info" rows="4" cols="50"></textarea><br><br>

  <label for="img">URL image:</label><br>
  <input type="text" id="img" name="img"><br>

  <input type="submit" value="Create">
</form> 
`

export function createView(ctx) {
    ctx.render(createTemplate());
}