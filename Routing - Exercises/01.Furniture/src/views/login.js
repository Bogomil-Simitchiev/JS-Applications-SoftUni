import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { postLogIn } from '../requests/requests.js';
const root = document.querySelector('.container');

const loginTemplate = () =>
html`
<div class="row space-top">
            <div class="col-md-12">
                <h1>Login User</h1>
                <p>Please fill all fields.</p>
            </div>
        </div>
        <form @submit=${loginUser}>
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
                    <input type="submit" class="btn btn-primary" value="Login" />
                </div>
            </div>
        </form>
`
function loginUser(e){
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
export function loginView() {
    render(loginTemplate(), root);
}