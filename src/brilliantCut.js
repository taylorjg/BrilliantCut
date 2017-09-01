'use strict';

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
    console.log(`chunkSize: ${chunkSize}; cutSizes: ${JSON.stringify(cutSizes)}`);
    const value = sum(cutValues);
    const sumOfCutSizes = sum(cutSizes);
    const waste = chunkSize - sumOfCutSizes;
    const profit = value - waste;
    return profit;
};

const calculateAllProfitsForRawChunk = (rawChunk, cuts) =>
    R.uniq(Array.from(generateCombinationsOfCuts(rawChunk, cuts)))
        .map(calculateProfitForCombinationOfCuts(rawChunk));

const memoizedCalculateAllProfitsForRawChunk =
    R.memoize(calculateAllProfitsForRawChunk);

const calculateAllProfitsPerGemType = input => gemType => {
    console.log(`processing ${gemType}...`);
    const gem = input[gemType];
    return gem.rawChunks.map(rawChunk =>
        memoizedCalculateAllProfitsForRawChunk(rawChunk, gem.cuts));
};

const largestProfit = input => {
    const gemTypes = Object.keys(input);
    const sumsOfLargestProfitsPerGemType = gemTypes
        .map(calculateAllProfitsPerGemType(input))
        .map(allProfitsPerGemType => allProfitsPerGemType.map(max))
        .map(sum);
    return sum(sumsOfLargestProfitsPerGemType);
};

module.exports = {
    largestProfit
};
