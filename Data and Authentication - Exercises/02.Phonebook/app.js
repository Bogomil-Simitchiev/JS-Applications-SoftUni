function attachEvents() {
    let btnLoadElement = document.getElementById('btnLoad');
    let btnCreateElement = document.getElementById('btnCreate');
    const url = `http://localhost:3030/jsonstore/phonebook`;

    function reloadData(data, key) {
        let liElement = document.createElement('li');
        liElement.textContent = `${data[key].person}: ${data[key].phone}`;
        let btnDeleteElement = document.createElement('button');
        btnDeleteElement.textContent = 'Delete';
        btnDeleteElement.addEventListener('click', (e) => {
            const urlKey = `http://localhost:3030/jsonstore/phonebook/${key}`;
            fetch(urlKey,
                {
                    method: 'DELETE'
                })
                .then(() => console.log('Deleted'))

            e.currentTarget.parentNode.remove()
        })
        liElement.appendChild(btnDeleteElement);

        document.getElementById('phonebook').appendChild(liElement);
    }
    btnLoadElement.addEventListener('click', () => {

        fetch(url)
            .then(res => res.json())
            .then(data => {
                document.getElementById('phonebook').innerHTML = '';
                for (const key in data) {
                    reloadData(data, key)
                }
            })
            .catch(err => console.log(err))
    })

    btnCreateElement.addEventListener('click', () => {
        let personInputFieldElement = document.getElementById('person');
        let phoneInputFieldElement = document.getElementById('phone');

        if (personInputFieldElement.value !== '' && phoneInputFieldElement.value !== '') {
            let infoObject = {
                person: personInputFieldElement.value,
                phone: phoneInputFieldElement.value
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
                    console.log("Success:", data);
                    let liElement = document.createElement('li');
                    liElement.textContent = `${data.person}: ${data.phone}`;
                    let btnDeleteElement = document.createElement('button');
                    btnDeleteElement.textContent = 'Delete';
                    btnDeleteElement.addEventListener('click', (e) => {
                        const urlKey = `http://localhost:3030/jsonstore/phonebook/${data._id}`;
                        fetch(urlKey,
                            {
                                method: 'DELETE'
                            })
                            .then(() => console.log('Deleted'))

                        e.currentTarget.parentNode.remove()
                    })
                    liElement.appendChild(btnDeleteElement);

                    document.getElementById('phonebook').appendChild(liElement);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            personInputFieldElement.value = '';
            phoneInputFieldElement.value = '';
        }
    })
}

attachEvents();