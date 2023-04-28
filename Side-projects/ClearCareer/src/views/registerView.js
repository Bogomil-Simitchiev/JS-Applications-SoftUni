import { html } from '../../node_modules/lit-html/lit-html.js';
import { registerUser } from '../services/requests.js';

function registerHandler(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const confPass = formData.get('re-password');

    if (email !== '' && password !== '' && confPass !== '') {
        if (password == confPass) {
            const user = {
                email,
                password
            }
            registerUser(user);
        } else {
            alert(`Repeat password doesn't match`);
            document.getElementById('repeat-password').value = '';
        }
    } else {
        alert('You must fill all fields!');
    }
}

const registerTemplate = () =>
    html`
<!-- Register Page (Only for Guest users) -->
<section id="register">
          <div class="form">
            <h2>Register</h2>
            <form class="login-form" @submit=${registerHandler}>
              <input
                type="text"
                name="email"
                id="register-email"
                placeholder="email"
              />
              <input
                type="password"
                name="password"
                id="register-password"
                placeholder="password"
              />
              <input
                type="password"
                name="re-password"
                id="repeat-password"
                placeholder="repeat password"
              />
              <button type="submit">register</button>
              <p class="message">Already registered? <a href="/login">Login</a></p>
            </form>
          </div>
        </section>
`

export const registerView = (ctx) => {
    ctx.render(registerTemplate());
}