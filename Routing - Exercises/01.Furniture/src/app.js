import page from '../node_modules/page/page.mjs';

import { navigate } from './utils.js';
import { createView } from './views/createView.js';
import { detailsView } from './views/details.js';
import { editView } from './views/edit.js';
import { homeView } from './views/homeView.js';
import { loginView } from './views/login.js';
import { myFurnitureView } from './views/myFurniture.js';
import { registerView } from './views/register.js';

page('/', homeView);
page('/create', createView);
page('/my-furniture', myFurnitureView);
page('/details', detailsView);
page('/edit', editView);
page('/login', loginView);
page('/register', registerView);
page('/logout', () => console.log('logout'));

navigate();

page.start();