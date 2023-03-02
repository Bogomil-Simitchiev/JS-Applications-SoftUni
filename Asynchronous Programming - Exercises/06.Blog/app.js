function attachEvents() {
    const urlPosts = `http://localhost:3030/jsonstore/blog/posts`;
    const urlComments = `http://localhost:3030/jsonstore/blog/comments`;

    document.getElementById('btnLoadPosts').addEventListener('click', () => {
        document.getElementById('posts').innerHTML = '';

        fetch(urlPosts)
            .then(response => response.json())
            .then(result => {
                for (const key in result) {
                    let optionElement = document.createElement('option');
                    optionElement.value = result[key].id;
                    optionElement.textContent = result[key].title;
                    document.getElementById('posts').appendChild(optionElement);
                }

            })
            .catch(err => console.log(err))
    })

    document.getElementById('btnViewPost').addEventListener('click', () => {
        document.getElementById('post-comments').innerHTML = '';
        document.getElementById('post-body').textContent = '';
        fetch(urlPosts)
            .then(response => response.json())
            .then(result => {

                let optionElements = document.getElementById('posts').children;
                selectedOptionElement = Array.from(optionElements).find(element => element.selected);
                for (const key in result) {
                    if (key == selectedOptionElement.value) {

                        document.getElementById('post-body').textContent = result[key].body;
                    }
                }

            })
            .catch(err => console.log(err))
        fetch(urlComments)
            .then(response => response.json())
            .then(result => {
                let optionElements = document.getElementById('posts').children;
                selectedOptionElement = Array.from(optionElements).find(element => element.selected);
                for (const key in result) {
                    if (result[key].postId == selectedOptionElement.value) {

                        let liElement = document.createElement('li');
                        liElement.id = result[key].id;
                        liElement.textContent = result[key].text;
                        document.getElementById('post-comments').appendChild(liElement);
                        document.getElementById('post-title').textContent = selectedOptionElement.textContent;
                    }
                }
            })
            .catch(err => console.log(err))

    })

}

attachEvents();