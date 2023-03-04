const url = `http://localhost:3030/jsonstore/collections/books`;
let id = '';
let arrOfTrElements = [];
let loadBtnElement = document.getElementById('loadBooks');
let submitAndSaveBtnELement = document.querySelector('form > button');

fetch(url)
    .then(res => res.json())
    .then(data => {
        document.querySelector('tbody').innerHTML = '';
        for (const key in data) {
            let trElement = document.createElement('tr');
            trElement.id = key;

            let tdElement = document.createElement('td');
            tdElement.textContent = `${data[key].title}`;

            let secondtdElement = document.createElement('td');
            secondtdElement.textContent = `${data[key].author}`;

            let thirdtdElement = document.createElement('td');

            let editBtnElement = document.createElement('button');
            editBtnElement.textContent = 'Edit';
            editBtnElement.addEventListener('click', (e) => {
                document.querySelector('form > button').textContent = 'Save';
                document.querySelector('form > h3').textContent = 'Edit FORM';
                let inputFieldsElements = document.querySelectorAll('form > input');
                let titleInputElement = inputFieldsElements[0];
                titleInputElement.value = data[key].title;
                let authorInputElement = inputFieldsElements[1];
                authorInputElement.value = data[key].author;
                id = e.currentTarget.parentNode.parentNode.id;
            })

            let deleteBtnElement = document.createElement('button');
            deleteBtnElement.textContent = 'Delete';
            deleteBtnElement.addEventListener('click', (e) => {
                fetch(`http://localhost:3030/jsonstore/collections/books/${key}`, {
                    method: "DELETE"
                })
                    .then(() => {
                        console.log('Deleted')
                    })

                e.currentTarget.parentNode.parentNode.remove();
            })

            thirdtdElement.appendChild(editBtnElement);
            thirdtdElement.appendChild(deleteBtnElement);
            trElement.appendChild(tdElement);
            trElement.appendChild(secondtdElement);
            trElement.appendChild(thirdtdElement);
            document.querySelector('tbody').appendChild(trElement);
            arrOfTrElements.push(trElement);
        }

    })
    .catch(err => console.log(err))

document.querySelector('tbody').replaceChildren(...arrOfTrElements);

submitAndSaveBtnELement.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.currentTarget.textContent == 'Save') {
        let inputFieldsElements = document.querySelectorAll('form > input');
        let titleInputElement = inputFieldsElements[0];
        let authorInputElement = inputFieldsElements[1];

        if (titleInputElement.value !== '' && authorInputElement.value !== '') {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: titleInputElement.value, author: authorInputElement.value })
            };
            fetch(`http://localhost:3030/jsonstore/collections/books/${id}`, requestOptions)
                .then(response => response.json())
                .then(() => 'Succes change');

            titleInputElement.value = '';
            authorInputElement.value = '';
            document.querySelector('form > button').textContent = 'Submit';
            document.querySelector('form > h3').textContent = 'FORM';
        }


    } else {
        let inputFieldsElements = document.querySelectorAll('form > input');
        let titleInputElement = inputFieldsElements[0];
        let authorInputElement = inputFieldsElements[1];

        if (titleInputElement.value !== '' && authorInputElement.value !== '') {
            let infoObject = {
                author: authorInputElement.value,
                title: titleInputElement.value
            }
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(infoObject),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success: ' + data);
                    authorInputElement.value = '';
                    titleInputElement.value = '';

                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            titleInputElement.value = '';
            authorInputElement.value = '';
        }

    }
})

loadBtnElement.addEventListener('click', () => {

    fetch(url)
        .then(res => res.json())
        .then(data => {
            document.querySelector('tbody').innerHTML = '';
            for (const key in data) {
                let trElement = document.createElement('tr');
                trElement.id = key;

                let tdElement = document.createElement('td');
                tdElement.textContent = `${data[key].title}`;

                let secondtdElement = document.createElement('td');
                secondtdElement.textContent = `${data[key].author}`;

                let thirdtdElement = document.createElement('td');

                let editBtnElement = document.createElement('button');
                editBtnElement.textContent = 'Edit';
                editBtnElement.addEventListener('click', (e) => {
                    document.querySelector('form > button').textContent = 'Save';
                    document.querySelector('form > h3').textContent = 'Edit FORM';
                    let inputFieldsElements = document.querySelectorAll('form > input');
                    let titleInputElement = inputFieldsElements[0];
                    titleInputElement.value = data[key].title;
                    let authorInputElement = inputFieldsElements[1];
                    authorInputElement.value = data[key].author;
                    id = e.currentTarget.parentNode.parentNode.id;
                })

                let deleteBtnElement = document.createElement('button');
                deleteBtnElement.textContent = 'Delete';
                deleteBtnElement.addEventListener('click', (e) => {
                    fetch(`http://localhost:3030/jsonstore/collections/books/${key}`, {
                        method: "DELETE"
                    })
                        .then(() => {
                            console.log('Deleted')
                        })

                    e.currentTarget.parentNode.parentNode.remove();
                })

                thirdtdElement.appendChild(editBtnElement);
                thirdtdElement.appendChild(deleteBtnElement);
                trElement.appendChild(tdElement);
                trElement.appendChild(secondtdElement);
                trElement.appendChild(thirdtdElement);
                document.querySelector('tbody').appendChild(trElement);
                arrOfTrElements.push(trElement);
            }

        })
        .catch(err => console.log(err))
})