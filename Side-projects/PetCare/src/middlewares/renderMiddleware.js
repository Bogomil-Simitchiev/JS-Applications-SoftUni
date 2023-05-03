import { render } from '../../node_modules/lit-html/lit-html.js';

const root = document.getElementById('content');

const ctxRender = (content) => render(content, root);

export function renderMiddleware(ctx, next){
    ctx.render = ctxRender;
    next();
}