import page from '../node_modules/page/page.mjs'

import { html, render } from '../node_modules/lit-html/lit-html.js'
import { delCar, getCarLikes, getInfoAboutSingleCar, like } from '../requests/requests.js';

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
const templateWithoutPerWithLikeButton = (car, likes, onLike, onUnlike, isLiked) => html`
     <article id="${Number(car._id)}">
     <h1>${car.brand}</h1>
     <p>${car.info}</p>
     <img src="${car.img}"/>
     <br>
     <br>
     <a href="/catalog" class="previous">&laquo; Back</a>
     <br>
     <br>
     <br>
     ${isLiked ? html`<button class="likeBtn" @click=${() => onUnlike()}>Unlike</button>` : html`<button class="likeBtn" @click=${() => onLike(car)} >Like</button>`}
     
     <p>Likes: ${likes}</p>
     </article>
`

const templateWithoutPer = (car, likes) => html`
     <article id="${Number(car._id)}">
     <h1>${car.brand}</h1>
     <p>${car.info}</p>
     <img src="${car.img}"/>
     <br>
     <br>
     <a href="/catalog" class="previous">&laquo; Back</a>
     <p>Likes: ${likes}</p>
     </article>
`

const carTemplate = (car, likes, onLike, onUnlike, isLiked) => {
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
                <p>Likes: ${likes}</p>
                
                `
            } else {
                return templateWithoutPerWithLikeButton(car, likes, onLike,onUnlike, isLiked);
            }
        } else {
            return templateWithoutPerWithLikeButton(car, likes, onLike,onUnlike, isLiked);
        }
    } else {
        return templateWithoutPer(car, likes);
    }
}

export const carView = async (ctx) => {

    const onLike = (car) => {
        like({ carId: car._id });
    }
    const onUnlike = () => {
        console.log('Unlike!');
    }


    let infoAboutCar = getInfoAboutSingleCar(ctx.params.id);
    infoAboutCar.then(result => {
        let likesOfCar = getCarLikes(result._id);
        likesOfCar.then(likes => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                let isLiked = likes.some(x => x._ownerId == user._id);
                render(carTemplate(result, likes.length, onLike,onUnlike, isLiked), document.querySelector('#root'));
            } else {

                render(carTemplate(result, likes.length, onLike, onUnlike), document.querySelector('#root'));
            }

        })
    });
}