import {formatCuttingTimeSum} from './cuttingTimeManager.js';

// Function to reset the form and reset the row count
export function resetForm() {  // Call this function to create the first "Initial piece" row
    document.getElementById('resultSectionFromUi').style.display = 'none';
    const dataRows = document.getElementById("dataRows");
    dataRows.innerHTML = "";  // Clear the table rows
    rowCount = 0;  // Reset row count
    document.getElementById("result").innerHTML = "";
    addNewRow();  // Clear the result section
}


//Function to reset the PDF form
export function resetPdfForm() {
    document.getElementById('resultSectionFromPdf').style.display = 'none';
    document.getElementById("result1").innerHTML = "";  // Clear the result section
    document.getElementById('pdfFile').value = "";  // Clear the file input
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


// Function to generate the result strings, not tied to the UI
export function generateResultsString(finalResult) {
    // console.log(finalResult.updatedResultArray);
    let resultString = "";
    finalResult.updatedResultArray.forEach(item => {
        resultString += `Cut ${item.row}: Height = ${item.height} mm, Width = ${item.width} mm, Cutting time = ${item.cuttingTime}\n`;
    });
    resultString += `\nSequence cutting time: ${finalResult.totalCuttingTime}\n`;
    return resultString;
}


// Generic function to display results in the UI (for both UI and PDF input)
export function displayResultsInUI(finalResult, resultSectionId, resultDivId, sequenceNumber = null, isPDF = false, totalCuttingTime = 0, isLastSequence = false) {
    const resultString = generateResultsString(finalResult);
    document.getElementById(resultSectionId).style.display = 'block';
    const resultDiv = document.getElementById(resultDivId);

    // Add sequence number if provided
    if (sequenceNumber !== null) {
        resultDiv.innerHTML += `<strong>Sequence ${sequenceNumber}:</strong><br><br>`;
    }

    // Append result
    resultDiv.innerHTML += resultString.replace(/\n/g, '<br>');

    // If it's a PDF and there are multiple sequences, add extra space and a divider
    if (isPDF && sequenceNumber !== null) {
        resultDiv.innerHTML += `<br><br>`;  // Extra space after each sequence
        if (!isLastSequence) {
            resultDiv.innerHTML += `<hr>`;  // Add separator line between sequences
        }
    }

    // If it's the last sequence and PDF, display the total cutting time
    if (isPDF && isLastSequence) {
        resultDiv.innerHTML += `<hr><strong>Total Cutting Time: ${formatCuttingTimeSum(totalCuttingTime)}</strong><br><br>`;
    
    }
}