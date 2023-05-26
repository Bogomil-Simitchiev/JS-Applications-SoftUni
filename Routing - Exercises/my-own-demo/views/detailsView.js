import page from '../lib/page.js'
import { html } from '../lib/lit-html.js'
import { delCar, deleteLike, getCarLikes, getInfoAboutSingleCar, like } from '../service/requests.js';

function deleteCar(e) {
    e.preventDefault();
    const id = e.currentTarget.parentNode.id;
    if (confirm('Are you sure you want to delete this car?') == true) {
        delCar(id);
    }
}

function editCar(id) {
    page.redirect(`/edit/${id}`);
}

const templateWithLikeButton = (car, likes, onLike, onUnlike, isLiked, currentUserLike) => 
html`
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
     ${isLiked ? html`<button class="likeBtn buttonLike" @click=${() => onUnlike(currentUserLike)}>Unlike</button>` : html`<button class="likeBtn buttonLike" @click=${() => onLike(car)} >Like</button>`}
     <p>Likes: ${likes}</p>
     </article>
`

const templateWithoutLikeButton = (car, likes) => 
html`
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

const carTemplate = (car, likes, onLike, onUnlike, isLiked, currentUserLike) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if (user._id == car.userId) {
            return html`
                <article id="${Number(car._id) || car._id}">
                <h1>${car.brand}</h1>
                <p>${car.info}</p>
                <img src="${car.img}"/>
                <br>
                <br>
                <button class="deleteBtn buttonDelete" @click=${deleteCar} >Delete</button>
                <button class="editBtn buttonEdit" @click=${()=> editCar(car._id)} >Edit</button>
                <br>
                </article>
                <br>
                <a href="/catalog" class="previous">&laquo; Back</a>
                <p>Likes: ${likes}</p>  
                `
        } else {
            return templateWithLikeButton(car, likes, onLike, onUnlike, isLiked, currentUserLike);
        }
    } else {
        return templateWithoutLikeButton(car, likes);
    }
}

export const carView = async (ctx) => {
    const onLike = (car) => {
        like({ carId: car._id });
    }
    const onUnlike = (like) => {
        deleteLike(like._id,ctx.params.id);
    }

    let infoAboutCar = getInfoAboutSingleCar(ctx.params.id);
    infoAboutCar.then(result => {
        let likesOfCar = getCarLikes(result._id);
        likesOfCar.then(likes => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                let isLiked = likes.some(x => x._ownerId == user._id);
                let currentUserLike = likes.find(x => x._ownerId == user._id);
                ctx.render(carTemplate(result, likes.length, onLike,onUnlike, isLiked, currentUserLike));
            } else {
                ctx.render(carTemplate(result, likes.length, onLike, onUnlike));
            }

        })
    });
}