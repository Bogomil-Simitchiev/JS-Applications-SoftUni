import { html, render } from '../node_modules/lit-html/lit-html.js'
import { getInfoAboutSingleCar } from '../requests/requests.js';

const carTemplate = (car) => html`
<article>
<h1>${car.brand}</h1>
<p>${car.info}</p>
<img src="${car.img}"/>
</article>
`

export const carView = (ctx) => {
    let infoAboutCar = getInfoAboutSingleCar(ctx.params.id);
    infoAboutCar.then(result => {
        render(carTemplate(result), document.querySelector('#root'));
    });
}