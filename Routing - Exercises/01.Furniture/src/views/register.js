import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { postRegister } from '../requests/requests.js';
import { activeAtags } from '../utils.js';
const root = document.querySelector('.container');

const catalogLink = document.getElementById('catalogLink');
const createLink = document.getElementById('createLink');
const profileLink = document.getElementById('profileLink');
const logoutBtn = document.getElementById('logoutBtn');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');

const registerTemplate = () =>
html`
<div class="row space-top">
            <div class="col-md-12">
                <h1>Register New User</h1>
                <p>Please fill all fields.</p>
            </div>
        </div>
        <form @submit=${registerUser}>
            <div class="row space-top">
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="form-control-label" for="email">Email</label>
                        <input class="form-control" id="email" type="text" name="email">
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="password">Password</label>
                        <input class="form-control" id="password" type="password" name="password">
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="rePass">Repeat</label>
                        <input class="form-control" id="rePass" type="password" name="rePass">
                    </div>
                    <input type="submit" class="btn btn-primary" value="Register" />
                </div>
            </div>
        </form>
`
function registerUser(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let email = formData.get('email');
    let password = formData.get('password');
    let repPassword = formData.get('rePass');

    if (email != '' && password != '' && repPassword != '') {
        if (password == repPassword) {
            let user = {
                email,
                password
            }
            postRegister(user);
        } else {
            alert('Passwords don\'t match');
            document.getElementById('rePass').value = '';
        }

    }
}
export function registerView() {
    activeAtags(registerLink, [createLink, profileLink, logoutBtn, catalogLink, loginLink]);
    render(registerTemplate(), root);
}