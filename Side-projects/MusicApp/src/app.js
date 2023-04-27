import page from '../node_modules/page/page.mjs';
import { navigationMiddleware } from './middlewares/navigationMiddleware.js';

import { renderMiddleware } from './middlewares/renderMiddleware.js';
import { catalogView } from './views/catalogView.js';
import { homeView } from './views/homeView.js';
import { loginView } from './views/loginView.js';
import { logoutView } from './views/logoutView.js';
import { registerView } from './views/registerView.js';

page(navigationMiddleware);
page(renderMiddleware);

page('/', homeView);
page('/login', loginView);
page('/logout', logoutView);
page('/register', registerView);
page('/catalog', catalogView);



page.start();