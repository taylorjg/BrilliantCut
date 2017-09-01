## Description

Here is my attempt at a [programming exercise](http://wunder.dog/brilliant-cut) regarding cutting diamonds.
It is written in Node.js and uses a bit of [Ramda](http://ramdajs.com/):

* [R.uniq](http://ramdajs.com/docs/#uniq)
* [R.memoize](http://ramdajs.com/docs/#memoize)

```sh
$ npm install
$ npm test
$ npm start
```

## Running time

This code gives an answer in about 55 seconds on my machine (MacBook Pro 2.2 GHz Intel Core i7) using Node.js v8.4.0.

## Notes

I encountered a strange problem using [R.memoize](http://ramdajs.com/docs/#memoize).
The following two lines look like they "morally" do the same thing but in the case
of the second one, memoization does not occur:

```js
    return gemData.rawChunks.map(rawChunk => memoized(rawChunk));
```

```js
    return gemData.rawChunks.map(memoized);
```

I intend to follow this up separately and will update this readme if/when I figure it out.

The only thing worth mentioning now is that I am memoizing a partially applied curried lambda
(not to be confused with [lamb curry](https://www.bbcgoodfood.com/recipes/home-style-lamb-curry)).

## Links

* [Brilliant cut — Wunderdog](http://wunder.dog/brilliant-cut)
* [Brilliant (diamond cut) - Wikipedia](https://en.wikipedia.org/wiki/Brilliant_(diamond_cut))
