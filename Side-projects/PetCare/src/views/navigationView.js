import { html } from '../../node_modules/lit-html/lit-html.js';
import { getUser } from '../util.js';

const users = 
html`
 <!--Only Users-->
<li><a href="/create">Create Postcard</a></li>
<li><a href="/logout">Logout</a></li>
`
const guests = 
html`
<!--Only Guest-->
<li><a href="/login">Login</a></li>
<li><a href="/register">Register</a></li>
`

const navigationTemplate = (user) =>
html`
<nav>
     <section class="logo">
                <img src="./images/logo.png" alt="logo">
            </section>
            <ul>
                <!--Users and Guest-->
                <li><a href="/">Home</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
                ${
                    user ?
                    users :
                    guests
                }
                
            </ul>
        </nav>
`

export const navigationView = (ctx) => {
    return navigationTemplate(getUser());
}