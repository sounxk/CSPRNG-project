"use strict";
var ISAAC64 = function (seed) {
    this.count = 0;
    this.a = 0n;
    this.b = 0n;
    this.c = 0n;

    var isarray = false;
    if (typeof seed !== "undefined" && seed !== null) {
        if (seed instanceof BigUint64Array)
            isarray = true;
        else
            throw "Expected seed to be a BigUint64Array";
    }

    this.mem = new BigUint64Array(this.SIZE);
    this.rsl = new BigUint64Array(this.SIZE);

    if (isarray && seed.length > 0) {
        for (var i = 0; i < seed.length; i++) {
            this.rsl[i] = seed[i];
        }
        this.Init(true);
    } else
        this.Init(false);
};
ISAAC64.prototype.SIZEL = 8;
ISAAC64.prototype.SIZE = 1 << ISAAC64.prototype.SIZEL;
ISAAC64.prototype.HALFSIZE = ISAAC64.prototype.SIZE / 2;
ISAAC64.prototype.MASK = (ISAAC64.prototype.SIZE - 1) << 3;

ISAAC64.prototype.Isaac64 = function () {
    var i, j, x, y, a, b, c, mem, rsl, HALFSIZE, MASK, SIZEL;

    a = this.a;
    b = this.b;
    c = this.c;
    mem = this.mem;
    rsl = this.rsl;
    HALFSIZE = BigInt(this.HALFSIZE);
    MASK = BigInt(this.MASK);
    SIZEL = BigInt(this.SIZEL);

    c = (c + 1n) & 0xFFFFFFFFFFFFFFFFn;
    b = (b + c) & 0xFFFFFFFFFFFFFFFFn;
    i = j = 0;
    for (i = 0, j = HALFSIZE; i < HALFSIZE;) {
        x = mem[i];
        a = ~(a ^ (a << 21n));
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = (mem[(x & MASK) >> 3n]+ a + b);
        rsl[i++] = b = (mem[((y >> SIZEL) & MASK) >> 3n]+ x);

        x = mem[i];
        a ^= a >> 5n;
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = mem[(x & MASK) >> 3n]+ a + b;
        rsl[i++] = b = mem[((y >> SIZEL) & MASK) >> 3n]+ x;

        x = mem[i];
        a ^= a << 12n;
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = mem[(x & MASK) >> 3n]+ a + b;
        rsl[i++] = b = mem[((y >> SIZEL) & MASK) >> 3n]+ x;

        x = mem[i];
        a ^= a >> 33n;
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = mem[(x & MASK) >> 3n]+ a + b;
        rsl[i++] = b = mem[((y >> SIZEL) & MASK) >> 3n]+ x;
    }


    for (j = 0; j < HALFSIZE;) {
        x = mem[i];
        a = ~(a ^ (a << 21n));
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = mem[(x & MASK) >> 3n]+ a + b;
        rsl[i++] = b = mem[((y >> SIZEL) & MASK) >> 3n]+ x;

        x = mem[i];
        a ^= a >> 5n;
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = mem[(x & MASK) >> 3n]+ a + b;
        rsl[i++] = b = mem[((y >> SIZEL) & MASK) >> 3n]+ x;

        x = mem[i];
        a ^= a << 12n;
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = mem[(x & MASK) >> 3n]+ a + b;
        rsl[i++] = b = mem[((y >> SIZEL) & MASK) >> 3n]+ x;

        x = mem[i];
        a ^= a >> 33n;
        a += mem[j++];
        a = a & 0xFFFFFFFFFFFFFFFFn;
        mem[i] = y = mem[(x & MASK) >> 3n]+ a + b;
        rsl[i++] = b = mem[((y >> SIZEL) & MASK) >> 3n]+ x;
    }

    this.a = a;
    this.b = b;
    this.c = c;
    this.mem = mem;
    this.rsl = rsl;
};

