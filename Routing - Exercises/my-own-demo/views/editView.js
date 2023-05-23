import { html } from '../node_modules/lit-html/lit-html.js'
import { editCar, getInfoAboutCars, getInfoAboutSingleCar } from '../service/requests.js';

function handlerEdit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = JSON.parse(localStorage.getItem('user'));

    let brand = formData.get('brand');
    let year = formData.get('year');
    let info = formData.get('info');
    let img = formData.get('img');

    if (brand != '' && year != '' && info != '' && img != '') {
        let car = getInfoAboutCars();
        car.then(result => {
            for (const key in result) {
                if (result[key].userId == user._id) {
                    editCar(key, { brand, year, info, img, userId: user._id, _id: result[key]._id });
                }
            }

        })
    }
}

const editTemplate = (car) => 
html`
<h1>Edit car info</h1>
<form @submit=${handlerEdit}>
  <label for="brand">Brand:</label><br>
  <input type="text" id="brand" name="brand" value=${car.brand}><br>

  <label for="year">Year:</label><br>
  <input type="text" id="year" name="year" value=${car.year}><br>

  <label for="info">Information:</label><br>
  <textarea id="info" name="info" rows="4" cols="50">${car.info}</textarea><br><br>

  <label for="img">URL image:</label><br>
  <input type="text" id="img" name="img" value=${car.img}><br>

  <input type="submit" value="Edit">
</form> 
<br>
<a href="/cars/${car._id}" class="previous">&laquo; Back</a>
`

export function editView(ctx) {
    const user = JSON.parse(localStorage.getItem('user'));
    let car = getInfoAboutCars();
    car.then(result => {
        Object.values(result).forEach(infoCar => {
            if (user._id == infoCar.userId) {
                ctx.render(editTemplate(infoCar));
            }
        })
    })

}