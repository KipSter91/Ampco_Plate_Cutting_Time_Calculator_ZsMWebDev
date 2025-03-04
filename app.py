from flask import Flask, request, jsonify, send_from_directory
import PyPDF2
from flask_cors import CORS
import logging
import re
import os

# Initialize Flask application
# Specify "static" folder for serving frontend files (HTML, CSS, JavaScript)
app = Flask(__name__, static_folder="static")

# Enable CORS for the application
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Route for serving the main HTML file
@app.route('/')
def serve_home():
    return send_from_directory(app.static_folder, "index.html")  # Serve index.html from the "static" folder

# Route for serving static files (CSS, JavaScript, images, etc.)
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

# Function to trim non-numeric or "(number)" parts from the end of a line
def trim_line(line):
    logging.debug(f"Before trimming: '{line}'")

    # 1️⃣ If there is an opening parenthesis '(' but no closing ')', add a ')' at the end
    if '(' in line and ')' not in line:
        line += ')'
        logging.debug(f"Added missing closing parenthesis: '{line}'")

    # 2️⃣ Remove trailing parentheses groups (only from the end of the line)
    while re.search(r'\([\d\s\w\.\-]*\)\s*$', line):  # Matches (xxx) at the end
        line = re.sub(r'\([\d\s\w\.\-]*\)\s*$', '', line).strip()
        logging.debug(f"Removed trailing parenthesis group, new line: '{line}'")

    # 3️⃣ Split the cleaned line into words
    parts = line.split()

    # 4️⃣ Remove trailing non-numeric elements while ensuring at least 4 elements remain
    while parts and not parts[-1].replace('.', '', 1).isdigit():
        logging.debug(f"Removing non-numeric part: {parts[-1]}")
        parts.pop()

    # 5️⃣ Ensure the line has at least 4 elements (not necessarily all numbers)
    if len(parts) < 4:
        logging.debug("Line is too short after trimming, returning empty string.")
        return ""

    # 6️⃣ Reconstruct the cleaned line
    final_line = ' '.join(parts)
    logging.debug(f"Final trimmed line: '{final_line}'")
    return final_line

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

# Endpoint for processing the uploaded PDF
@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    file = request.files.get('pdf')  # Retrieve the uploaded PDF file
    if not file:
        return jsonify({"error": "No file provided"}), 400

    try:
        pdf_reader = PyPDF2.PdfReader(file)  # Read the PDF file
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
