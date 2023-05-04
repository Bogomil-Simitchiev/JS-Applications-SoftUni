export const getToken = () => JSON.parse(localStorage.getItem('user')).accessToken;

export const getUser = () => {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        return user;
    }
}

export const clearUser = () => localStorage.clear();

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));