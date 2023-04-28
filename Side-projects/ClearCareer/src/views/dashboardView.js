import { html } from '../../node_modules/lit-html/lit-html.js';
import { getAllOffers } from '../services/requests.js';

const offerTemplate = (offer) =>
  html`
<div class="offer">
        <img src="${offer.imageUrl}" alt="example1" />
        <p>
          <strong>Title: </strong><span class="title">${offer.title}</span>
        </p>
        <p><strong>Salary:</strong><span class="salary">${offer.salary}</span></p>
        <a class="details-btn" href="/details/${offer._id}">Details</a>
      </div>
`

const dashboardTemplate = (offers) =>
  html`
    <!-- Dashboard page -->
    <section id="dashboard">
      <h2>Job Offers</h2>

      <!-- Display a div with information about every post (if any)-->
      ${offers.length > 0
      ? offers.map(offer => offerTemplate(offer))
      : html`<!-- Display an h2 if there are no posts --> <h2>No offers yet.</h2>`
    }   
    </section>
`

export const dashboardView = (ctx) => {
  getAllOffers().then(offers => {
    ctx.render(dashboardTemplate(offers));
  })
}