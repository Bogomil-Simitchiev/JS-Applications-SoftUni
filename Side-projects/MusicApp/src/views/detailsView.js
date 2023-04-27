import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import { getAlbum } from '../services/requests.js';
import { getUser } from '../utils/utils.js';

const detailsTemplate = (album) =>
html`
<section id="detailsPage">
            <div class="wrapper">
                <div class="albumCover">
                    <img src="${album.imgUrl}">
                </div>
                <div class="albumInfo">
                    <div class="albumText">

                        <h1>Name: ${album.name}</h1>
                        <h3>Artist: ${album.artist}</h3>
                        <h4>Genre: ${album.genre}</h4>
                        <h4>Price: $${album.price}</h4>
                        <h4>Date: ${album.releaseDate}</h4>
                        <p>Description: ${album.description}</p>
                    </div>

                    ${getUser()._id == album._ownerId ? html`<div class="actionBtn">
                        <a href="/edit/${album._id}" class="edit">Edit</a>
                        <a href="/delete/${album._id}" class="remove">Delete</a>
                    </div>` : nothing}
                    
                </div>
            </div>
    </section>

`
export const detailsView = (ctx) => {
    getAlbum(ctx.params.id).then(album => {
        ctx.render(detailsTemplate(album));
    })
} 