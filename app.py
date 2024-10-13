from flask import Flask, request, jsonify
import PyPDF2
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for the application
CORS(app)

# Function to extract the first and last three numbers from a line
def extract_numbers(line):
    parts = line.split()
    first_number = parts[0]  # Get the first number (index 0)
    last_three_numbers = parts[-3:]  # Get the last three numbers
    return [first_number] + last_three_numbers  # Return all as a list

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    file = request.files['pdf']
    pdf_reader = PyPDF2.PdfReader(file)  # Use PdfReader

    extracted_data = []
    for page_num in range(len(pdf_reader.pages)):  # Extract text from each page
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        extracted_data.append(text)

    # Refined data after the first filtering
    refined_data = []

    # First filtering based on specific keywords
    for item in extracted_data:
        # Process only pages that contain "8<"
        if "8<" in item:
            lines = item.split("\n")
            for line in lines:
                # Exclude lines with specific keywords and check if the line is valid
                if all(exclusion not in line for exclusion in ["8<", "<Remnant>", "Act/cube", "<Loss>"]) and is_valid_data(line):
                    refined_data.append(line)

    # Initialize variables for grouping sequences
    grouped_sequences = []
    current_group = []

    # Process the refined data
    for line in refined_data:
        parts = line.split()
        print(parts)
        # Check if the line starts with "1", indicating a new sequence
        if parts[0] == "1" and current_group:
            grouped_sequences.append(current_group)  # Add the current group to the list
            current_group = []  # Start a new group

        # Add the extracted numbers (first number + last three) to the group
        current_group.append(extract_numbers(line))

    # Add the final group if any lines remain
    if current_group:
        grouped_sequences.append(current_group)

    # Convert the strings in grouped_sequences to integers, removing the first number
    final_grouped_sequences = [
        [[int(num) for num in sequence[1:]] for sequence in group]
        for group in grouped_sequences
    ]

    # Return the final grouped data in JSON format, without the first number and as integers
    return jsonify(grouped_sequences=final_grouped_sequences)

# Function to check if the line contains valid data
def is_valid_data(line):
    parts = line.split()
    # Ensure the line has at least 4 parts and the last 3 are numeric
    if len(parts) >= 4 and all(part.isdigit() for part in parts[-3:]):
        return True
    return False

if __name__ == '__main__':
    app.run(debug=True)
