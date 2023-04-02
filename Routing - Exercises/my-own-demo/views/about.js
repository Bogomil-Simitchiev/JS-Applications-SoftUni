import { html, render } from '../node_modules/lit-html/lit-html.js'

const aboutTemplate = () => html`
<h1>About page</h1>
<p>About....</p>
`
const root = document.getElementById('root');

export function aboutView() {
    render(aboutTemplate(), root);
}