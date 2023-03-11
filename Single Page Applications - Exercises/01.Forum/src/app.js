import { renderTopic } from "./renderTopic.js";

let titleElement = document.querySelector('#topicName');
let usernameElement = document.querySelector('#username');
let postElement = document.querySelector('#postText');

let cancelBtn = document.querySelector('.cancel');
let postBtn = document.querySelector('.public');
const baseURL = `http://localhost:3030/jsonstore/collections/myboard/posts`;
const uniqueId = (length = 16) => {
    return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
}

cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    titleElement.value = '';
    usernameElement.value = '';
    postElement.value = '';
})

postBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (titleElement.value != '' && usernameElement.value != '' && postElement.value != '') {
        let data = {
            title: titleElement.value,
            username: usernameElement.value,
            post: postElement.value,
            id:uniqueId()
        }
        fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(() => {
                titleElement.value = '';
                usernameElement.value = '';
                postElement.value = '';
               
                renderTopic(data);

            })
            .catch(err => console.log(err))

    }
})