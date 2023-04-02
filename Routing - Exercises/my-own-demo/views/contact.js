import { html, render } from '../node_modules/lit-html/lit-html.js'

const contactTemplate = () => html`
<h1>Contact page</h1>
<p>Contact....</p>
`
const root = document.getElementById('root');

export function contactView() {
    render(contactTemplate(), root);
}