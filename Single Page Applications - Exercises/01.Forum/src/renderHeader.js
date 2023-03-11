export function renderHeader() {
    let divElement = document.createElement('div');
    divElement.innerHTML = ` <div class="header">
    <img src="./static/profile.png" alt="avatar">
    <p><span>David</span> posted on <time>${new Date()}</time></p>

    <p class="post-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure facere sint
        dolorem quam,
        accusantium ipsa veniam laudantium inventore aut, tenetur quibusdam doloribus. Incidunt odio
        nostrum facilis ipsum dolorem deserunt illum?</p>
</div>
`;
    document.querySelector('.comment').appendChild(divElement);
}