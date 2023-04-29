import { applyForOffer } from '../services/requests.js';

export const applyView = (ctx) => {
    applyForOffer({ 'offerId': ctx.params.id });
}