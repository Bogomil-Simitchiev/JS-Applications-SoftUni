import { html } from '../../node_modules/lit-html/lit-html.js';
import { login } from '../service/requests.js';
import { setUser } from '../util.js';

async function loginHandler(e) {
    e.preventDefault();

    const { email, password } = Object.fromEntries(new FormData(e.currentTarget));

    if (email !== '' && password !== '') {
        const user = await login({ email, password });
        if (user) {
            setUser(user);
        }
    }
}

const loginTemplate = () =>
html`
<section id="loginPage">
            <form class="loginForm" @submit=${loginHandler}>
                <img src="./images/logo.png" alt="logo" />
                <h2>Login</h2>

                <div>
                    <label for="email">Email:</label>
                    <input id="email" name="email" type="text" placeholder="steven@abv.bg" value="">
                </div>

                <div>
                    <label for="password">Password:</label>
                    <input id="password" name="password" type="password" placeholder="********" value="">
                </div>

                <button class="btn" type="submit">Login</button>

                <p class="field">
                    <span>If you don't have profile click <a href="#">here</a></span>
                </p>
            </form>
        </section>
`

export const loginView = (ctx) => {
    ctx.render(loginTemplate());
}
