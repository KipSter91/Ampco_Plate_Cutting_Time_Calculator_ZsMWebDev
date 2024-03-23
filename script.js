'use strict';   // JavaScript strict mode

// Beginning material dimensions
const beginMaterialDimensions = {
    X: 1654,
    Y: 450,
    Z: 50.8
};

// Cutting flow data structure
const cuttingFlow = {
    X: [1654, 730, 730, 1654, 1654, 715, 715, 715, 1654, 1275, 1275, 1654, 1275, 1275],
    Y: [39, 39, 17, 165, 165, 165, 80, 80, 65, 65, 65, 65, 65, 65],
    Z: [50.8, 50.8, 50.8, 50.8, 39, 39, 39, 17, 50.8, 50.8, 17, 50.8, 50.8, 17]
};

// Concatenate beginning material dimensions onto the cutting flow coordinates
for (const key in beginMaterialDimensions) {
    cuttingFlow[key].unshift(beginMaterialDimensions[key]);
}

let currentSet = [[cuttingFlow.X[0], cuttingFlow.Y[0], cuttingFlow.Z[0]]]; // Start with the first set of coordinates
let repeatCount = 0;

for (let i = 1; i < cuttingFlow.X.length; i++) {
    const x1 = cuttingFlow.X[i - 1];
    const y1 = cuttingFlow.Y[i - 1];
    const z1 = cuttingFlow.Z[i - 1];
    const x2 = cuttingFlow.X[i];
    const y2 = cuttingFlow.Y[i];
    const z2 = cuttingFlow.Z[i];

    if (x1 === x2 && y1 === y2 && z1 === z2) {
        repeatCount++;
        currentSet.push([x2, y2, z2]); // Add the repeated coordinates to the current set
    } else {
        if (repeatCount > 0) {
            console.log(`Repeat ${repeatCount}:`, currentSet); // Log the repeat
        }
        currentSet = [[x2, y2, z2]]; // Start a new set with the current coordinates
        repeatCount = 0;
    }
}

// Log the last set if it's a repeat
if (repeatCount > 0) {
    console.log(`Repeat ${repeatCount}:`, currentSet);
}

