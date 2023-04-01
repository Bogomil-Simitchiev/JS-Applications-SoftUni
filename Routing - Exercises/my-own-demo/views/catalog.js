import { html, render } from '../node_modules/lit-html/lit-html.js'
import { getInfoAboutCars } from '../requests/requests.js';

const catalogTemplate = (informations) => html`
${informations.map(info =>
    html`
        <main>
        <h1>Car: ${info.brand}</h1>
        <h3>Year of made: ${info.year}</h3>
        <img src="${info.img}"/>
        <a href="/cars/${Number(info._id) || info._id}">read more...</a>
        </main>
        `)}`
const root = document.getElementById('root');

export function catalogView() {
    let info = getInfoAboutCars();
    info.then(informations => {
        render(catalogTemplate(Object.values(informations)), root);
    })
}
