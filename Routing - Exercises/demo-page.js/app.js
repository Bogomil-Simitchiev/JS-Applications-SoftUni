import page from './node_modules/page/page.mjs';

import { homeView } from './views/home.js';
import { aboutView } from './views/about.js';
import { contactView } from './views/contact.js';


page('/home', homeView);
page('/about', aboutView);
page('/contact', contactView);


page.start();