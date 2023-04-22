import { html } from '../../node_modules/lit-html/lit-html.js'
import { activeAtags } from '../utils.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipes = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

const homeTemplate = () =>
html`
    <header>
    <h2>Welcome to our website - best recipes!</h2>
	</header>
	<main>
		<p>Thank you for visiting our website. We hope you enjoy your stay.</p>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQzQx2O7tecVRHhdnyj3uuoj8q7R-3BY3fcA&usqp=CAU" width="400px" height="200px"/>
	</main>
	<footer>
		<p>Copyright &#169; 2023</p>
	</footer>
`

export function homeView(ctx) {
    activeAtags(home, [about, recipes, login, register, create, contact]);
    ctx.render(homeTemplate());
}