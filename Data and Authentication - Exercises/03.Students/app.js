const url = `http://localhost:3030/jsonstore/collections/students`;
function createTrTag(data, key) {
    let trElement = document.createElement('tr');

    let thElement = document.createElement('th');
    thElement.textContent = `${data[key].firstName}`;

    let secondThElement = document.createElement('th');
    secondThElement.textContent = `${data[key].lastName}`;

    let thirdThElement = document.createElement('th');
    thirdThElement.textContent = `${data[key].facultyNumber}`;


    let fourthThElement = document.createElement('th');
    fourthThElement.textContent = `${Number(data[key].grade)}`;

    trElement.appendChild(thElement);
    trElement.appendChild(secondThElement);
    trElement.appendChild(thirdThElement);
    trElement.appendChild(fourthThElement);


    return trElement;
}
function createTrTagToPut(data) {
    let trElement = document.createElement('tr');

    let thElement = document.createElement('th');
    thElement.textContent = `${data.firstName}`;

    let secondThElement = document.createElement('th');
    secondThElement.textContent = `${data.lastName}`;

    let thirdThElement = document.createElement('th');
    thirdThElement.textContent = `${data.facultyNumber}`;


    let fourthThElement = document.createElement('th');
    fourthThElement.textContent = `${Number(data.grade)}`;

    trElement.appendChild(thElement);
    trElement.appendChild(secondThElement);
    trElement.appendChild(thirdThElement);
    trElement.appendChild(fourthThElement);

    return trElement;
}
fetch(url)
    .then(res => res.json())
    .then(data => {
        for (const key in data) {
           
            let element = createTrTag(data, key);
            document.querySelector('tbody').appendChild(element);
        }
    })
    .catch(err => console.log(err))

document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    if (formData.get('firstName') !== '' && formData.get('lastName') !== '' && formData.get('facultyNumber') !== '' && formData.get('grade') !== '') {
        let infoObject = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            facultyNumber: formData.get('facultyNumber'),
            grade: formData.get('grade')
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
                let element = createTrTagToPut(data);
                document.querySelector('tbody').appendChild(element);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    }

})