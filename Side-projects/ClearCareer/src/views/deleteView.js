import { deleteOffer } from '../services/requests.js';

export const deleteView = (ctx) => {
    if (confirm("Do you want to delete this offer?") == true) {
        deleteOffer(ctx.params.id);
    }
}