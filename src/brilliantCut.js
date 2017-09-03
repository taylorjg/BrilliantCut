const R = require('ramda');

const max = xs => xs.reduce((acc, x) => Math.max(acc, x));

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

const calculateProfitForCombinationOfCuts = rawChunk => actualCuts => {
    const cutValues = actualCuts.map(cut => cut.value);
    const cutSizes = actualCuts.map(cut => cut.size);
    const value = R.sum(cutValues);
    const sumOfCutSizes = R.sum(cutSizes);
    const waste = rawChunk - sumOfCutSizes;
    const profit = value - waste;
    return profit;
};

const calculateMaxProfitForRawChunk = availableCuts => rawChunk =>
    R.compose(
        max,
        R.map(calculateProfitForCombinationOfCuts(rawChunk)),
        R.uniq,
        Array.from,
        generateCombinationsOfCuts
    )(rawChunk, availableCuts);

const calculateMaxProfitForEachRawChunk = ({ cuts, rawChunks }) => {
    const memoized = R.memoizeWith(String, calculateMaxProfitForRawChunk(cuts));
    return rawChunks.map(memoized);
};

const largestProfit = input => {
    const gemTypes = Object.values(input);
    return R.compose(
        R.sum,
        R.map(R.sum),
        R.map(calculateMaxProfitForEachRawChunk)
    )(gemTypes);
};

module.exports = {
    largestProfit
};
