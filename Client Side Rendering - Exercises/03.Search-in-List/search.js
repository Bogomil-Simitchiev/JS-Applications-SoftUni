import { towns } from "./towns.js";
import { renderTowns } from "./template.js";

const ulElement = renderTowns(towns);
document.getElementById('towns').appendChild(ulElement);

let inputFieldElement = document.getElementById('searchText');
let btnElement = document.querySelector('button');

let matches = 0;

btnElement.addEventListener('click', onClick)
function onClick() {
   if (inputFieldElement.value != '') {
      let liElements = ulElement.querySelectorAll('li');
      liElements.forEach(liElement => {

         if (liElement.textContent.includes(inputFieldElement.value)) {
            liElement.classList.add('active');
            matches++;
         } else {
            liElement.classList.remove('active');
         }

      })
      document.getElementById('result').textContent = `${matches} matches found`;
      matches = 0;
   }
}
