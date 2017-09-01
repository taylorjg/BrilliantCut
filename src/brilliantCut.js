const R = require('ramda');

const max = xs => xs.reduce((acc, x) => Math.max(acc, x));
const sum = xs => xs.reduce((acc, x) => acc + x, 0);

function* generateCombinationsOfCuts(chunkSize, availableCuts, actualCuts) {
    actualCuts = actualCuts || [];
    for (let i = 0; i < availableCuts.length; i++) {
        const cut = availableCuts[i];
        const remainingChunkSize = chunkSize - cut.size;
        if (remainingChunkSize > 0) {
            const clonedActualCuts = actualCuts.slice();
            clonedActualCuts.push(cut);
            clonedActualCuts.sort((a, b) => b.size - a.size);
            yield clonedActualCuts;
            yield* generateCombinationsOfCuts(
                remainingChunkSize,
                availableCuts,
                clonedActualCuts);
        }
    }
}

const calculateProfitForCombinationOfCuts = chunkSize => actualCuts => {
    const cutValues = actualCuts.map(cut => cut.value);
    const cutSizes = actualCuts.map(cut => cut.size);
    console.log(`  chunkSize: ${chunkSize}; cutSizes: ${JSON.stringify(cutSizes)}`);
    const value = sum(cutValues);
    const sumOfCutSizes = sum(cutSizes);
    const waste = chunkSize - sumOfCutSizes;
    const profit = value - waste;
    return profit;
};

const calculateAllProfitsForRawChunk = availableCuts => rawChunk =>
    R.uniq(Array.from(generateCombinationsOfCuts(rawChunk, availableCuts)))
        .map(calculateProfitForCombinationOfCuts(rawChunk));

const calculateAllProfitsForAllRawChunks = ([gemType, gemData]) => {
    console.log(`processing ${gemType}...`);
    const memoized = R.memoize(calculateAllProfitsForRawChunk(gemData.cuts));
    /*
     * Strangely, if I do the following, it works but the memoization
     * seems to be bypassed so it takes longer to run:
     * return gemData.rawChunks.map(memoized);
     */
    return gemData.rawChunks.map(rawChunk => memoized(rawChunk));
};

const largestProfit = input => {
    const gemTypes = Object.entries(input);
    const largestTotalProfitPerGemType = gemTypes
        .map(calculateAllProfitsForAllRawChunks)
        .map(allProfitsForRawChunk => allProfitsForRawChunk.map(max))
        .map(sum);
    return sum(largestTotalProfitPerGemType);
};

module.exports = {
    largestProfit
};
