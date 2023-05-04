import { html } from '../../node_modules/lit-html/lit-html.js';
import { getAllPets } from '../service/requests.js';

const petTemplate = (pet) => 
html`
    <div class="animals-board">
                    <article class="service-img">
                <img class="animal-image-cover" src="${pet.image}">
                    </article>
                    <h2 class="name">${pet.name}</h2>
                    <h3 class="breed">${pet.breed}</h3>
                    <div class="action">
                        <a class="btn" href="/details/${pet._id}">Details</a>
                    </div>
                </div>
`

const dashboardTemplate = (pets) =>
html`
<section id="dashboard">
            <h2 class="dashboard-title">Services for every animal</h2>
            <div class="animals-dashboard">
               ${ 
                    pets.length >0 ?
                    pets.map(pet=>petTemplate(pet)) :
                    html`
                    <div>
                    <p class="no-pets">No pets in dashboard</p>
                    </div>
                    `              
                }           
            </div>
        </section>
`

export const dashboardView = async(ctx) => {
    await getAllPets().then(pets=>{
        ctx.render(dashboardTemplate(pets));    
    })
    
}