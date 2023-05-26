import { html } from '../lib/lit-html.js'
import { getInfoAboutCars } from '../service/requests.js';

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

export function catalogView(ctx) {
    let info = getInfoAboutCars();
    info.then(informations => {
        ctx.render(catalogTemplate(Object.values(informations)));
    })
}
