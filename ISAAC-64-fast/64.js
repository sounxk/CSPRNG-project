"use strict";
window.A64 = {
    MAX: (-1 >>> 0) + 1,
    MAX_1: 1 / ((-1 >>> 0) + 1),
    MAX_MUL: Math.sqrt(Number.MAX_SAFE_INTEGER) >>> 0,

    Add: function (v1, v2) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";
        if (!(v2 instanceof U64))
            throw "Vector 2 must be an instance of U64";

        return U64.FromLoHi(v1.lo + v2.lo, v1.hi + v2.hi);
    },
    Sub: function (v1, v2) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";
        if (!(v2 instanceof U64))
            throw "Vector 2 must be an instance of U64";

        var lo = v1.lo - v2.lo;
        var hi = v1.hi - v2.hi;
        
        if (lo < 0)
            hi--;

        return U64.FromLoHi(lo, hi);
    },
    Mul: function (v1, v2) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";
        if (!(v2 instanceof U64))
            throw "Vector 2 must be an instance of U64";

        var fml = v1.lo * v2.lo;
        var fmh = v1.hi * v2.hi;

        if (fml > Number.MAX_SAFE_INTEGER || fmh > Number.MAX_SAFE_INTEGER)
            throw "Full-precision multiplication >53bit is not yet implemented";

        return U64.FromLoHi(fml, fmh);
    },
    Rsh: function (v1, n) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";

        if (n < 32) {
            return U64.FromLoHi((v1.hi << (32 - n)) | (v1.lo >>> n), v1.hi >>> n);
        } else
            return U64.FromLoHi((v1.hi >>> (n - 32)), 0);
    },
    Lsh: function (v1, n) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";

        if (n < 32) {
            return U64.FromLoHi(v1.lo << n, (v1.hi << n) | (v1.lo >>> (32 - n)));
        } else
            return U64.FromLoHi(0, (v1.lo << (n - 32)));
    },
    Xor: function (v1, v2) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";
        if (!(v2 instanceof U64))
            throw "Vector 2 must be an instance of U64";

        return U64.FromLoHi(v1.lo ^ v2.lo, v1.hi ^ v2.hi);
    },
    Not: function (v1) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";

        return U64.FromLoHi(~v1.lo, ~v1.hi);
    },
    And: function (v1, v2) {
        if (!(v1 instanceof U64))
            throw "Vector 1 must be an instance of U64";
        if (!(v2 instanceof U64))
            throw "Vector 2 must be an instance of U64";

        return U64.FromLoHi(v1.lo & v2.lo, v1.hi & v2.hi);
    },
};

function U64(num) {
    if (num > (-1 >>> 0)) {
        this.lo = num >>> 0;
        this.hi = (num - this.lo) * A64.MAX_1 >>> 0;
    } else {
        this.lo = num >>> 0;
        this.hi = 0;
    }
}
U64.FromLoHi = function (lo, hi) {
    var ret;
    if (lo < A64.MAX && hi < A64.MAX)
        return (ret = new U64(), ret.lo = lo >>> 0, ret.hi = hi >>> 0, ret);

    ret = new U64(lo);
    ret.hi = (ret.hi + hi) >>> 0;

    ret.lo = ret.lo >>> 0;
    ret.hi = ret.hi >>> 0;

    return ret;
};
U64.prototype.ToNumber = function () {
    return this.lo + this.hi * A64.MAX;
};
U64.prototype.ToString = function () {
    return (("00000000" + this.hi.toString(16)).substr(-8)) + (("00000000" + this.lo.toString(16)).substr(-8));
};
U64.NewArray = function (n) {
    var r = new Array(n);
    for (var i = 0; i < n; i++)
        r[i] = new U64(0);

    return r;
};