import { render } from '../../node_modules/lit-html/lit-html.js';
import { navigationView } from '../views/navigationView.js';

const root = document.getElementById('navSection');

export function navigationMiddleware(ctx, next){
    render(navigationView(ctx), root);
    next();
}