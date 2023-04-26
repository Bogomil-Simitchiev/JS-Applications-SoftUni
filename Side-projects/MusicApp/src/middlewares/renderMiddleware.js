import { render } from '../../node_modules/lit-html/lit-html.js';

const mainContent = document.getElementById('main-content');

const ctxRender = (template) => render(template, mainContent);

export function renderMiddleware(ctx, next) {
    ctx.render = ctxRender;
    next();
}