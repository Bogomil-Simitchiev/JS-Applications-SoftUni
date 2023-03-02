async function solution() {
    try {
        const response = await fetch(`http://localhost:3030/jsonstore/advanced/articles/list`);
        let data = await response.json();

        for (const info of data) {

            //head div
            let accordionElement = document.createElement('div');
            accordionElement.classList.add('accordion');

            let headDivElement = document.createElement('div');
            headDivElement.classList.add('head');
            let spanElement = document.createElement('span');
            spanElement.textContent = info.title;

            let btnElement = document.createElement('button');
            btnElement.classList.add('button');
            btnElement.id = info._id;
            btnElement.textContent = 'More';
            btnElement.addEventListener('click', (e) => {
                let extraDivElement = e.currentTarget.parentNode.parentNode.querySelector('.extra');

                if (e.currentTarget.textContent == 'More') {
                    e.currentTarget.textContent = 'Less';
                    extraDivElement.style.display = 'block';

                } else {
                    e.currentTarget.textContent = 'More';
                    extraDivElement.style.display = 'none';
                }

            })

            headDivElement.appendChild(spanElement);
            headDivElement.appendChild(btnElement);

            accordionElement.appendChild(headDivElement);

            //extra div
            let extraDivElement = document.createElement('div');
            extraDivElement.classList.add('extra');

            let paragraphElement = document.createElement('p');

            const urlForParagraph = `http://localhost:3030/jsonstore/advanced/articles/details/${info._id}`;
            fetch(urlForParagraph)
                .then(res => res.json())
                .then(result => {
                    paragraphElement.textContent = result.content;
                })
                .catch(err => console.log(err))


            extraDivElement.appendChild(paragraphElement);
            accordionElement.appendChild(extraDivElement);
            document.getElementById('main').appendChild(accordionElement);

        }
    } catch (error) {
        console.log(error);
    }

}
solution();