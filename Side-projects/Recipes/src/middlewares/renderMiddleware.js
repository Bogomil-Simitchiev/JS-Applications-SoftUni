import { render } from '../../node_modules/lit-html/lit-html.js';

const root = document.querySelector('#root');

export const renderMiddleware = (ctx, next) => {
    const ctxRender = (templateResult) => render(templateResult, root);
    ctx.render = ctxRender;
    next();
}