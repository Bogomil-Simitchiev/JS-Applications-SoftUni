import { html } from '../lib/lit-html.js'
import { loginUser } from '../service/requests.js';

function loginHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let email = formData.get('email');
    let password = formData.get('password');

    if (email != '' && password != '') {
        let user = {
            email,
            password
        }
        loginUser(user);
    }
}

const loginTemplate = () => 
html`
<h1>Log in</h1>
<form @submit=${loginHandler}>
  <label for="email">Email:</label><br>
  <input type="text" id="email" name="email"><br>

  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>

  <input type="submit" value="Login">
</form>
`

export function loginView(ctx) {
    ctx.render(loginTemplate());
}