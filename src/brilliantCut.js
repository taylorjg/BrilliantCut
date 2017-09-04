const R = require('ramda');

const max = xs => xs.reduce((acc, x) => Math.max(acc, x), 0);

function* generateCombinationsOfCuts(chunkSize, availableCuts, actualCuts) {
    for (let i = 0; i < availableCuts.length; i++) {
        const cut = availableCuts[i];
        const remainingChunkSize = chunkSize - cut.size;
        if (remainingChunkSize > 0) {
            const clonedActualCuts = actualCuts.slice();
            clonedActualCuts.push(cut);
            yield clonedActualCuts;
            yield* generateCombinationsOfCuts(
                remainingChunkSize,
                availableCuts,
                clonedActualCuts);
        }
    }
}

const calculateProfitForCombinationOfCuts = rawChunk => actualCuts => {
    const value = R.sum(actualCuts.map(cut => cut.value));
    const sumOfCutSizes = R.sum(actualCuts.map(cut => cut.size));
    const waste = rawChunk - sumOfCutSizes;
    const profit = value - waste;
    return profit;
};

const calculateMaxProfitForRawChunk = availableCuts => rawChunk =>
    max(Array.from(generateCombinationsOfCuts(rawChunk, availableCuts, []))
        .map(calculateProfitForCombinationOfCuts(rawChunk)));

const calculateMaxProfitsForRawChunks = ({ cuts, rawChunks }) => {
    const memoized = R.memoizeWith(String, calculateMaxProfitForRawChunk(cuts));
    return rawChunks.map(memoized);
};

const largestProfit = input => {
    const gemTypes = Object.values(input);
    const largestTotalProfitPerGemType = gemTypes
        .map(calculateMaxProfitsForRawChunks)
        .map(R.sum);
    return R.sum(largestTotalProfitPerGemType);
};

module.exports = {
    largestProfit
};
