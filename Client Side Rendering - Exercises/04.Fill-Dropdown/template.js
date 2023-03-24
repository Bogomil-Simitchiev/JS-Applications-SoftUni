export function renderOptions(data, rootElement) {
    let fragment = document.createDocumentFragment();
    for (const key in data) {
        let optionElement = document.createElement('option');
        optionElement.value = key;
        optionElement.textContent = data[key].text;
        fragment.appendChild(optionElement);
    }
    rootElement.replaceChildren(fragment);
}