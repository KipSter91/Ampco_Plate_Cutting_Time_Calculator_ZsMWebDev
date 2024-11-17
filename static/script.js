import { resetForm, resetPdfForm, addNewRow } from './uiUtils.js';
import { calculateCuttingTime } from './cuttingTimeManager.js';
import { uploadPDF } from './pdfHandler.js';
import { getDataFromUI } from './uiUtils.js';
import { displayResultsInUI } from './uiUtils.js';



// Dynamically set the current year in the copyright footer
const currentYear = new Date().getFullYear();
document.getElementById("copyright-year").textContent = currentYear;


// Automatically add the first row when the page loads
window.onload = function () {
  addNewRow();  // Call this function to create the first "Initial piece" row
};


//Buttons from the UI
const newRowBtn = document.getElementById('addNewRowBtn');
const calculateCuttingTimeBtn = document.getElementById('calculateCuttingTimeBtn');
const resetUiBtn = document.getElementById('resetUiBtn');
const uploadPDFBtn = document.getElementById('uploadPDFBtn');
const choosePdfBtn = document.getElementById('choosePdfBtn');
const resetPdfBtn = document.getElementById('resetPdfBtn');


//Events for the buttons
newRowBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addNewRow();
});
calculateCuttingTimeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  document.getElementById('result').innerHTML = ""; 
  displayResultsInUI(calculateCuttingTime(getDataFromUI()), 'resultSectionFromUi', 'result');

});
resetUiBtn.addEventListener('click', (event) => {
  event.preventDefault();
  resetForm();
});
choosePdfBtn.addEventListener('click', (event) => {
  event.preventDefault();
  document.getElementById('pdfFile').click();
});
uploadPDFBtn.addEventListener('click', (event) => {
  event.preventDefault();
  uploadPDF();
});
resetPdfBtn.addEventListener('click', (event) => {
  event.preventDefault();
  resetPdfForm();
});



//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////Test data/////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// const testData = [
//   { X: 165, Y: 324, Z: 100 },
//   { X: 55, Y: 324, Z: 100 },
//   { X: 55, Y: 225, Z: 100 },
//   { X: 55, Y: 225, Z: 80 },
//   { X: 25, Y: 225, Z: 80 },
//   { X: 25, Y: 225, Z: 80 }
// ]
// // Execute the functions with the test data
// const resultArray = checkMatchingElements(testData); // Step 1: Get dimensions
// const { updatedResultArray, totalCuttingTime } = calculateCuttingTimes(resultArray); // Step 2: Calculate cutting time
// // Output the final array and total cutting time
// console.log("Final array with cutting times in minutes and seconds:");
// console.log(updatedResultArray);
// console.log("Total cutting time:");
// console.log(totalCuttingTime);
