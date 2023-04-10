# CSPRNG-project

This is a javascript implementation of the [ISAAC CSPRNG](https://burtleburtle.net/bob/rand/isaacafa.html).

It's ~261.95% faster than the [readable implementation by rubycon](https://github.com/rubycon/isaac.js) at tumbling, and ~231.88% faster at returning random numbers.

Due to the focus on speed ISAACJS has not been made with the intention of being readable.

## ISAAC-64

I have additionally implemented ISAAC-64 using BigInt. Please for the love of god don't actually use it; it's a PoC, slow, and ridiculous.

ISAAC-64-fast uses a simulated 64-bit integer object by having a hi and lo 32-bit integer. It's 3x faster than the BigInt version. It's still too slow to be useful and I don't trust my hi/lo arithmetic.

## Usage

Create an instance of ISAAC with or without a seed.
```JS
var rng = new ISAAC(); //No seed
var rng = new ISAAC(new Uint32Array(ISAAC.prototype.SIZE)); //Zero seed
var rng = new ISAAC(ISAAC.StringToUintArray("This is a test")); //Text seed
```

Tumble it an arbitrary amount of times
```JS
rng.Isaac(); //Tumble once

for(var i = 0; i < 5; i++) rng.Isaac(); //Tumble five times
```

Tada! Go get yourself some random numbers!
```JS
rng.Rand(); //Will get the next available random 32bit unsigned integer and re-tumble it if it has run out
rng.rsl[0]; //Alternatively you can access the internal result array
```

## Compatibility

Tested and working in Chrome, Firefox and Edge.
