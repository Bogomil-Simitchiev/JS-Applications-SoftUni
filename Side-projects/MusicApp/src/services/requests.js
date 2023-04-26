import page from '../../node_modules/page/page.mjs';

const loginURL = `http://localhost:3030/users/login/`;
const registerURL = `http://localhost:3030/users/register/`;
const logoutURL = `http://localhost:3030/users/logout/`;

//login request
export function loginUser(user) {
    fetch(loginURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(user => {
            if (user.code == 403) {
                alert('Cannot log in this user!');
                document.getElementById('email').value='';
                document.getElementById('password').value='';

            } else {
                localStorage.setItem('user', JSON.stringify(user));
                page.redirect('/');
            }

        })
        .catch(err => {
            alert('Cannot logged in this user!');
        })

}

//logout request
const getToken = () => {
    return JSON.parse(localStorage.getItem('user')).accessToken;
}
export const logoutUser = () => fetch(logoutURL, { headers: { 'X-Authorization': getToken() } }).then(() => {
    localStorage.removeItem('user');
});

//register request
export function registerUser(user) {
    fetch(registerURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            page.redirect('/');
        })
        .catch(err => {
            alert(err);
        })

}