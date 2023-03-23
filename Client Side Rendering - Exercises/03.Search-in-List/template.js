export function renderTowns(towns) {
    const ulElement = document.createElement('ul');
    ulElement.innerHTML = `${towns.map(town => `<li>${town}</li>`).join('')}`;
    return ulElement;
};
