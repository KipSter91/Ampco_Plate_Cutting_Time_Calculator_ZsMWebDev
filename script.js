// Dynamically set the current year in the copyright footer
const currentYear = new Date().getFullYear();
document.getElementById("copyright-year").textContent = currentYear;


// Automatically add the first row when the page loads
window.onload = function () {
  addNewRow();  // Call this function to create the first "Initial piece" row
};


// Function to reset the form and reset the row count
function resetForm() {
  document.getElementById('resultSection').style.display = 'none';
  const dataRows = document.getElementById("dataRows");
  dataRows.innerHTML = "";  // Clear the table rows
  rowCount = 0;  // Reset row count
  addNewRow();  // Optionally add the first "Initial piece" row again
  document.getElementById("result").innerHTML = "";  // Clear the result section
}


// Dynamically add rows to the UI
let rowCount = 0;
function addNewRow() {
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
function getDataFromUI() {
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


// Get cutting speed based on width (mm/min)
function getCuttingSpeed(width) {
  const speedRanges = [
    { min: 0, max: 100, speed: 40 },
    { min: 101, max: 250, speed: 30 },
    { min: 251, max: 300, speed: 25 },
    { min: 301, max: 500, speed: 15 },
  ];
  const range = speedRanges.find(r => width >= r.min && width <= r.max);
  return range ? range.speed : 10; // Default speed if no appropriate range is found
}


// Calculate cutting time
function calculateCuttingTime() {
  const data = getDataFromUI();
  const resultArray = checkMatchingElements(data);
  const finalResult = calculateCuttingTimes(resultArray);
  displayResults(finalResult);
}


// Display results
function displayResults(finalResult) {
  document.getElementById('resultSection').style.display = 'block';
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; // Clear previous results if they exist
  finalResult.updatedResultArray.forEach(item => {
    resultDiv.innerHTML += `Cut ${item.row}: Height = ${item.height} mm, Width = ${item.width} mm, Cutting time = ${item.cuttingTime}<br>`;
  });
  resultDiv.innerHTML += `<br><strong>Total cutting time:</strong> ${finalResult.totalCuttingTime}`;
}


// Existing calculation functions like checkMatchingElements and calculateCuttingTimes remain unchanged
// Function to determine the dimensions (height and width) based on matching elements
function determineDimensions(pair1, pair2) {
  // If both values are less than 250, the larger becomes the width
  if (pair1 < 250 && pair2 < 250) {
    return {
      height: Math.min(pair1, pair2),
      width: Math.max(pair1, pair2)
    };
  }
  // If one of the values is greater than 520, that becomes the height
  else if (pair1 > 520 || pair2 > 520) {
    return {
      height: Math.max(pair1, pair2),
      width: Math.min(pair1, pair2)
    };
  }
  // If both values are between 250 and 520, the larger becomes the height
  else {
    return {
      height: Math.max(pair1, pair2),
      width: Math.min(pair1, pair2)
    };
  }
}


// THE FUCKING ALGORITHM TO CHECK FOR MATCHING ELEMENTS FROM ACTCUBE DRAWING
function checkMatchingElements(data) {
  let resultArray = [];
  for (let i = 1; i < data.length; i++) {
    let prevRowIndex = i - 1;
    while (prevRowIndex >= 0) {
      const prevRow = data[prevRowIndex];
      const currRow = data[i];
      const matchingElements = [];
      if (currRow.X === prevRow.X) matchingElements.push({ name: 'X', value: currRow.X });
      if (currRow.Y === prevRow.Y) matchingElements.push({ name: 'Y', value: currRow.Y });
      if (currRow.Z === prevRow.Z) matchingElements.push({ name: 'Z', value: currRow.Z });

      // Break when exactly two values match and one differs
      if (matchingElements.length === 2) {

        // Get the two matching values
        let value1 = matchingElements[0].value;
        let value2 = matchingElements[1].value;

        // Determine the dimensions (height and width)
        const { height, width } = determineDimensions(value1, value2);

        // Add the result to the array without calculating cutting time yet
        resultArray.push({
          row: i,
          height: height,
          width: width
        });
        break;
      }

      // Keep stepping back if fewer than two match
      prevRowIndex--;
    }
  }

  return resultArray;
}


// Function to convert cutting time to minutes and seconds
function formatCuttingTime(cuttingTimeInMinutes) {
  const minutes = Math.floor(cuttingTimeInMinutes);
  const seconds = Math.round((cuttingTimeInMinutes - minutes) * 60);
  return { minutes, seconds };
}


// Function to sum all cutting times and format the total time
function sumCuttingTimes(cuttingTimes) {
  let totalMinutes = 0;
  let totalSeconds = 0;

  // Sum the individual times
  cuttingTimes.forEach(time => {
    totalMinutes += time.minutes;
    totalSeconds += time.seconds;
  });

  // Convert extra seconds to minutes
  totalMinutes += Math.floor(totalSeconds / 60);
  totalSeconds = totalSeconds % 60;

  return `${totalMinutes} min ${totalSeconds} sec`;
}


// Function to calculate the cutting times for all rows after dimensions are determined
function calculateCuttingTimes(resultArray) {
  const cuttingTimes = [];

  const updatedResultArray = resultArray.map(item => {
    const speed = getCuttingSpeed(item.width); // Get speed based on width
    const cuttingTime = item.height / speed; // Only height is divided by speed
    const formattedTime = formatCuttingTime(cuttingTime); // Convert to minutes and seconds

    // Store cutting times for summation later
    cuttingTimes.push(formattedTime);
    return {
      ...item,
      cuttingTime: `${formattedTime.minutes} min ${formattedTime.seconds} sec`
    };
  });
  const totalCuttingTime = sumCuttingTimes(cuttingTimes);
  return { updatedResultArray, totalCuttingTime };
}


// Function to upload the PDF to the backend
async function uploadPDF() {
  document.getElementById('extractedDataSection').style.display = 'block';
  const pdfFile = document.getElementById('pdfFile').files[0];
  const formData = new FormData();
  formData.append('pdf', pdfFile);

  // Send the PDF to the backend for processing
  const response = await fetch('http://127.0.0.1:5000/process-pdf', {
    method: 'POST',
    body: formData
  });

  // Get the JSON response from the server
  const data = await response.json();
  console.log(data);

  // Display the extracted data
  document.getElementById('result1').innerText = JSON.stringify(data, null, 2);
  
}





//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////Test data/////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
const testData = [
  { X: 165, Y: 324, Z: 100 },
  { X: 55, Y: 324, Z: 100 },
  { X: 55, Y: 225, Z: 100 },
  { X: 55, Y: 225, Z: 80 },
  { X: 25, Y: 225, Z: 80 },
  { X: 25, Y: 225, Z: 80 }
];

// Execute the functions with the test data
const resultArray = checkMatchingElements(testData); // Step 1: Get dimensions
const { updatedResultArray, totalCuttingTime } = calculateCuttingTimes(resultArray); // Step 2: Calculate cutting times

// Output the final array and total cutting time
console.log("Final array with cutting times in minutes and seconds:");
console.log(updatedResultArray);
console.log("Total cutting time:");
console.log(totalCuttingTime);
