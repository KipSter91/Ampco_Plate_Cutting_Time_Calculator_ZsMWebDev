// Function to reset the form and reset the row count
export function resetForm() {
    document.getElementById('resultSection').style.display = 'none';
    const dataRows = document.getElementById("dataRows");
    dataRows.innerHTML = "";  // Clear the table rows
    rowCount = 0;  // Reset row count
    addNewRow();  // Optionally add the first "Initial piece" row again
    document.getElementById("result").innerHTML = "";  // Clear the result section
}


// Dynamically add rows to the UI
let rowCount = 0;
export function addNewRow() {
    const dataRows = document.getElementById("dataRows");
    const rowElement = document.createElement("tr");
    const label = rowCount === 0 ? "Initial piece" : `Row ${rowCount}`;

    // Create the new row with inputs
    rowElement.innerHTML = `
          <td>${label}</td>
          <td><input type="number" id="x${rowCount}" placeholder="Enter value"></td>
          <td><input type="number" id="y${rowCount}" placeholder="Enter value"></td>
          <td><input type="number" id="z${rowCount}" placeholder="Enter value"></td>
      `;
    dataRows.appendChild(rowElement);

    // Automatically focus the first input field in the newly added row
    document.getElementById(`x${rowCount}`).focus();
    rowCount++;
}


// Function to collect data from the UI
export function getDataFromUI() {
    const data = [];
    for (let i = 0; i < rowCount; i++) {
        const X = parseInt(document.getElementById(`x${i}`).value);
        const Y = parseInt(document.getElementById(`y${i}`).value);
        const Z = parseInt(document.getElementById(`z${i}`).value);
        if (!isNaN(X) && !isNaN(Y) && !isNaN(Z)) {
            data.push({ X, Y, Z });
        }
    }
    return data;
}


// Function to display the results in the UI
export function displayResults(finalResult) {
    document.getElementById('resultSection').style.display = 'block';
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Clear previous results if they exist
    finalResult.updatedResultArray.forEach(item => {
      resultDiv.innerHTML += `Cut ${item.row}: Height = ${item.height} mm, Width = ${item.width} mm, Cutting time = ${item.cuttingTime}<br>`;
    });
    resultDiv.innerHTML += `<br><strong>Total cutting time:</strong> ${finalResult.totalCuttingTime}`;
  }