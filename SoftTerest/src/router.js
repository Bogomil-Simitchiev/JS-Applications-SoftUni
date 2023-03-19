export function initialize(links) {
    const main = document.querySelector('main');
    const navElement = document.querySelector('nav');
    navElement.addEventListener('click', onNavigate);


    const context = {
        showSection,
        goTo,
        updateNav
    };
    return context;
    function showSection(section) {
        main.replaceChildren(section);
    }
    function onNavigate(event) {
        let target = event.target;
        if (target.tagName == 'IMG') {
            target = target.parentElement;
        }
        if (target.tagName == 'A') {
            event.preventDefault();
            const url = new URL(target.href);
            goTo(url.pathname);
        }
    }
    function goTo(name, ...params) {
        const handler = links[name];
        if (typeof handler == 'function') {
            handler(context, ...params);
        }
    }
    function updateNav() {
        const user = localStorage.getItem('user');
        if (user) {
            navElement.querySelectorAll('.user').forEach(e => e.style.display = 'block');
            navElement.querySelectorAll('.guest').forEach(e => e.style.display = 'none');

        } else {
            navElement.querySelectorAll('.user').forEach(e => e.style.display = 'none');
            navElement.querySelectorAll('.guest').forEach(e => e.style.display = 'block');

        }
    }
}



