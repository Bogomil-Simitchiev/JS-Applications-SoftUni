export const getToken = () => {
    return JSON.parse(localStorage.getItem('user')).accessToken;
}

export const getUser = () => {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
        let user = JSON.parse(currentUser);
        return user;
    }
}