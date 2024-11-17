from flask import Flask, request, jsonify
import PyPDF2
from flask_cors import CORS
import logging
import re
import os

app = Flask(__name__)

# Enable CORS for the application
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Function to trim non-numeric or "(number)" parts from the end of a line
def trim_line(line):
    parts = line.split()
    # Remove non-numeric and "(number)" parts from the end until the last three numbers remain
    while len(parts) > 3 and (re.match(r'\(\d+\)', parts[-1]) or not parts[-1].replace('.', '', 1).isdigit()):
        parts.pop()
    return ' '.join(parts)

# Function to check if the line contains valid data with trimming if needed
def is_valid_data(line):
    parts = line.split()
    # Initial validity check
    is_valid = len(parts) >= 4 and all(part.replace('.', '', 1).isdigit() for part in parts[-3:])
    if not is_valid:
        # Trim the line and recheck validity
        trimmed_line = trim_line(line)
        parts = trimmed_line.split()
        is_valid = len(parts) >= 4 and all(part.replace('.', '', 1).isdigit() for part in parts[-3:])
        if is_valid:
            line = trimmed_line  # Update the line with the trimmed version if valid
    logging.debug(f"Line '{line}' validity after trimming: {is_valid}")
    return is_valid, line  # Return both validity and the potentially trimmed line

# Function to extract the first and last three numbers from a line
def extract_numbers(line):
    parts = line.split()
    first_number = parts[0]  # Get the first number (index 0)
    last_three_numbers = [part for part in parts[-3:] if part.replace('.', '', 1).isdigit()]
    logging.debug(f"Extracted numbers: {first_number} and last three {last_three_numbers}")
    return [first_number] + last_three_numbers  # Return all as a list

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    file = request.files.get('pdf')
    if not file:
        return jsonify({"error": "No file provided"}), 400

    try:
        pdf_reader = PyPDF2.PdfReader(file)
        extracted_data = []
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            if text:
                extracted_data.append(text)
            logging.debug(f"Extracted text from page {page_num}: {text[:100]}")  # Log first 100 chars for brevity

        # Refined data after the first filtering
        refined_data = []

        # First filtering based on specific keywords
        for item in extracted_data:
            # Process only pages that contain "8<"
            if "8<" in item:
                lines = item.split("\n")
                for line in lines:
                    # Exclude lines with specific keywords and check if the line is valid
                    is_valid, valid_line = is_valid_data(line)
                    if all(exclusion not in line for exclusion in ["8<", "<Remnant>", "Act/cube", "<Loss>"]) and is_valid:
                        refined_data.append(valid_line)  # Append the trimmed, valid line

        # Initialize variables for grouping sequences
        grouped_sequences = []
        current_group = []

        # Process the refined data
        for line in refined_data:
            parts = line.split()
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
            [[int(num) if num.isdigit() else float(num) for num in sequence[1:]] for sequence in group]
            for group in grouped_sequences
        ]

        logging.debug(f"Final grouped sequences: {final_grouped_sequences}")
        # Return the final grouped data in JSON format, without the first number and as integers
        return jsonify(grouped_sequences=final_grouped_sequences)

    except Exception as e:
        logging.error("Error processing PDF", exc_info=True)
        return jsonify({"error": "Failed to process PDF"}), 500

if __name__ == '__main__':
     # Dynamically set the port for Render, fallback to 5000 for local development
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
