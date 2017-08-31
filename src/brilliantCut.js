'use strict';

const R = require('ramda');

const max = xs => xs.reduce((acc, x) => Math.max(acc, x));
// const maxBy = (xs, f) => xs.reduce((acc, x) => f(x) > f(acc) ? x : acc);
const sum = xs => xs.reduce((a, b) => a + b, 0);

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

const processGemType = (input, gemType) => {
    const gem = input[gemType];
    if (!gem) return [];
    const cuts = gem.cuts;
    return gem.rawChunks.map(rawChunk =>
        R.uniq(Array.from(calculateCombinations(rawChunk, cuts)))
            .map(R.curry(calculateDetails)(rawChunk))
    );
};

const GEM_TYPES = ['diamond', 'sapphire', 'ruby'];

const largestProfit = input => {
    const v2 = GEM_TYPES
        .map(R.curry(processGemType)(input))
        .map(allChunkCombinations =>
            allChunkCombinations.map(chunkCombinations =>
                max(chunkCombinations.map(combination => combination.profit))));
    return sum(v2.map(xs => sum(xs)));
};

module.exports = {
    largestProfit
};
