export function activeAtags(aTag, arraOfOthertags) {
    aTag.classList.add('active');
    arraOfOthertags.forEach(tag => tag.classList.remove('active'));
}

export const navigateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('usernameShow').textContent = `Welcome, ${user.username}!`;
        document.querySelectorAll('.user').forEach(e => e.style.display = 'inline-block');
        document.querySelectorAll('.guest').forEach(e => e.style.display = 'none');

    } else {
        document.getElementById('usernameShow').textContent = ``;
        document.querySelectorAll('.user').forEach(e => e.style.display = 'none');
        document.querySelectorAll('.guest').forEach(e => e.style.display = 'inline-block');
    }
}