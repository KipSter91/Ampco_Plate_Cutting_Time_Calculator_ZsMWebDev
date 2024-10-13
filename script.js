import { checkMatchingElements } from './mainAlgorithm.js';
import { resetForm, addNewRow} from './uiUtils.js';
import { calculateCuttingTimes } from './calcCut.js';
import { calculateCuttingTime } from './cuttingTimeManager.js';
import { uploadPDF } from './pdfHandler.js';



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
const resetFormBtn = document.getElementById('resetFormBtn');
const uploadPDFBtn = document.getElementById('uploadPDFBtn');


//Events for the buttons
newRowBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addNewRow();
});
calculateCuttingTimeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  calculateCuttingTime();
});
resetFormBtn.addEventListener('click', (event) => {
  event.preventDefault();
  resetForm();
});
uploadPDFBtn.addEventListener('click', (event) => {
  event.preventDefault();
  uploadPDF();
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
