import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import { getAllAlbums } from '../services/requests.js';
import { getUser } from '../utils/utils.js';

const albumTemplate = (album) =>
html`
 <div class="card-box">
                <img src="${album.imgUrl}">
                <div>
                    <div class="text-center">
                        <p class="name">Name: ${album.name}</p>
                        <p class="artist">Artist: ${album.artist}</p>
                        <p class="genre">Genre: ${album.genre}</p>
                        <p class="price">Price: $${album.price}</p>
                        <p class="date">Release Date: ${album.releaseDate}</p>
                    </div>
                    ${getUser() ? html `<div class="btn-group"><a href="/details/${album._id}" id="details">Details</a></div>` : nothing }
                </div>
            </div>

`
const catalogTemplate = (albums) =>
html`
<section id="catalogPage">
            <h1>All Albums</h1>

            ${albums.length > 0 ?
            albums.map(album => albumTemplate(album)) : html`<p>No Albums in Catalog!</p>`}
    
        </section>
`
export const catalogView = (ctx) => {
    getAllAlbums().then(albums => {
        ctx.render(catalogTemplate(albums));
    })
} 