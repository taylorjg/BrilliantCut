'use strict';

const R = require('ramda');

function* calculateCombinations(chunkSize, availableCuts, currentCuts) {
    currentCuts = currentCuts || [];
    for (let i = 0; i < availableCuts.length; i++) {
        const cut = availableCuts[i];
        const remainingChunkSize = chunkSize - cut.size;
        if (remainingChunkSize > 0) {
            const clonedCurrentCuts = currentCuts.slice();
            clonedCurrentCuts.push(cut);
            yield clonedCurrentCuts;
            yield* calculateCombinations(remainingChunkSize, availableCuts, clonedCurrentCuts);
        }
    }
}

const calculateDetails = (chunkSize, cuts) => {

    const cutValues = cuts.map(cut => cut.value);
    const cutSizes = cuts.map(cut => cut.size);
    const value = sum(cutValues);
    const sumOfCutSizes = sum(cutSizes);
    const waste = chunkSize - sumOfCutSizes;
    const profit = value - waste;

    return {
        cuts: cutSizes,
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
    return R.uniq(Array.from(calculateCombinations(rawChunkSize, cuts)))
        .map(R.curry(calculateDetails)(rawChunkSize));
};

const largestProfit = input =>
    maxBy(process(input), details => details.profit).profit;

module.exports = {
    process,
    largestProfit
};
