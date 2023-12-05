const table = document.getElementById('myTable');
const tbody = table.getElementsByTagName('tbody')[0];
const rows = tbody.getElementsByTagName('tr');

const tableData = [];

// Iterate through each row
for (let i = 0; i < rows.length; i++) {
  const cells = rows[i].getElementsByTagName('td');
  const rowData = [];

  // Extract data from cells within each row
  for (let j = 0; j < cells.length; j++) {
    rowData.push(cells[j].innerText);
  }

  // Store row data in a collection
  tableData.push(rowData);
}

console.log(tableData);


/******************************************************************** */
const table = document.getElementById('myTable');
const rowsCollection = table.rows;
const tableData = [];

for (let i = 0; i < rowsCollection.length; i++) {
  const row = rowsCollection[i];
  const rowData = [];

  for (let j = 0; j < row.cells.length; j++) {
    const cell = row.cells[j];
    rowData.push(cell.innerText);
  }

  tableData.push(rowData);
}

console.log(tableData);
/********************************************************************* */