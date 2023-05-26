import page from '../lib/page.js';
import { navigate } from '../utils/utils.js';
import { logoutUser } from '../service/requests.js';

export function logout() {
    logoutUser();
    alert('Successfully logout!');
    localStorage.clear();
    navigate();
    page.redirect('/');   
}