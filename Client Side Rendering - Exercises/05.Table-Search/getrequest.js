import { render } from "../node_modules/lit-html/lit-html.js";
import { template } from "./template.js";

export function loadAll(root) {
    fetch('http://localhost:3030/jsonstore/advanced/table')
        .then(res => res.json())
        .then(data => {
            let arrOfTemplates = [];
            for (const key in data) {
                arrOfTemplates.push(template(data[key]));
            }
            render(arrOfTemplates, root)
        })
        .catch(err => console.log(err))
}