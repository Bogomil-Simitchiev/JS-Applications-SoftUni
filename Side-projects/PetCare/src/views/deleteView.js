import { deletePet } from '../service/requests.js'

export const deleteView = (ctx) => {
    if (confirm("Do you want to delete this pet?") == true) {
        deletePet(ctx.params.id);
    }
}