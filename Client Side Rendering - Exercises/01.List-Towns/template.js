export function renderTowns(towns) {
    const ulElement = document.createElement('ul');
    ulElement.innerHTML = `${towns.map(t => `<li>${t}</li>`).join('')}`;
    return ulElement;
}