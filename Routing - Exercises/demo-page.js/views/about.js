const root = document.getElementById('root');

const aboutTemplate = (x) => `
<h1>${x.author}</h1>
<p>${x.title}</p>
`
function getBooks() {
    return fetch('http://localhost:3030/jsonstore/collections/books')
        .then(res => res.json());
}


export const aboutView = () => {
    let books = getBooks();
    books.then(result => {
        let templates = [];
        Object.values(result).forEach(x => {
            templates.push(aboutTemplate(x))
        })
        root.innerHTML = templates.join('<hr>');
    })

}