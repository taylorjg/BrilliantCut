const brilliantCut = require('./brilliantCut');
const input = require('./input.json');

const start = Date.now();
const largestProfit = brilliantCut.largestProfit(input);
const end = Date.now();

const elapsedTime = (end - start).toLocaleString();
console.log(`largestProfit: ${largestProfit}; elapsed time (ms): ${elapsedTime}`);
