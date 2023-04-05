import page from '../node_modules/page/page.mjs';

import { navigate } from './utils.js';
import { createView } from './views/createView.js';
import { detailsView } from './views/details.js';
import { editView } from './views/edit.js';
import { homeView } from './views/homeView.js';
import { loginView } from './views/login.js';
import { myFurnitureView } from './views/myFurniture.js';
import { registerView } from './views/register.js';
import { delFurniture } from './requests/requests.js';

page('/', homeView);
page('/create', createView);
page('/my-furniture', myFurnitureView);
page('/details/:id', detailsView);
page('/edit/:id', editView);
page('/login', loginView);
page('/register', registerView);
page('/logout', logout);
page('/delete/:id', deleteFurniture);

function deleteFurniture(ctx) {
    if (confirm('Are you sure you want to delete this furniture?') == true) {
        const user = JSON.parse(localStorage.getItem('user'));
        delFurniture(ctx.params.id, user);   
    }
    page.redirect('/');
}

function logout() {
    alert('Successfully logout!');
    localStorage.removeItem('user');
    navigate();
    page.redirect('/');
}

navigate();

page.start();