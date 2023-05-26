import { html } from '../lib/lit-html.js'
import { editCar, getInfoAboutSingleCar } from '../service/requests.js';

const editTemplate = (car, handler) => 
html`
<h1>Edit car info</h1>
<form @submit=${handler}>
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
    function handlerEdit(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user = JSON.parse(localStorage.getItem('user'));
    
        let brand = formData.get('brand');
        let year = formData.get('year');
        let info = formData.get('info');
        let img = formData.get('img');
    
        if (brand != '' && year != '' && info != '' && img != '') {
            let car = getInfoAboutSingleCar(ctx.params.id);
            car.then(carInfo=>{
                editCar(carInfo._id, { brand, year, info, img, userId: user._id, _id: carInfo._id });
            })
            
        }
    }
    
    let car = getInfoAboutSingleCar(ctx.params.id);
    car.then(carInfo => {
        ctx.render(editTemplate(carInfo,handlerEdit));
        
    })

}