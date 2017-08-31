const expect = require('chai').expect;
const input = require('./test.json');
const brilliantCuts = require('../src/brilliantCuts');

describe('BrilliantCut tests', () => {

    describe('given example', () => {

        // For a raw chunk of size 23:
        //
        // Cuts         | Value     | Waste | Profit
        // 17           | 25        | 6     | 19
        // 11, 11       | 14+14=28  | 1     | 27
        // 7, 7, 7      | 21        | 2     | 19
        // 11, 7        | 21        | 5     | 16
        // 11           | 14        | 12    | 2
        // 7            | 7         | 16    | -9

        it('combinations of cuts', () => {
            const actual = brilliantCuts.process(input);
            const expectedElements = [
                { cuts: [17], value: 25, waste: 6, profit: 19 },
                { cuts: [11, 11], value: 28, waste: 1, profit: 27 },
                { cuts: [7, 7, 7], value: 21, waste: 2, profit: 19 },
                { cuts: [11, 7], value: 21, waste: 5, profit: 16 },
                { cuts: [11], value: 14, waste: 12, profit: 2 },
                { cuts: [7], value: 7, waste: 16, profit: -9 }
            ];
            expectedElements.forEach(expectedElement => {
                expect(actual).to.deep.include(expectedElement);
            });
        });

        it('largest profit', () => {
            const actual = brilliantCuts.largestProfit(input);
            expect(actual).to.equal(27);
        });
    });
});
