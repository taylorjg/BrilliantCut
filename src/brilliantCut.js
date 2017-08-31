'use strict';

const R = require('ramda');

const maxBy = (xs, f) => xs.reduce((acc, x) => f(x) > f(acc) ? x : acc);

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

const largestProfit = input => {
    const xss1 = processGemType(input, 'diamond');
    const xss2 = processGemType(input, 'sapphire');
    const xss3 = processGemType(input, 'ruby');
    const v1 = xss1.map(xs => maxBy(xs, x => x.profit)).map(x => x.profit);
    const v2 = xss2.map(xs => maxBy(xs, x => x.profit)).map(x => x.profit);
    const v3 = xss3.map(xs => maxBy(xs, x => x.profit)).map(x => x.profit);
    return sum(v1) + sum(v2) + sum(v3);
};

module.exports = {
    largestProfit
};
