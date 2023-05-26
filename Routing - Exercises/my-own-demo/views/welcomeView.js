import { html } from '../lib/lit-html.js'

const welcomeTemplate = () => 
html`
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

export function welcomeView(ctx) {
	ctx.render(welcomeTemplate());
}