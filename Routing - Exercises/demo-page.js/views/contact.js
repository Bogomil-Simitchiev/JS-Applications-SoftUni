const root = document.getElementById('root');

const contactTemplate = () => `
<h1>ContactView</h1>
<p>hello from contactView</p>

`
export const contactView = () => {
    root.innerHTML = contactTemplate();
}