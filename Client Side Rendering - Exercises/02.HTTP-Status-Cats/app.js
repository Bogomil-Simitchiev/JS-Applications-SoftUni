import { cats } from "./catSeeder.js";
import { renderCats } from "./template.js";

const catsRendered = renderCats(cats);

const section = document.getElementById('allCats')
section.appendChild(catsRendered);
section.addEventListener('click', onClickButton);

function onClickButton(e) {
    if (e.target.tagName == 'BUTTON') {
        const divElement = e.target.parentNode.querySelector('.status');
        if (divElement.style.display == 'none') {
            divElement.style.display = 'block';
            e.target.textContent = 'Hide status code';
        } else {
            divElement.style.display = 'none';
            e.target.textContent = 'Show status code';
        }
    }
}