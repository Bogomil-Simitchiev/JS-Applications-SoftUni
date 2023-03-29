import { html , render } from './node_modules/lite-html/lite-html.js';

const homeTemplate = () => html`
<h1>Home</h1>
<p>home info....</p>
`;

const aboutTemplate = () => html`
<h1>About</h1>
<p>about info....</p>
`;

const contactTemplate = () => html`
<h1>Contact</h1>
<p>contact info....</p>
`;

const routes = {
    '#home': homeTemplate,
    '#about': aboutTemplate,
    '#contact': contactTemplate
}
const root = document.getElementById('root');

window.addEventListener('hashchange', () => {
    let tempalte = routes[location.hash];
    render(tempalte(),root);
})