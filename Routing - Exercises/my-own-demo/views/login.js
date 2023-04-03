import { html, render } from '../node_modules/lit-html/lit-html.js'
import { postLogIn } from '../requests/requests.js';

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
        postLogIn(user);
    }
}

const loginTemplate = () => html`
<h1>Log in</h1>
<form @submit=${loginHandler}>
  <label for="email">Email:</label><br>
  <input type="text" id="email" name="email"><br>

  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>

  <input type="submit" value="Submit">
</form>
`
const root = document.getElementById('root');

export function loginView() {
    render(loginTemplate(), root);
}