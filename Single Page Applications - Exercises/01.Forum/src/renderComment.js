export function renderComment(username,comment) {
    let divElement = document.createElement('div');
    divElement.innerHTML = `<div id="user-comment">
    <div class="topic-name-wrapper">
        <div class="topic-name">
            <p><strong>${username}</strong> commented on <time>${new Date()}</time></p>
            <div class="post-content">
                <p>${comment}</p>
            </div>
        </div>
    </div>
</div>`;
    document.querySelector('.comment').appendChild(divElement);
}