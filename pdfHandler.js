import { calculateCuttingTime } from './cuttingTimeManager.js';
import { displayResultsInUI } from './uiUtils.js';


// Function to check if a file is uploaded
function checkFileUpload() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];
    if (!file) {
        console.error('No file selected. Please select a file to upload.');
        return false;
    }
    return true;
};


// Function to upload the PDF file
export async function uploadPDF() {
    if (!checkFileUpload()) {
        return;
    }

    document.getElementById('resultSectionFromPdf').style.display = 'block';
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
    console.log("Extracted data:", data);

    // Clear previous results before appending new ones
    document.getElementById('result').innerHTML = '';

    // Process each sequence individually and track sequence number
    let sequenceNumber = 1;  // Start from 1

    for (const sequence of data.grouped_sequences) {
        // Format each sequence
        const formattedData = sequence.map(item => ({
            X: item[0],
            Y: item[1],
            Z: item[2]
        }));

        // Perform calculation asynchronously
        const finalResult = await calculateCuttingTime(formattedData);
        console.log("Final result:", finalResult);

        // Display each sequence's result in the UI and pass the sequence number
        displayResultsInUI(finalResult, 'resultSectionFromPdf', 'result1', sequenceNumber);
        sequenceNumber++;  // Increment sequence number for the next sequence
    }
}