import { html } from '../../node_modules/lit-html/lit-html.js';
import { editPet, getPet } from '../service/requests.js';

function editHandler(e){
    e.preventDefault();
    
    const { name, breed, age, weight, image } = Object.fromEntries(new FormData(e.currentTarget));

    if (name!=='' && breed!=='' && age!=='' && weight!=='' && image!=='') {
        const id = document.querySelector('.editForm').id;
         editPet(id, { name, breed, age, weight, image});
    }
}

const editTemplate = (currentPet) =>
html`
<section id="editPage">
            <form class="editForm" @submit=${editHandler} id="${currentPet._id}">
                <img src="../images/editpage-dog.jpg">
                <div>
                    <h2>Edit PetPal</h2>
                    <div class="name">
                        <label for="name">Name:</label>
                        <input name="name" id="name" type="text" value="${currentPet.name}">
                    </div>
                    <div class="breed">
                        <label for="breed">Breed:</label>
                        <input name="breed" id="breed" type="text" value="${currentPet.breed}">
                    </div>
                    <div class="Age">
                        <label for="age">Age:</label>
                        <input name="age" id="age" type="text" value="${currentPet.age}">
                    </div>
                    <div class="weight">
                        <label for="weight">Weight:</label>
                        <input name="weight" id="weight" type="text" value="${currentPet.weight}">
                    </div>
                    <div class="image">
                        <label for="image">Image:</label>
                        <input name="image" id="image" type="text" value="${currentPet.image}">
                    </div>
                    <button class="btn" type="submit">Edit Pet</button>
                </div>
            </form>
        </section>
`

export const editView = async (ctx) => {
    const currentPet = await getPet(ctx.params.id);
    ctx.render(editTemplate(currentPet));
}