const url = `http://localhost:3030/jsonstore/collections/books/`;

export async function getAllBooks() {
    let result = await fetch(url);
    let response = await result.json();
    return response;
}
export function postBook(author, title) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, title })
    })
        .then(response => response.json())
        .then(() => { })
        .catch(err => console.log(err))
}
export function deleteBook(id) {
    fetch(url + id, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }
    });
}
export function updateBook(id, author, title) {
    fetch(url + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, title })
    })
}