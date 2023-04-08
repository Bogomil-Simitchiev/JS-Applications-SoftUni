export function navigate() {
    const user = localStorage.getItem('user');
    if (user) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';

    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}
export function activeAtags(aTag, arraOfOthertags) {
    aTag.classList.add('active');
    arraOfOthertags.forEach(tag => tag.classList.remove('active'));
}