ISAAC64.prototype.Init = function (flag) {
    if (typeof flag !== "boolean")
        throw "Expected flag to be boolean";

    var i = 0;
    var a, b, c, d, e, f, g, h;

    a = b = c = d = e = f = g = h = 0x9e3779b97f4a7c13n;

    function mix() {
        a = (a - e) & 0xFFFFFFFFFFFFFFFFn; f ^= h >> 9n; h = (h + a) & 0xFFFFFFFFFFFFFFFFn;
        b = (b - f) & 0xFFFFFFFFFFFFFFFFn; g ^= a << 9n; a = (a + b) & 0xFFFFFFFFFFFFFFFFn;
        c = (c - g) & 0xFFFFFFFFFFFFFFFFn; h ^= b >> 23n; b = (b + c) & 0xFFFFFFFFFFFFFFFFn;
        d = (d - h) & 0xFFFFFFFFFFFFFFFFn; a ^= c << 15n; c = (c + d) & 0xFFFFFFFFFFFFFFFFn;
        e = (e - a) & 0xFFFFFFFFFFFFFFFFn; b ^= d >> 14n; d = (d + e) & 0xFFFFFFFFFFFFFFFFn;
        f = (f - b) & 0xFFFFFFFFFFFFFFFFn; c ^= e << 20n; e = (e + f) & 0xFFFFFFFFFFFFFFFFn;
        g = (g - c) & 0xFFFFFFFFFFFFFFFFn; d ^= f >> 17n; f = (f + g) & 0xFFFFFFFFFFFFFFFFn;
        h = (h - d) & 0xFFFFFFFFFFFFFFFFn; e ^= g << 14n; g = (g + h) & 0xFFFFFFFFFFFFFFFFn;
    }

    for (i = 0; i < 4; ++i)
        mix();

    for (i = 0; i < this.SIZE; i += 8) {
        if (flag) {
            a += this.rsl[i]; b += this.rsl[i + 1]; c += this.rsl[i + 2]; d += this.rsl[i + 3];
            e += this.rsl[i + 4]; f += this.rsl[i + 5]; g += this.rsl[i + 6]; h += this.rsl[i + 7];

            a &= 0xFFFFFFFFFFFFFFFFn;
            b &= 0xFFFFFFFFFFFFFFFFn;
            c &= 0xFFFFFFFFFFFFFFFFn;
            d &= 0xFFFFFFFFFFFFFFFFn;
            e &= 0xFFFFFFFFFFFFFFFFn;
            f &= 0xFFFFFFFFFFFFFFFFn;
            g &= 0xFFFFFFFFFFFFFFFFn;
            h &= 0xFFFFFFFFFFFFFFFFn;
        }

        mix();

        this.mem[i] = a; this.mem[i + 1] = b; this.mem[i + 2] = c; this.mem[i + 3] = d;
        this.mem[i + 4] = e; this.mem[i + 5] = f; this.mem[i + 6] = g; this.mem[i + 7] = h;
    }

    if (flag) {
        for (i = 0; i < this.SIZE; i += 8) {
            a += this.mem[i]; b += this.mem[i + 1]; c += this.mem[i + 2]; d += this.mem[i + 3];
            e += this.mem[i + 4]; f += this.mem[i + 5]; g += this.mem[i + 6]; h += this.mem[i + 7];

            a &= 0xFFFFFFFFFFFFFFFFn;
            b &= 0xFFFFFFFFFFFFFFFFn;
            c &= 0xFFFFFFFFFFFFFFFFn;
            d &= 0xFFFFFFFFFFFFFFFFn;
            e &= 0xFFFFFFFFFFFFFFFFn;
            f &= 0xFFFFFFFFFFFFFFFFn;
            g &= 0xFFFFFFFFFFFFFFFFn;
            h &= 0xFFFFFFFFFFFFFFFFn;

            mix();

            this.mem[i] = a; this.mem[i + 1] = b; this.mem[i + 2] = c; this.mem[i + 3] = d;
            this.mem[i + 4] = e; this.mem[i + 5] = f; this.mem[i + 6] = g; this.mem[i + 7] = h;
        }
    }

    this.Isaac64();
    this.count = this.SIZE;
};

ISAAC64.prototype.Rand = function () {
    return !this.count-- ? (this.Isaac64(), this.count = this.SIZE - 1, this.rsl[this.count]) : this.rsl[this.count];
};
ISAAC64.prototype.RandSignedInt = function () {
    var num = this.Rand();
    var truncate = num & 0xFFFFFFFFFFFFFFFFn;
    var res = num & 0x7FFFFFFFFFFFFFFFn;
    return res === truncate ? res : -res;
};
//All numbers in Javascript are 64-bit floating point numbers (double). So 'Float' in this context really means _double_.
ISAAC64.RandFloatConstant = 1 / 18446744073709552000; //Loses 3 digits of precision as the number is > Number.MAX_SAFE_INTEGER
ISAAC64.prototype.RandFloat = function () {
    return Number(this.Rand()) * ISAAC64.RandFloatConstant; //[0..1),
};
ISAAC64.prototype.RandFloatExact = function () {
    var buffer = new ArrayBuffer(8);
    var temp = new BigUint64Array(buffer);
    temp[0] = this.Rand();
    return new Float64Array(buffer)[0]; //Literally as random as possible. No idea what the use case for this is, oh well.
};
ISAAC64.prototype.RandRange = function (min, max) {
    if (typeof max !== "number") //Only min is defined, treat it as [0..min)
        return (this.RandFloat() * min) | 0;

    var range = max - min;
    return (this.RandFloat() * range + min) | 0;
};
ISAAC64.prototype.RandFloatRange = function (min, max) {
    if (typeof max !== "number") //Only min is defined, treat it as max.
        return this.RandFloat() * min;

    var range = max - min;
    return this.RandFloat() * range + min;
};

ISAAC64.StringToUintArray = function (seedtext) {
    var seed = new BigUint64Array(Math.ceil(seedtext.length / 8));
    for (var i = 0, j = 0; i < seedtext.length; i++) {
        switch (i & 7) {
            case 0:
                seed[j] |= BigInt(seedtext.charCodeAt(i));
                break;
            case 1:
                seed[j] |= BigInt(seedtext.charCodeAt(i)) << 8n;
                break;
            case 2:
                seed[j] |= BigInt(seedtext.charCodeAt(i)) << 16n;
                break;
            case 3:
                seed[j] |= BigInt(seedtext.charCodeAt(i)) << 24n;
                break;
            case 4:
                seed[j] |= BigInt(seedtext.charCodeAt(i)) << 32n;
                break;
            case 5:
                seed[j] |= BigInt(seedtext.charCodeAt(i)) << 40n;
                break;
            case 6:
                seed[j] |= BigInt(seedtext.charCodeAt(i)) << 48n;
                break;
            case 7:
                seed[j] |= BigInt(seedtext.charCodeAt(i)) << 56n;
                j++;
                break;
        }
    }
    return seed;
};