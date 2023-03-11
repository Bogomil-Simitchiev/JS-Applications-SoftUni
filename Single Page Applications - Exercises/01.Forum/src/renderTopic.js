function renderTopic(object) {
    let divElement = document.createElement('div');
    divElement.innerHTML = `<div class="topic-name-wrapper" id=${object.id}>
    <div class="topic-name">
        <a href="#" class="normal">
            <h2>${object.title}</h2>
        </a>
        <div class="columns">
            <div>
                <p>Date: <time>${new Date()}</time></p>
                <div class="nick-name">
                    <p>Username: <span>${object.username}</span></p>
                </div>
            </div>


        </div>
    </div>
</div>`
    divElement.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = 'http://127.0.0.1:5500/01.Forum/theme-content.html';
    })
    document.querySelector('.topic-container').appendChild(divElement);
}

export { renderTopic }