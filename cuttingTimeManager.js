import { getDataFromUI, displayResults } from "./uiUtils.js";
import { checkMatchingElements } from "./mainAlgorithm.js";
import { calculateCuttingTimes } from "./calcCut.js";


// Calculate cutting time
export function calculateCuttingTime() {
    const data = getDataFromUI();
    const resultArray = checkMatchingElements(data);
    const finalResult = calculateCuttingTimes(resultArray);
    displayResults(finalResult);
}


// Function to convert cutting time to minutes and seconds
export function formatCuttingTime(cuttingTimeInMinutes) {
    const minutes = Math.floor(cuttingTimeInMinutes);
    const seconds = Math.round((cuttingTimeInMinutes - minutes) * 60);
    return { minutes, seconds };
}


// Function to sum all cutting times and format the total time
export function sumCuttingTimes(cuttingTimes) {
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