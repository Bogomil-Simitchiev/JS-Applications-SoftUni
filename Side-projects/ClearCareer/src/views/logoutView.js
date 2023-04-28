import { logoutUser } from '../services/requests.js';

export const logoutView = (ctx) => {
    logoutUser()
        .then(() => { })
}