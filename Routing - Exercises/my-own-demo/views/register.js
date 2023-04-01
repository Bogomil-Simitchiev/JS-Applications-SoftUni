import { html, render } from '../node_modules/lit-html/lit-html.js'

function registerHandler(e) {
    e.preventDefault();
}

const registerTemplate = () => html`
<form @submit=${registerHandler}>
  <label for="email">Email:</label><br>
  <input type="text" id="email" name="email"><br>

  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>

  <input type="submit" value="Submit">
</form>
`
const root = document.getElementById('root');

export function registerView() {
    render(registerTemplate(), root);
}
