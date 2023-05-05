import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import { getPet, getPetDonations, getPetDonationsForTheUser, sendDonation } from '../service/requests.js';
import { getUser } from '../util.js';

function donateHandler(e){
    e.preventDefault();
    const petId = document.querySelector('.details').id;
    sendDonation({ petId });
}

const detailsTemplate = (currentPet) =>
html`
<section id="detailsPage">
            <div class="details" id="${currentPet._id}">
                <div class="animalPic">
                    <img src="${currentPet.image}">
                </div>
                <div>
                    <div class="animalInfo">
                        <h1>Name: ${currentPet.name}</h1>
                        <h3>Breed: ${currentPet.breed}</h3>
                        <h4>Age: ${currentPet.age}</h4>
                        <h4>Weight: ${currentPet.weight}</h4>
                        <h4 class="donation">Donation: <span id="donateNumber">0</span>$</h4>
                    </div>
                    <div class="actionBtn">
                    ${
                        getUser() ? 
                        getUser()._id == currentPet._ownerId ? 
                        html`
                        
                        <a href="/edit/${currentPet._id}" class="edit">Edit</a>
                        <a href="/delete/${currentPet._id}" class="remove">Delete</a>
                        
                        `
                        : html`
                        <a @click=${donateHandler} class="donate" id="donate">Donate</a>
                        
                        `
                        : nothing                  
                    }
                    </div>
                                  
                </div>
            </div>
        </section>
`

export const detailsView = async (ctx) => {
    getPet(ctx.params.id).then(pet => {
        ctx.render(detailsTemplate(pet));
    })
    if (getUser()) {
        getPetDonationsForTheUser(ctx.params.id, getUser()._id).then(data => {
            if (data == 1) {
                if (document.getElementById('donate')) {
                  document.getElementById('donate').style.display = 'none';
                }
                getPetDonations(ctx.params.id).then(commonData => {
                    const countElement = document.getElementById('donateNumber');
                    countElement.textContent = commonData*100;
                  })
              } else {
                if (document.getElementById('donate')) {
                  document.getElementById('donate').style.display = 'inline-block';
                }
                getPetDonations(ctx.params.id).then(commonData => {
                    const countElement = document.getElementById('donateNumber');
                    countElement.textContent = commonData*100;
                  })
              }
        })
    
      } else {
        getPetDonations(ctx.params.id).then(data => {
          const countElement = document.getElementById('donateNumber');
          countElement.textContent = data*100;
        })
      }
}