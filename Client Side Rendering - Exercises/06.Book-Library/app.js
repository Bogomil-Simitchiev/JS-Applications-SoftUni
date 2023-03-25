import { render } from "../node_modules/lit-html/lit-html.js";
import { templateBook } from "./templates.js";
import { getAllBooks, postBook, deleteBook, updateBook } from "./requests.js";

// get books
const btnLoadElement = document.getElementById('loadBooks');
let tbodyElement = document.querySelector('tbody');
btnLoadElement.addEventListener('click', async (e) => {
    e.preventDefault();
    let books = await getAllBooks();
    let templates = [];
    for (const key in books) {
        templates.push(templateBook(books[key], key));
    }
    render(templates, tbodyElement);
})

//send book
const formElement = document.querySelector('#add-form');
const editFormElement = document.querySelector('#edit-form');
formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formElement);
    let author = formData.get('author');
    let title = formData.get('title');
    if (author != '' && title != '') {
        postBook(author, title);
        formElement.querySelectorAll('input[type="text"]').forEach(e => e.value = '');
    }

})

//delete book
tbodyElement.addEventListener('click', (e) => {
    if (e.target.tagName == 'BUTTON' && e.target.textContent == 'Delete') {
        let id = e.target.parentNode.parentNode.id;
        deleteBook(id);
        e.target.parentNode.parentNode.remove();
    }
})

//edit book
tbodyElement.addEventListener('click', (e) => {
    if (e.target.tagName == 'BUTTON' && e.target.textContent == 'Edit') {
        const tdElements = e.target.parentNode.parentNode.querySelectorAll('td');
        let id = e.target.parentNode.parentNode.id;

        editFormElement.style.display = 'block'
        formElement.style.display = 'none';

        let inputFields = editFormElement.querySelectorAll('input[type="text"]');

        inputFields[0].value = tdElements[0].textContent;
        inputFields[1].value = tdElements[1].textContent;

        editFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(editFormElement);
            let author = formData.get('author');
            let title = formData.get('title');
            if (author != '' && title != '') {

                updateBook(id, author, title);
                editFormElement.style.display = 'none'
                formElement.style.display = 'block';
            }
        })
    }
})