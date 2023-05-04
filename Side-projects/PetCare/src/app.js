import page from '../node_modules/page/page.mjs';

import { navigationMiddleware } from './middlewares/navigationMiddleware.js';
import { renderMiddleware } from './middlewares/renderMiddleware.js';

import { logout } from './service/requests.js';
import { dashboardView } from './views/dashboardView.js';

import { homeView } from './views/homeView.js';
import { loginView } from './views/loginView.js';
import { registerView } from './views/registerView.js';

page(navigationMiddleware); 
page(renderMiddleware);

page('/', homeView);
page('/login', loginView);
page('/logout', logout);
page('/register', registerView);
page('/dashboard', dashboardView);

page.start();