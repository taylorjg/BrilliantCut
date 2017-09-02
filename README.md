## Description

Here is my attempt at a [programming exercise](http://wunder.dog/brilliant-cut) regarding cutting diamonds.
It is written in Node.js and uses a bit of [Ramda](http://ramdajs.com/).

```sh
$ npm install
$ npm test
$ npm start
```

## Running time

This code gives an answer in just over 51 seconds on my machine (MacBook Pro 2.2 GHz Intel Core i7) using Node.js v8.4.0.

## Notes

I encountered a strange problem using [R.memoize](http://ramdajs.com/docs/#memoize).
The following two lines look like they "morally" do the same thing but in the case
of the second one, memoization does not occur:

```js
    return rawChunks.map(rawChunk => memoized(rawChunk));   // (A)
```

```js
    return rawChunks.map(memoized);                         // (B)
```

I intend to follow this up separately and will update this readme if/when I figure it out.

The only thing worth mentioning now is that I am memoizing a partially applied curried lambda
(not to be confused with [lamb curry](https://www.bbcgoodfood.com/recipes/home-style-lamb-curry)).

> *UPDATE*
> 
> I figured it out. `R.memoize` is just a simple wrapper around `R.memoizeWith` which has an additional function parameter to build the cache key strings. `R.memoize` uses an internal function to convert `arguments` to a cache key string.
> 
> `Array.prototype.map` invokes its callback with three arguments - `currentValue`, `index` and `array`. Therefore, all three of these arguments contribute to the cache key string. The `index` will be different on each invokation so the cache keys will all be different e.g. `1-0-<array>`, `1-1-<array>` and `1-2-<array>`. So memoization is taking place but it never finds any cache hits!
> 
> To correct this, I changed how I create the memoized function from this:
> 
> ```js
>     const memoized = R.memoize(calculateAllProfitsForRawChunk(cuts));
> ```
> 
> to this:
> 
> ```js
>     const memoized = R.memoizeWith(
>         rawChunk => rawChunk.toString(),
>         calculateAllProfitsForRawChunk(cuts));
> ```
> 
> This explicitly controls how cache key strings are created. It only uses the `rawChunk` argument
to create the cache key string.
> 
> You could argue that this means I should have just stuck with (A) above. In general though,
someone may look at (A) and change it to (B) because they look like they should do the same
thing. However, they would be unwittingly disabling memoization.
> 
> On a final note, I further simplified the creation of the memoized function to this:
> 
> ```js
>     const memoized = R.memoizeWith(String, calculateAllProfitsForRawChunk(cuts));
> ```

## Links

* [Brilliant cut — Wunderdog](http://wunder.dog/brilliant-cut)
* [Brilliant (diamond cut) - Wikipedia](https://en.wikipedia.org/wiki/Brilliant_(diamond_cut))
