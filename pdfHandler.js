import { calculateCuttingTime, parseCuttingTime } from './cuttingTimeManager.js';
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


export async function uploadPDF() {
    if (!checkFileUpload()) {
        return;
    }
    document.getElementById('result1').innerHTML = "";
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

    let totalCuttingTime = 0;
    let sequenceNumber = 1;

    for (let i = 0; i < data.grouped_sequences.length; i++) {
        const sequence = data.grouped_sequences[i];
        
        // Format each sequence
        const formattedData = sequence.map(item => ({
            X: item[0],
            Y: item[1],
            Z: item[2]
        }));

        // Perform calculation asynchronously
        const finalResult = await calculateCuttingTime(formattedData);
        console.log("Final result:", finalResult);

        // Accumulate total cutting time
        totalCuttingTime += parseCuttingTime(finalResult.totalCuttingTime);
        console.log(totalCuttingTime);
        
        // Check if it's the last sequence
        const isLastSequence = (i === data.grouped_sequences.length - 1);

        // Display each sequence's result and pass relevant PDF-specific information
        displayResultsInUI(finalResult, 'resultSectionFromPdf', 'result1', sequenceNumber, true, totalCuttingTime, isLastSequence);
        sequenceNumber++;
    }
}