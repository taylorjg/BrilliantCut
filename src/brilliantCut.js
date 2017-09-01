const R = require('ramda');

const max = xs => xs.reduce((acc, x) => Math.max(acc, x));
const sum = xs => xs.reduce((acc, x) => acc + x, 0);

function* generateCombinationsOfCuts(chunkSize, availableCuts, currentCuts) {
    currentCuts = currentCuts || [];
    for (let i = 0; i < availableCuts.length; i++) {
        const cut = availableCuts[i];
        const remainingChunkSize = chunkSize - cut.size;
        if (remainingChunkSize > 0) {
            const clonedCurrentCuts = currentCuts.slice();
            clonedCurrentCuts.push(cut);
            clonedCurrentCuts.sort((a, b) => b.size - a.size);
            yield clonedCurrentCuts;
            yield* generateCombinationsOfCuts(
                remainingChunkSize,
                availableCuts,
                clonedCurrentCuts);
        }
    }
}

const calculateProfitForCombinationOfCuts = chunkSize => cuts => {
    const cutValues = cuts.map(cut => cut.value);
    const cutSizes = cuts.map(cut => cut.size);
    console.log(`  chunkSize: ${chunkSize}; cutSizes: ${JSON.stringify(cutSizes)}`);
    const value = sum(cutValues);
    const sumOfCutSizes = sum(cutSizes);
    const waste = chunkSize - sumOfCutSizes;
    const profit = value - waste;
    return profit;
};

const calculateAllProfitsForRawChunk = cuts => rawChunk =>
    R.uniq(Array.from(generateCombinationsOfCuts(rawChunk, cuts)))
        .map(calculateProfitForCombinationOfCuts(rawChunk));

const calculateAllProfitsForAllRawChunks = ([gemType, gemData]) => {
    console.log(`processing ${gemType}...`);
    const memoized = R.memoize(calculateAllProfitsForRawChunk(gemData.cuts));
    return gemData.rawChunks.map(rawChunk => memoized(rawChunk));
};

const largestProfit = input => {
    const gemTypes = Object.entries(input);
    const largestProfitPerGemType = gemTypes
        .map(calculateAllProfitsForAllRawChunks)
        .map(allProfitsGroupedByRawChunk => allProfitsGroupedByRawChunk.map(max))
        .map(sum);
    return sum(largestProfitPerGemType);
};

module.exports = {
    largestProfit
};
