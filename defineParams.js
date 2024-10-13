// Function to determine the dimensions (height and width) based on matching elements
export function determineDimensions(pair1, pair2) {
    // If both values are less than 250, the larger becomes the width
    if (pair1 < 250 && pair2 < 250) {
        return {
            height: Math.min(pair1, pair2),
            width: Math.max(pair1, pair2)
        };
    }
    // If one of the values is greater than 520, that becomes the height
    else if (pair1 > 520 || pair2 > 520) {
        return {
            height: Math.max(pair1, pair2),
            width: Math.min(pair1, pair2)
        };
    }
    // If both values are between 250 and 520, the larger becomes the height
    else {
        return {
            height: Math.max(pair1, pair2),
            width: Math.min(pair1, pair2)
        };
    }
}


// Get cutting speed based on width (mm/min)
export function getCuttingSpeed(width) {
    const speedRanges = [
      { min: 0, max: 100, speed: 40 },
      { min: 101, max: 250, speed: 30 },
      { min: 251, max: 300, speed: 25 },
      { min: 301, max: 500, speed: 15 },
    ];
    const range = speedRanges.find(r => width >= r.min && width <= r.max);
    return range ? range.speed : 10; // Default speed if no appropriate range is found
  }