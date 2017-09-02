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
            clonedActualCuts.sort((a, b) => a.size - b.size);
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
    console.log(`  rawChunk: ${rawChunk}; cuts: ${JSON.stringify(cutSizes)}`);
    const value = sum(cutValues);
    const sumOfCutSizes = sum(cutSizes);
    const waste = rawChunk - sumOfCutSizes;
    const profit = value - waste;
    return profit;
};

const calculateMaxProfitForRawChunk = (availableCuts, rawChunk) =>
    // Do some R.compose here ?
    max(
        R.uniq(Array.from(generateCombinationsOfCuts(rawChunk, availableCuts)))
            .map(calculateProfitForCombinationOfCuts(rawChunk)));

const calculateMaxProfitForEachRawChunk = ([gemType, { cuts, rawChunks }]) => {
    console.log(`processing ${gemType}...`);
    const groups = R.groupBy(R.identity, rawChunks);
    return Object.entries(groups).map(([, group]) => {
        const rawChunk = R.head(group);
        return calculateMaxProfitForRawChunk(cuts, rawChunk) * group.length;
    });
};

const largestProfit = input => {
    const gemTypes = Object.entries(input);
    const largestTotalProfitPerGemType = gemTypes
        .map(calculateMaxProfitForEachRawChunk)
        .map(sum);
    return sum(largestTotalProfitPerGemType);
};

module.exports = {
    largestProfit
};
