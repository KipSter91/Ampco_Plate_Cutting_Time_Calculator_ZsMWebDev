import { getCuttingSpeed } from "./defineParams.js";
import { formatCuttingTime, sumCuttingTimes } from "./cuttingTimeManager.js";


// Function to calculate the cutting times for all rows after dimensions are determined
export function calculateCuttingTimes(resultArray) {
    const cuttingTimes = [];
  
    const updatedResultArray = resultArray.map(item => {
      const speed = getCuttingSpeed(item.width); // Get speed based on width
      const cuttingTime = item.height / speed; // Only height is divided by speed
      const formattedTime = formatCuttingTime(cuttingTime); // Convert to minutes and seconds
  
      // Store cutting times for summation later
      cuttingTimes.push(formattedTime);
      return {
        ...item,
        cuttingTime: `${formattedTime.minutes} min ${formattedTime.seconds} sec`
      };
    });
    const totalCuttingTime = sumCuttingTimes(cuttingTimes);
    return { updatedResultArray, totalCuttingTime };
  }