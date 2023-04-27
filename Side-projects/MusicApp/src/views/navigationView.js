import { html } from '../../node_modules/lit-html/lit-html.js';
import { getUser } from '../utils/utils.js';

const guests =
html` 
<li><a href="/login">Login</a></li>
<li><a href="/register">Register</a></li>
`
const users =
html` 
<li><a href="/create">Create Album</a></li>
<li><a href="/logout">Logout</a></li>
`

const navigationTemplate = (user) =>
html`
<nav>
    <img src="./images/headphones.png">
    <a href="/">Home</a>
    <ul>
        <!--All user-->
        <li><a href="/catalog">Catalog</a></li>
        <li><a href="/search">Search</a></li>
       ${user ? users : guests}

    </ul>
</nav>
`

export const navigationView = (ctx) => {
    return navigationTemplate(getUser());
}  