import { html } from "../node_modules/lit-html/lit-html.js"

export const templateBook = (data,key) => html`
<tr id="${key}">
    <td>${data.title}</td>
    <td>${data.author}</td>
    <td>
        <button>Edit</button>
        <button>Delete</button>
    </td>
</tr>
`