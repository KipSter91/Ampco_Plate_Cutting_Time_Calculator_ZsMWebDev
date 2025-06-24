# Ampco® Plate Cutting Time Calculator

This project is a web-based calculator tool developed for Ampco® Metal EDC Services B.V. ([ampcometal.com](https://www.ampcometal.com)), a registered brand. Its purpose is to calculate the required cutting time for plate cutting operations, based on X, Y, Z values extracted from Act/Cube® (Almasoft 3D nesting software) PDF drawings or entered manually, providing sequential time estimates for each operation.

## Main Features

- **Manual Data Entry:** Users can manually input the X, Y, Z values required for the cutting operation.
- **PDF Upload:** Users can upload an Act/Cube® PDF drawing, from which the system automatically extracts the necessary data.
- **Cutting Time Calculation:** The calculator computes the required cutting time for each sequence based on the provided or extracted data.
- **Results Display:** Results are shown in a clear, tabular format for easy interpretation.

## Usage

1. **Enter Data:**
   - Fill in the X, Y, Z fields manually, or upload a PDF drawing.
2. **Calculate:**
   - Click the "Calculate" button to compute the cutting time.
3. **View Results:**
   - Results will be displayed on the page, per sequence.

## File Structure

- `app.py` – Backend logic (e.g., PDF processing)
- `static/` – Frontend files (HTML, CSS, JS, images)
  - `index.html` – Main user interface
  - `style.css` – Stylesheet
  - `script.js` and additional JS files – Calculation and UI logic
  - Images, logos

## Installation & Running

1. **Requirements:**
   - Python 3.x
   - Required packages: see `requirements.txt`
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the app:**
   ```bash
   python app.py
   ```
4. **Usage:**
   - Open your browser and go to the provided address (e.g., http://127.0.0.1:5000)

## Author

ZsMWebDev | Zsolt Márku | Kipster91

---

**Project for Ampco Metal EDC Services B.V.**
