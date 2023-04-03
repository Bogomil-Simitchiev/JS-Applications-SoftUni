import page from '../node_modules/page/page.mjs'

import { html, render } from '../node_modules/lit-html/lit-html.js'
import { delCar, getInfoAboutSingleCar } from '../requests/requests.js';

function deleteCar(e) {
    e.preventDefault();
    const id = e.currentTarget.parentNode.id;
    if (confirm('Are you sure you want to delete this car?') == true) {
        delCar(id);
    }

}
function editCar(e) {
    e.preventDefault();
    page.redirect('/edit');
}

const templateWithoutPer = (car) => html`
     <article id="${Number(car._id)}">
     <h1>${car.brand}</h1>
     <p>${car.info}</p>
     <img src="${car.img}"/>
     <br>
     <br>
     <a href="/catalog" class="previous">&laquo; Back</a>
     </article>
`

const carTemplate = (car) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if (car.userId) {
            if (user._id == car.userId) {
                return html`
                <article id="${Number(car._id) || car._id}">
                <h1>${car.brand}</h1>
                <p>${car.info}</p>
                <img src="${car.img}"/>
                <br>
                <br>
                <button class="deleteBtn" @click=${deleteCar} >Delete</button>
                <button class="editBtn" @click=${editCar} >Edit</button>
                <br>
                </article>
                <br>
                <a href="/catalog" class="previous">&laquo; Back</a>
                
                `
            } else {
                return templateWithoutPer(car);
            }
        } else {
            return templateWithoutPer(car);
        }
    } else {
        return templateWithoutPer(car);
    }
}

export const carView = (ctx) => {
    let infoAboutCar = getInfoAboutSingleCar(ctx.params.id);
    infoAboutCar.then(result => {
        render(carTemplate(result), document.querySelector('#root'));
    });
}