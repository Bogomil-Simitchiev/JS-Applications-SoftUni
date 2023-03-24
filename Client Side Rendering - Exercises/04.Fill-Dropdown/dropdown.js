import { renderOptions } from "./template.js";

async function loadOptions() {
    let data = await fetch('http://localhost:3030/jsonstore/advanced/dropdown');
    let res = await data.json();
    renderOptions(res, document.getElementById('menu'));
}
loadOptions();

document.querySelector('input[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();
    let inputElement = document.getElementById('itemText');
    if (inputElement.value != '') {
        let info = {
            text: inputElement.value
        }
        fetch('http://localhost:3030/jsonstore/advanced/dropdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        })
            .then(response => response.json())
            .then(() => {
                inputElement.value = '';
                loadOptions();
            })
            .catch(err => console.log(err))
    }
})