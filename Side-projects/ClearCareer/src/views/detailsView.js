import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import { applyForOffer, getOffer, getOfferApplies, getOfferAppliesForTheUser } from '../services/requests.js';
import { getUser } from '../util.js';

function applyHandler(e) {
  e.preventDefault();
  const offerId = document.querySelector('#details-wrapper').className;
  applyForOffer({ offerId });
}

const detailsTemplate = (offer, user) =>
  html`
    <!-- Details page -->
    <section id="details">
      <div id="details-wrapper" class="${offer._id}">
        <img id="details-img" src="${offer.imageUrl}" alt="example1" />
        <p id="details-title">${offer.title}</p>
        <p id="details-category">
          Category: <span id="categories">${offer.category}</span>
        </p>
        <p id="details-salary">
          Salary: <span id="salary-number">${offer.salary}</span>
        </p>
        <div id="info-wrapper">
          <div id="details-description">
            <h4>Description</h4>
            <span>${offer.description}</span
            >
          </div>
          <div id="details-requirements">
            <h4>Requirements</h4>
            <span>${offer.requirements}</span
            >
          </div>
        </div>
      
        <p>Applications: <strong id="applications">0</strong></p>
        ${user ? user._id == offer._ownerId ? html` 
        <div id="action-buttons">
          <a href="/edit/${offer._id}" id="edit-btn">Edit</a>
          <a href="/delete/${offer._id}" id="delete-btn">Delete</a>
        </div>

        ` : html`
       
        <div id="action-buttons">
            <!--Bonus - Only for logged-in users ( not authors )-->
           <a @click=${applyHandler} id="apply-btn">Apply</a>
        </div>

        `  : nothing}        
      </div>
    </section>
`

export const detailsView = (ctx) => {

  getOffer(ctx.params.id).then(offer => {
    ctx.render(detailsTemplate(offer, getUser()));
  })

  if (getUser()) {
    getOfferAppliesForTheUser(ctx.params.id, getUser()._id).then(data => {
      if (data == 1) {
        if (document.getElementById('apply-btn')) {
          document.getElementById('apply-btn').style.display = 'none';
        }
      } else {
        if (document.getElementById('apply-btn')) {
          document.getElementById('apply-btn').style.display = 'inline-block';
        }
      }
      getOfferApplies(ctx.params.id).then(commonData => {
        const countElement = document.getElementById('applications');
        countElement.textContent = commonData;
      })

    })

  } else {
    getOfferApplies(ctx.params.id).then(data => {
      const countElement = document.getElementById('applications');
      countElement.textContent = data;
    })
  }

}