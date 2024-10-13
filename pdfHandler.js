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


// Function to upload the PDF to the backend and use the extracted data
export async function uploadPDF() {
    if (!checkFileUpload()) {
        return;
    }
    document.getElementById('extractedDataSection').style.display = 'block';
    const pdfFile = document.getElementById('pdfFile').files[0];
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    {

        // Send the PDF to the backend for processing
        const response = await fetch('http://127.0.0.1:5000/process-pdf', {
            method: 'POST',
            body: formData
        });

        // Get the JSON response from the server
        const data = await response.json();
        console.log("Total cutting time: ", data);


    };
};