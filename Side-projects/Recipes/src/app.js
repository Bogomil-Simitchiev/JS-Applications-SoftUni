import page from '../node_modules/page/page.mjs';

const root = document.getElementById('root');
import { renderMiddleware } from './middlewares/renderMiddleware.js';
import { activeAtags, navigateNavbar } from './utils.js';
import { aboutView } from './views/aboutView.js';
import { contactView } from './views/contactView.js';
import { createView } from './views/createView.js';
import { homeView } from './views/homeView.js';
import { loginView } from './views/loginView.js';
import { recipesTemplate, recipesView } from './views/recipesView.js';
import { registerView } from './views/registerView.js';
import { detailsView } from './views/details.js';
import { getAllRecipes } from './requests/requests.js';
import { render } from '../node_modules/lit-html/lit-html.js';

const home = document.getElementById('home');
const about = document.getElementById('about');
const recipesTag = document.getElementById('recipes');
const login = document.getElementById('login');
const register = document.getElementById('register');
const create = document.getElementById('create');
const contact = document.getElementById('contact');

page(renderMiddleware);

page('/', homeView);
page('/recipes', recipesView);
page('/about', aboutView);
page('/login', loginView);
page('/register', registerView);
page('/details/:id', detailsView)
page('/create', createView);
page('/contact', contactView);
page('/logout', () => {
    localStorage.clear();
    navigateNavbar();
    alert('Successfully logged out!');
    page.redirect('/');
});

navigateNavbar();

page.start();

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget.parentNode);
    const inputField = form.get('recipe');

    if (inputField != '') {
        let arrayOfMatches = {};
        getAllRecipes()
            .then(recipes => {
                Object.values(recipes).forEach(recipe => {
                    if (recipe.name.toLocaleLowerCase().includes(inputField.toLocaleLowerCase())) {
                        arrayOfMatches[recipe._id] = recipe;
                    }
                })
                const size = Object.keys(arrayOfMatches).length;
                if (size > 0) {
                    activeAtags(recipesTag,[home,about,contact,login,register,create]);
                    render(recipesTemplate(arrayOfMatches), root);
                    document.getElementById('searchField').value = '';
                } else {
                    page.redirect('/recipes');
                    document.getElementById('searchField').value = '';
                }

            })
    }
})