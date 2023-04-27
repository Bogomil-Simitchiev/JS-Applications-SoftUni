import { deleteAlbum } from '../services/requests.js';

export const deleteView = (ctx) => {
    if (confirm("Do you want to delete this album?") == true) {
        deleteAlbum(ctx.params.id);
    }
}