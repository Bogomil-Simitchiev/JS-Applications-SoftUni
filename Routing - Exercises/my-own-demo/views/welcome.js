import { html, render } from '../node_modules/lit-html/lit-html.js'

const welcomeTemplate = () => html`
<header>
		<h1>Welcome to our website - Best cars</h1>
	</header>
	<main>
		<p>Thank you for visiting our website. We hope you enjoy your stay.</p>
        <img src="../photos/cars.png" width="400px" height="200px"/>
	</main>
	<footer>
		<p>Copyright &#169; 2023</p>
	</footer>
`
const root = document.getElementById('root');

export function welcomeView() {
    render(welcomeTemplate(), root);
}
