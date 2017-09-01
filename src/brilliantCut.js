'use strict';

const R = require('ramda');

const max = xs => xs.reduce((acc, x) => Math.max(acc, x));
const sum = xs => xs.reduce((acc, x) => acc + x, 0);

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

    console.log(`chunkSize: ${chunkSize}`);

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
    console.log(`processing ${gemType}...`);
    const gem = input[gemType];
    return gem.rawChunks.map(rawChunk =>
        R.uniq(Array.from(calculateCombinations(rawChunk, gem.cuts)))
            .map(R.curry(calculateDetails)(rawChunk))
    );
};

const largestProfit = input => {
    const gemTypes = Object.keys(input);
    const largestProfitsPerGemType = gemTypes
        .map(R.curry(processGemType)(input))
        .map(perGemType =>
            perGemType.map(perChunk =>
                max(perChunk.map(combination => combination.profit))))
        .map(sum);
    return sum(largestProfitsPerGemType);
};

module.exports = {
    largestProfit
};
