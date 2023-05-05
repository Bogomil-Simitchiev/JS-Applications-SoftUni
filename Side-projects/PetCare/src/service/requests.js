import page from '../../node_modules/page/page.mjs';
import { clearUser, getToken } from '../util.js';

const baseURL = `http://localhost:3030/data/pets`;
const loginURL = `http://localhost:3030/users/login/`;
const registerURL = `http://localhost:3030/users/register/`;
const logoutURL = `http://localhost:3030/users/logout/`;


//login request
export async function login(user){
    const res = await fetch(loginURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    }).catch(err=>alert(err));
    if (res.status==403) {
        alert('Invalid email or password');
        document.getElementById('email').value='';
        document.getElementById('password').value='';

        return;
    }
    const data = await res.json();
    page.redirect('/');
    return data;
}

//logout request
export async function logout(){
    await fetch(logoutURL, {
        headers: {
            'X-Authorization': getToken()
        },
    }).catch(err=>alert(err));
    clearUser();
    page.redirect('/');
}

//register request
export async function register(user){
    const res = await fetch(registerURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    }).catch(err=>alert(err));
    
    const data = await res.json();
    page.redirect('/');
    return data;
}

//get pets sorted request
export const getAllPets = async () => {
    const res = await fetch(baseURL+ '?sortBy=_createdOn%20desc&distinct=name').catch(err=>alert(err));
    const data = res.json();
    return data;
}

//create request
export function createPet(newPet) {
    fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': getToken()
        },
        body: JSON.stringify(newPet)

    })
        .then(() => {
            page.redirect('/');
        })
        .catch(err => alert(err));
}

//get pet by id
export const getPet = async (id) =>  {
    const res = await fetch(baseURL + `/${id}`);
    const currentPet = res.json();
    return currentPet;
}

//edit request
export async function editPet(id, updatedPet){
    const res = await fetch(baseURL + `/${id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': getToken()
        },
        body: JSON.stringify(updatedPet)
    }).catch(err=>alert(err));
    
    const data = await res.json();
    page.redirect(`/details/${data._id}`);
    return data;
}
