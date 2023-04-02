import { navigate } from "./utils.js";
import page from '../node_modules/page/page.mjs';

export function logout() {
    alert('Successfully logout!');
    localStorage.removeItem('user');
    navigate();
    page.redirect('/');
}