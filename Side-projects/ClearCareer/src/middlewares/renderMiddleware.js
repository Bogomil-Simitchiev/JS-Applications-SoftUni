import { render } from '../../node_modules/lit-html/lit-html.js';

const mainContent = document.querySelector('#wrapper > main');

const ctxRender = (template) => render(template, mainContent);

export function renderMiddleware(ctx, next) {
    ctx.render = ctxRender;
    next();
}