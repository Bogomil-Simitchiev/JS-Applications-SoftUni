import { html, render } from '../node_modules/lit-html/lit-html.js'
import { getInfoAboutSingleCar } from '../requests/requests.js';
import page from '../node_modules/page/page.mjs';

function deleteCar(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const id = e.currentTarget.parentNode.id;
        fetch(`http://localhost:3030/jsonstore/cars/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(() => {
                alert('Successfully deleted!');
                page.redirect('/catalog');
            })
            .catch(err => console.log(err))
    }

}
function editCar(e){
    e.preventDefault();

}

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
                return html`
            <article id="${Number(car._id)}">
            <h1>${car.brand}</h1>
            <p>${car.info}</p>
            <img src="${car.img}"/>
            <br>
            <br>
            <a href="/catalog" class="previous">&laquo; Back</a>
            </article>
            
            `
            }
        } else {
            return html`
            <article id="${Number(car._id)}">
            <h1>${car.brand}</h1>
            <p>${car.info}</p>
            <img src="${car.img}"/>
            <br>
            <br>
            <a href="/catalog" class="previous">&laquo; Back</a>
            </article>
            
            `
        }
    } else {
        return html`
        <article id="${Number(car._id)}">
        <h1>${car.brand}</h1>
        <p>${car.info}</p>
        <img src="${car.img}"/>
        <br>
        <br>
        <a href="/catalog" class="previous">&laquo; Back</a>
        </article>
        
        `
    }
}

export const carView = (ctx) => {
    let infoAboutCar = getInfoAboutSingleCar(ctx.params.id);
    infoAboutCar.then(result => {
        render(carTemplate(result), document.querySelector('#root'));
    });
}