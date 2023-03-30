const root = document.getElementById('root');

const homeTemplate = () => `
<h1>HomeView</h1>
<p>hello from homeView</p>

`
export const homeView = () => {
    root.innerHTML = homeTemplate();
}