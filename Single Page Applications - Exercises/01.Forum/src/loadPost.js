import { renderHeader } from "./renderHeader.js";
import { renderComment } from "./renderComment.js";

renderHeader();
let commentElement = document.getElementById('comment');
let usernameElement = document.getElementById('username');
const baseURL = `http://localhost:3030/jsonstore/collections/myboard/comments`;

let postBtn = document.querySelector('form > button');
postBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (usernameElement.value != '' && commentElement.value != '') {
        let data = {
            username: usernameElement.value,
            comment: commentElement.value
        }
        fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(() => {
                renderComment(usernameElement.value, commentElement.value);
                usernameElement.value = '';
                commentElement.value = '';
            })
            .catch(err => console.log(err))

    }

})