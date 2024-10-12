from flask import Flask, request, jsonify
import PyPDF2
from flask_cors import CORS

app = Flask(__name__)

# Engedélyezd a CORS-t az alkalmazásra
CORS(app)

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    file = request.files['pdf']
    pdf_reader = PyPDF2.PdfReader(file)  # PdfReader-t használunk

    extracted_data = []
    for page_num in range(len(pdf_reader.pages)):  # numPages helyett len(reader.pages)
        page = pdf_reader.pages[page_num]  # getPage helyett pages[page_num]
        text = page.extract_text()
        extracted_data.append(text)

    return jsonify(extracted_data=extracted_data)

if __name__ == '__main__':
    app.run(debug=True)
