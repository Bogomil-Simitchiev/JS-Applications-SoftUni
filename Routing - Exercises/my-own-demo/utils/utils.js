export function navigate() {
    const user = localStorage.getItem('user');
    if (user) {
        const parsedUser = JSON.parse(user);
        document.querySelectorAll('.user').forEach(e => e.style.display = 'block');
        document.querySelectorAll('.guest').forEach(e => e.style.display = 'none');
        document.getElementById('helloMessage').textContent = `Welcome, ${parsedUser.email}`;

    } else {
        document.querySelectorAll('.user').forEach(e => e.style.display = 'none');
        document.querySelectorAll('.guest').forEach(e => e.style.display = 'block');
    }
}
export const token = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return user.accessToken;
    }
}