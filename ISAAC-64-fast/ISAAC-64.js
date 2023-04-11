"use strict";
var ISAAC64 = function (seed) {
    this.count = 0;
    this.a = new U64(0);
    this.b = new U64(0);
    this.c = new U64(0);

    var isarray = false;
    if (typeof seed !== "undefined" && seed !== null) {
        if (seed instanceof Array)
            isarray = true;
        else
            throw "Expected seed to be a Array";
    }

    this.mem = U64.NewArray(this.SIZE);
    this.rsl = U64.NewArray(this.SIZE);

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
    HALFSIZE = this.HALFSIZE;
    MASK = new U64(this.MASK);
    SIZEL = this.SIZEL;

    c = A64.Add(c, new U64(1));
    b = A64.Add(b, c);
    i = j = 0;
    for (i = 0, j = HALFSIZE; i < HALFSIZE;) {
        x = mem[i];
        a = A64.Not(A64.Xor(a, A64.Lsh(a, 21)));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);

        x = mem[i];
        a = A64.Xor(a, A64.Rsh(a, 5));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);

        x = mem[i];
        a = A64.Xor(a, A64.Lsh(a, 12));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);

        x = mem[i];
        a = A64.Xor(a, A64.Rsh(a, 33));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);
    }


    for (j = 0; j < HALFSIZE;) {
        x = mem[i];
        a = A64.Not(A64.Xor(a, A64.Lsh(a, 21)));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);

        x = mem[i];
        a = A64.Xor(a, A64.Rsh(a, 5));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);

        x = mem[i];
        a = A64.Xor(a, A64.Lsh(a, 12));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);

        x = mem[i];
        a = A64.Xor(a, A64.Rsh(a, 33));
        a = A64.Add(a, mem[j++]);
        mem[i] = y = A64.Add(A64.Add(mem[A64.Rsh(A64.And(x, MASK), 3).ToNumber()], a), b);
        rsl[i++] = b = A64.Add(mem[A64.Rsh(A64.And(A64.Rsh(y, SIZEL), MASK), 3).ToNumber()], x);
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

    a = b = c = d = e = f = g = h = U64.FromLoHi(0x7f4a7c13, 0x9e3779b9);

    function mix() {
        a = A64.Sub(a, e); f = A64.Xor(f, A64.Rsh(h, 9)); h = A64.Add(h, a);
        b = A64.Sub(b, f); g = A64.Xor(g, A64.Lsh(a, 9)); a = A64.Add(a, b);
        c = A64.Sub(c, g); h = A64.Xor(h, A64.Rsh(b, 23)); b = A64.Add(b, c);
        d = A64.Sub(d, h); a = A64.Xor(a, A64.Lsh(c, 15)); c = A64.Add(c, d);
        e = A64.Sub(e, a); b = A64.Xor(b, A64.Rsh(d, 14)); d = A64.Add(d, e);
        f = A64.Sub(f, b); c = A64.Xor(c, A64.Lsh(e, 20)); e = A64.Add(e, f);
        g = A64.Sub(g, c); d = A64.Xor(d, A64.Rsh(f, 17)); f = A64.Add(f, g);
        h = A64.Sub(h, d); e = A64.Xor(e, A64.Lsh(g, 14)); g = A64.Add(g, h);
    }

    for (i = 0; i < 4; ++i)
        mix();

    for (i = 0; i < this.SIZE; i += 8) {
        if (flag) {
            a = A64.Add(a, this.rsl[i]);
            b = A64.Add(b, this.rsl[i + 1]);
            c = A64.Add(c, this.rsl[i + 2]);
            d = A64.Add(d, this.rsl[i + 3]);
            e = A64.Add(e, this.rsl[i + 4]);
            f = A64.Add(f, this.rsl[i + 5]);
            g = A64.Add(g, this.rsl[i + 6]);
            h = A64.Add(h, this.rsl[i + 7]);
        }

        mix();

        this.mem[i] = a; this.mem[i + 1] = b; this.mem[i + 2] = c; this.mem[i + 3] = d;
        this.mem[i + 4] = e; this.mem[i + 5] = f; this.mem[i + 6] = g; this.mem[i + 7] = h;
    }

    if (flag) {
        for (i = 0; i < this.SIZE; i += 8) {
            a = A64.Add(a, this.mem[i]);
            b = A64.Add(b, this.mem[i + 1]);
            c = A64.Add(c, this.mem[i + 2]);
            d = A64.Add(d, this.mem[i + 3]);
            e = A64.Add(e, this.mem[i + 4]);
            f = A64.Add(f, this.mem[i + 5]);
            g = A64.Add(g, this.mem[i + 6]);
            h = A64.Add(h, this.mem[i + 7]);

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
    var r = this.Rand();
    var num = BigInt(r.lo);
    num |= BigInt(r.hi) << 32n;
    var truncate = num & 0xFFFFFFFFFFFFFFFFn;
    var res = num & 0x7FFFFFFFFFFFFFFFn;
    return res === truncate ? res : -res;
};
//All numbers in Javascript are 64-bit floating point numbers (double). So 'Float' in this context really means _double_.
ISAAC64.RandFloatConstant = 1 / 18446744073709552000; //Loses 3 digits of precision as the number is > Number.MAX_SAFE_INTEGER
ISAAC64.prototype.RandFloat = function () {
    return this.Rand().ToNumber() * ISAAC64.RandFloatConstant; //[0..1),
};
ISAAC64.prototype.RandFloatExact = function () {
    var buffer = new ArrayBuffer(8);
    var temp = new Uint32Array(buffer);
    var v1 = this.Rand();
    temp[0] = v1.lo;
    temp[1] = v1.hi;
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
    var seed = U64.NewArray(Math.ceil(seedtext.length / 8));
    for (var i = 0, j = 0; i < seedtext.length; i++) {
        switch (i & 7) {
            case 0:
                seed[j].lo |= seedtext.charCodeAt(i);
                break;
            case 1:
                seed[j].lo |= seedtext.charCodeAt(i) << 8;
                break;
            case 2:
                seed[j].lo |= seedtext.charCodeAt(i) << 16;
                break;
            case 3:
                seed[j].lo |= seedtext.charCodeAt(i) << 24;
                break;
            case 4:
                seed[j].hi |= seedtext.charCodeAt(i);
                break;
            case 5:
                seed[j].hi |= seedtext.charCodeAt(i) << 8;
                break;
            case 6:
                seed[j].hi |= seedtext.charCodeAt(i) << 16;
                break;
            case 7:
                seed[j].hi |= seedtext.charCodeAt(i) << 24;
                j++;
                break;
        }
    }
    return seed;
};