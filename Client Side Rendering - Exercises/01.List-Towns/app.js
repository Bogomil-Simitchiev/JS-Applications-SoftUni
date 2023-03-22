import { renderTowns } from "./template.js";

const rootElement = document.getElementById('root');
const inputFieldElement = document.getElementById('towns');

document.getElementById('btnLoadTowns').addEventListener('click', (e) => {
    e.preventDefault();
    if (inputFieldElement.value != '') {
        let towns = inputFieldElement.value.split(', ');
        const resultRender = renderTowns(towns);
        rootElement.appendChild(resultRender);
    }
})
