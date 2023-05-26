import page from './lib/page.js'

import { renderMiddleware } from './middleware/renderMiddleware.js';
import { catalogView } from './views/catalogView.js'
import { aboutView } from './views/aboutView.js';
import { contactView } from './views/contactView.js';
import { registerView } from './views/registerView.js';
import { welcomeView } from './views/welcomeView.js';
import { createView } from './views/createView.js';
import { carView } from './views/detailsView.js';
import { navigate } from './utils/utils.js';
import { loginView } from './views/loginView.js';
import { logout } from './views/logoutView.js';
import { editView } from './views/editView.js';

navigate();

page(renderMiddleware);
page('/', welcomeView);
page('/about', aboutView);
page('/contact', contactView);
page('/register', registerView);
page('/login', loginView);
page('/create', createView);
page('/edit/:id', editView);
page('/cars/:id', carView);
page('/catalog', catalogView);
page('/logout', logout);

page.start();