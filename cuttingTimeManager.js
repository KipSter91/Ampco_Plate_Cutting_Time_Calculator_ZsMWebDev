import { checkMatchingElements } from "./mainAlgorithm.js";
import { calculateCuttingTimes } from "./calcCut.js";


// Calculate cutting time
export function calculateCuttingTime(data) {
    const resultArray = checkMatchingElements(data);
    const finalResult = calculateCuttingTimes(resultArray);
    return finalResult;
}


// Function to convert cutting time to minutes and seconds
export function formatCuttingTime(cuttingTimeInMinutes) {
    const minutes = Math.floor(cuttingTimeInMinutes);
    const seconds = Math.round((cuttingTimeInMinutes - minutes) * 60);
    return { minutes, seconds };
}


// Function to sum all cutting times and format the total time in 'X min Y sec' format
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


// Function to convert cutting time from 'X min Y sec' format to total seconds
export function parseCuttingTime(cuttingTimeString) {
    const [minutes, seconds] = cuttingTimeString.match(/\d+/g).map(Number);
    return (minutes * 60) + seconds; // Teljes vágási idő másodpercben
}


// Function to format cutting time from total seconds to 'X hr Y min Z sec' format
export function formatCuttingTimeSum(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);  // Calculate hours
    const minutes = Math.floor((totalSeconds % 3600) / 60);  // Calculate remaining minutes
    const seconds = totalSeconds % 60;  // Calculate remaining seconds

    // Build the formatted result
    let formattedTime = "";
    if (hours > 0) {
        formattedTime += `${hours} hr `;  // Add hours if there are any
    }
    if (minutes > 0 || hours > 0) {
        formattedTime += `${minutes} min `;  // Add minutes if there are any or if there were hours
    }
    formattedTime += `${seconds} sec`;  // Always add the seconds

    return formattedTime;  // Return the formatted string
}