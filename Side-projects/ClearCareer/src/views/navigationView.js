import { html } from '../../node_modules/lit-html/lit-html.js';
import { getUser } from '../util.js';

const guests =
html`
<div class="guest">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
`
const loggedInUsers =
html`
<div class="user">
            <a href="/create">Create Offer</a>
            <a href="/logout">Logout</a>
          </div>
`

const navigationTemplate = (user) =>
html`
<!-- Navigation -->
<a id="logo" href="/">
<img id="logo-img" src="data:image/png;base64,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" alt=""/></a>
        <nav>
          <div>
            <a href="/dashboard">Dashboard</a>
          </div>
          ${user ? loggedInUsers : guests}
        </nav>
`

export const navigationView = (ctx) => {
    return navigationTemplate(getUser());
}