import page from '../node_modules/page/page.mjs';

import { renderMiddleware } from './middlewares/renderMiddleware.js';
import { navigateNavbar } from './utils.js';
import { aboutView } from './views/aboutView.js';
import { contactView } from './views/contactView.js';
import { createView } from './views/createView.js';
import { homeView } from './views/homeView.js';
import { loginView } from './views/loginView.js';
import { recipesView } from './views/recipesView.js';
import { registerView } from './views/registerView.js';
import { detailsView } from './views/details.js';

page(renderMiddleware);

page('/', homeView);
page('/recipes', recipesView);
page('/about', aboutView);
page('/login', loginView);
page('/register', registerView);
page('/details/:id', detailsView)
page('/create', createView);
page('/contact', contactView);
page('/logout', () => {
    localStorage.clear();
    navigateNavbar();
    alert('Successfully logged out!');
    page.redirect('/');
});

navigateNavbar();

page.start();