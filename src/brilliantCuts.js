'use strict';

// {
//     "diamond": {
//       "cuts": [
//         {"size": 7, "value": 7},
//         {"size": 11, "value": 14},
//         {"size": 17, "value": 25}
//       ],
//       "rawChunks": [23]
//     }
// }

function* calculateCombinations(chunkSize, cuts, currentCuts) {
    currentCuts = currentCuts || [];
    for (let i = 0; i < cuts.length; i++) {
        const cut = cuts[i];
        const remainingChunkSize = chunkSize - cut.size;
        if (remainingChunkSize > 0) {
            const clonedCurrentCuts = currentCuts.slice();
            clonedCurrentCuts.push(cut);
            yield clonedCurrentCuts;
            yield* calculateCombinations(remainingChunkSize, cuts, clonedCurrentCuts);
        }
    }
}

const calculateDetails = (rawChunkSize, cuts) => {

    const value = sum(cuts.map(x => x.value));
    const sumOfCutSizes = sum(cuts.map(x => x.size));
    const waste = rawChunkSize - sumOfCutSizes;
    const profit = value - waste;

    return {
        cuts: cuts.map(x => x.size),
        value,
        waste,
        profit
    };
};

const maxBy = (xs, f) => xs.reduce((acc, x) => f(x) > f(acc) ? x : acc);
const sum = xs => xs.reduce((a, b) => a + b);

const process = input => {
    const rawChunkSize = input.diamond.rawChunks[0];
    const cuts = input.diamond.cuts;
    const combinationsOfCuts = Array.from(calculateCombinations(rawChunkSize, cuts));
    const cutDetails = combinationsOfCuts.map(currentCuts => calculateDetails(rawChunkSize, currentCuts));
    return cutDetails;
};

const largestProfit = input => maxBy(process(input), e => e.profit).profit;

module.exports = {
    process,
    largestProfit
};
