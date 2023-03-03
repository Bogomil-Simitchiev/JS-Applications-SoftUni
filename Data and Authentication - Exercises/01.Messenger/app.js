function attachEvents() {

    let submitButtonElement = document.getElementById('submit');
    let refreshButtonElement = document.getElementById('refresh');

    submitButtonElement.addEventListener('click', () => {
        let inputTextElements = document.querySelectorAll('input[type="text"]');

        let authorValue = inputTextElements[0].value;
        let textValue = inputTextElements[1].value;
        if (authorValue !== '' && textValue !== '') {
            let infoObject = {
                author: authorValue,
                content: textValue,
            }
            const url = `http://localhost:3030/jsonstore/messenger`;
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
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            inputTextElements[0].value = '';
            inputTextElements[1].value = '';
        }
    })

    refreshButtonElement.addEventListener('click', async () => {
        document.getElementById('messages').value = '';
        const url = `http://localhost:3030/jsonstore/messenger`;
        try {
            let response = await fetch(url);
            let data = await response.json();
            document.getElementById('messages').value = Object.values(data).map(x => x.author + ': ' + x.content).join('\n');
        } catch (error) {
            console.log(error);
        }


    })
}

attachEvents();