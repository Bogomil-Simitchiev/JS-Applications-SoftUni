import { logoutUser } from '../services/requests.js';
import page from '../../node_modules/page/page.mjs';

export const logoutView = (ctx) => {
    logoutUser()
        .then(() => {
            page.redirect('/');
        })
}