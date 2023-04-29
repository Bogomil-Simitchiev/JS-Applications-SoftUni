import { html } from '../../node_modules/lit-html/lit-html.js';
import { editOffer, getOffer } from '../services/requests.js';

function editHandler(e){
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    const imageUrl = formData.get('imageUrl');
    const category = formData.get('category');
    const description = formData.get('description');
    const requirements = formData.get('requirements');
    const salary = formData.get('salary');

    const id = document.querySelector('.edit-form').id;

    if (title !== '' && imageUrl !== '' && category !== '' && description !== ''
        && requirements !== '' && salary !== '') {
        editOffer({ title, imageUrl, category, description, requirements, salary }, id);
    }
}

const editTemplate = (offer) =>
html`
    <!-- Edit Page (Only for logged-in users) -->
    <section id="edit">
          <div class="form">
            <h2>Edit Offer</h2>
            <form class="edit-form" @submit=${editHandler} id="${offer._id}">
              <input
                type="text"
                name="title"
                id="job-title"
                placeholder="Title"
                value="${offer.title}"
              />
              <input
                type="text"
                name="imageUrl"
                id="job-logo"
                placeholder="Company logo url"
                value="${offer.imageUrl}"
              />
              <input
                type="text"
                name="category"
                id="job-category"
                placeholder="Category"
                value="${offer.category}"
              />
              <textarea
                id="job-description"
                name="description"
                placeholder="Description"
                rows="4"
                cols="50"
              >${offer.description}</textarea>
              <textarea
                id="job-requirements"
                name="requirements"
                placeholder="Requirements"
                rows="4"
                cols="50"
              >${offer.requirements}</textarea>
              <input
                type="text"
                name="salary"
                id="job-salary"
                placeholder="Salary"
                value="${offer.salary}"
              />

              <button type="submit">post</button>
            </form>
          </div>
        </section>
`

export const editView = (ctx) => {
    getOffer(ctx.params.id).then(offer => {
        ctx.render(editTemplate(offer));
    })
}