import { html } from '../../node_modules/lit-html/lit-html.js';
import { register } from '../service/requests.js';
import { setUser } from '../util.js';

async function registerHandler(e) {
    e.preventDefault();

    const { email, password, repeatPassword } = Object.fromEntries(new FormData(e.currentTarget));

    if (email !== '' && password !== '' && repeatPassword !== '') {
        if (password == repeatPassword) {
            const user = await register({ email, password });
            setUser(user);
        }else{
            alert('Repeat password doesn\'t match');
            document.getElementById('repeatPassword').value = '';
        }
    }

}

const registerTemplate = () =>
html`
 <section id="registerPage">
            <form class="registerForm" @submit=${registerHandler}>
                <img src="./images/logo.png" alt="logo" />
                <h2>Register</h2>
                <div class="on-dark">
                    <label for="email">Email:</label>
                    <input id="email" name="email" type="text" placeholder="steven@abv.bg" value="">
                </div>

                <div class="on-dark">
                    <label for="password">Password:</label>
                    <input id="password" name="password" type="password" placeholder="********" value="">
                </div>

                <div class="on-dark">
                    <label for="repeatPassword">Repeat Password:</label>
                    <input id="repeatPassword" name="repeatPassword" type="password" placeholder="********" value="">
                </div>

                <button class="btn" type="submit">Register</button>

                <p class="field">
                    <span>If you have profile click <a href="#">here</a></span>
                </p>
            </form>
        </section>
`

export const registerView = (ctx) => {
    ctx.render(registerTemplate());
}