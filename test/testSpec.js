const expect = require('chai').expect;
const brilliantCut = require('../src/brilliantCut');
const input1 = require('./input1.json');
const input2 = require('./input2.json');
// const input3 = require('./input3.json');
// const input4 = require('./input4.json');

describe('BrilliantCut tests', () => {

    describe('given example', () => {
        it('largest profit', () => {
            const actual = brilliantCut.largestProfit(input1);
            expect(actual).to.equal(27);
        });
    });

    describe('given example x 2 raw chunks', () => {
        it('largest profit', () => {
            const actual = brilliantCut.largestProfit(input2);
            expect(actual).to.equal(27 * 2);
        });
    });

    // describe('given example x 2 gem types', () => {
    //     it('largest profit', () => {
    //         const actual = brilliantCut.largestProfit(input3);
    //         expect(actual).to.equal(27 * 2);
    //     });
    // });

    // describe('given example x 2 gem types x 2 raw chunks', () => {
    //     it('largest profit', () => {
    //         const actual = brilliantCut.largestProfit(input4);
    //         expect(actual).to.equal(27 * 4);
    //     });
    // });
});
