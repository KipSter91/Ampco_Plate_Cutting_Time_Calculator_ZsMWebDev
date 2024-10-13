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
        ...item, // Spread the existing item
        cuttingTime: `${formattedTime.minutes} min ${formattedTime.seconds} sec` // Add cutting time to the item
      };
    });

    console.log(cuttingTimes); // Debugging
    
    const totalCuttingTime = sumCuttingTimes(cuttingTimes); // Sum all cutting times
    return { updatedResultArray, totalCuttingTime }; // Return the updated array and total cutting time
  }