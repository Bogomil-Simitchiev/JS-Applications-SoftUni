import page from './node_modules/page/page.mjs'

import { catalogView } from './views/catalog.js'
import { aboutView } from './views/about.js';
import { contactView } from './views/contact.js';
import { registerView } from './views/register.js';
import { welcomeView } from './views/welcome.js';
import { createView } from './views/create.js';
import { carView } from './views/carDetails.js';
import { navigate } from './views/utils.js';
import { loginView } from './views/login.js';
import { logout } from './views/logout.js';

page('/', welcomeView);
page('/catalog', catalogView);
page('/about', aboutView);
page('/contact', contactView);
page('/register', registerView);
page('/login', loginView);
page('/create', createView);
page('/cars/:id', carView);
page('/logout', logout);

page.start();

navigate();