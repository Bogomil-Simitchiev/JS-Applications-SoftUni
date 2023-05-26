import { html } from '../lib/lit-html.js'
import { registerUser } from '../service/requests.js';

function registerHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  let email = formData.get('email');
  let password = formData.get('password');
  let confirmPassword = formData.get('confirmPassword');
  
  if (email !== '' && password !== '' && confirmPassword !== '') {
    if (password == confirmPassword) {
      let user = {
        email,
        password
      }
      registerUser(user);
    } else {
      alert('Passwords are not matching');
      document.getElementById('confirmPassword').value = '';
    }
  }
}

const registerTemplate = () => 
html`
<h1>Registration</h1>
<form @submit=${registerHandler}>
  <label for="email">Email:</label><br>
  <input type="text" id="email" name="email"><br>

  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br>
  <label for="confirmPassword">Confirm password:</label><br>
  <input type="password" id="confirmPassword" name="confirmPassword"><br>

  <input type="submit" value="Register">
</form>
`

export function registerView(ctx) {
  ctx.render(registerTemplate());
}