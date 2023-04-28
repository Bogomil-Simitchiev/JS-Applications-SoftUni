import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import { searchAlbums } from '../services/requests.js';
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
                    ${getUser() ? html`<div class="btn-group"><a href="/details/${album._id}" id="details">Details</a></div>` : nothing}
                </div>
            </div>

`

const searchTemplate = (searchHandler, albums) =>
html`
 <section id="searchPage">
            <h1>Search by Name</h1>

            <div class="search">
                <input id="search-input" type="text" name="search" placeholder="Enter desired albums's name">
                <button class="button-list" @click=${searchHandler}>Search</button>
            </div>

            <h2>Results:</h2>

            <!--Show after click Search button-->
            <div class="search-result">
            ${albums.length > 0 ? albums.map(album => albumTemplate(album)) : html`<p class="no-result">No result.</p>`}   
            </div>
</section>
`
export const searchView = (ctx) => {
    const searchHandler = (e) => {
        e.preventDefault();
        const searchInputFieldElement = document.getElementById('search-input');
        if (searchInputFieldElement.value !== '') {
            searchAlbums(searchInputFieldElement.value)
                .then(res => res.json())
                .then(albums => {
                    ctx.render(searchTemplate(searchHandler, albums));
                })
                .catch(err => alert(err))
        } else {
            alert('Please fill the input field');
        }
    }
    ctx.render(searchTemplate(searchHandler, []));

} 