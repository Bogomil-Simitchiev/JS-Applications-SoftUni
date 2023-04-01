import { html, render } from '../node_modules/lit-html/lit-html.js'
import page from '../node_modules/page/page.mjs';

function handlerSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let brand = formData.get('brand');
    let year = formData.get('year');
    let info = formData.get('info');
    let img = formData.get('img');

    if (brand != '' && year != '' && info != '' && img != '') {
        let obj = {
            brand,
            year,
            info,
            img
        }
        fetch('http://localhost:3030/jsonstore/cars/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(result => {
                alert('Successfully created!')
                document.querySelector('#brand').value = '';
                document.querySelector('#year').value = '';
                document.querySelector('#info').value = '';
                document.querySelector('#img').value = '';
                page.redirect(`/cars/${result._id}`);

            }).catch(err => console.log(err))
    }


}
const createTemplate = () => html`
<form @submit=${handlerSubmit}>
  <label for="brand">Brand:</label><br>
  <input type="text" id="brand" name="brand"><br>

  <label for="year">Year:</label><br>
  <input type="text" id="year" name="year"><br>

  <label for="info">Information:</label><br>
  <textarea id="info" name="info" rows="4" cols="50"></textarea><br><br>

  <label for="img">URL image:</label><br>
  <input type="text" id="img" name="img"><br>

  <input type="submit" value="Submit">
</form> 
`
const root = document.getElementById('root');

export function createView() {
    render(createTemplate(), root);
}
