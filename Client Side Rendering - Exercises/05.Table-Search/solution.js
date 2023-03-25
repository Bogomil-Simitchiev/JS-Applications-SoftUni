import { loadAll } from "./getrequest.js";

const tbodyElement = document.querySelector('tbody');

loadAll(tbodyElement);

document.querySelector('#searchBtn').addEventListener('click', onClick);

function onClick() {
   const input = document.getElementById('searchField')
   const rows = [...document.getElementsByTagName('tr')].slice(1)
   rows.forEach(x => x.className = '')
   const selectedRows = rows
      .filter(x => x.textContent.toLocaleLowerCase()
         .includes(input.value.toLocaleLowerCase()))

   selectedRows.forEach(x => x.className = 'select')
   input.value = '';
}