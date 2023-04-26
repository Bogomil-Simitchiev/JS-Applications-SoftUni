import { render } from '../../node_modules/lit-html/lit-html.js';
import { navigationView } from '../views/navigationView.js';

const headerElement = document.getElementById('header-content');

export function navigationMiddleware(ctx, next) {
    render(navigationView(ctx), headerElement);
    next();
}