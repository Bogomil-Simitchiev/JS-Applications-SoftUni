import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import { getPet } from '../service/requests.js';
import { getUser } from '../util.js';

const detailsTemplate = (currentPet) =>
html`
<section id="detailsPage">
            <div class="details">
                <div class="animalPic">
                    <img src="${currentPet.image}">
                </div>
                <div>
                    <div class="animalInfo">
                        <h1>Name: ${currentPet.name}</h1>
                        <h3>Breed: ${currentPet.breed}</h3>
                        <h4>Age: ${currentPet.age}</h4>
                        <h4>Weight: ${currentPet.weight}</h4>
                        <h4 class="donation">Donation: 0$</h4>
                    </div>
                    ${
                        getUser() ? 
                        getUser()._id == currentPet._ownerId ? 
                        html`
                        <div class="actionBtn">
                        <a href="/edit/${currentPet._id}" class="edit">Edit</a>
                        <a href="/delete/${currentPet._id}" class="remove">Delete</a>
                        </div>
                        `
                        : html`
                        <div class="actionBtn">
                        <a href="#" class="donate">Donate</a>
                        </div>
                        `
                        : nothing                  
                    }
                                  
                </div>
            </div>
        </section>
`

export const detailsView = async (ctx) => {
    const currentPet = await getPet(ctx.params.id);
    ctx.render(detailsTemplate(currentPet));
}