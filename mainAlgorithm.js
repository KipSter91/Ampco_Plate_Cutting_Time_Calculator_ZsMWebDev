import { determineDimensions } from './defineParams.js';


// THE FUCKING ALGORITHM TO CHECK FOR MATCHING ELEMENTS FROM ACTCUBE DRAWING
export function checkMatchingElements(data) {
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