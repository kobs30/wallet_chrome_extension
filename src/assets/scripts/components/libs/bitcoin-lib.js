var Crypto = {};
var Bitcoin = {};

(function () {
  var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    t = Crypto,
    n = (t.util = {
      rotl: function (e, t) {
        return (e << t) | (e >>> (32 - t));
      },
      rotr: function (e, t) {
        return (e << (32 - t)) | (e >>> t);
      },
      endian: function (e) {
        if (e.constructor == Number)
          return (n.rotl(e, 8) & 16711935) | (n.rotl(e, 24) & 4278255360);
        for (var t = 0; t < e.length; t++) e[t] = n.endian(e[t]);
        return e;
      },
      randomBytes: function (e) {
        for (var t = []; e > 0; e--) t.push(Math.floor(Math.random() * 256));
        return t;
      },
      bytesToWords: function (e) {
        for (var t = [], n = 0, r = 0; n < e.length; n++, r += 8)
          t[r >>> 5] |= e[n] << (24 - (r % 32));
        return t;
      },
      wordsToBytes: function (e) {
        for (var t = [], n = 0; n < e.length * 32; n += 8)
          t.push((e[n >>> 5] >>> (24 - (n % 32))) & 255);
        return t;
      },
      bytesToHex: function (e) {
        for (var t = [], n = 0; n < e.length; n++)
          t.push((e[n] >>> 4).toString(16)), t.push((e[n] & 15).toString(16));
        return t.join('');
      },
      hexToBytes: function (e) {
        for (var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substr(n, 2), 16));
        return t;
      },
      bytesToBase64: function (t) {
        if (typeof btoa == 'function') return btoa(s.bytesToString(t));
        for (var n = [], r = 0; r < t.length; r += 3) {
          var i = (t[r] << 16) | (t[r + 1] << 8) | t[r + 2];
          for (var o = 0; o < 4; o++)
            r * 8 + o * 6 <= t.length * 8
              ? n.push(e.charAt((i >>> (6 * (3 - o))) & 63))
              : n.push('=');
        }
        return n.join('');
      },
      base64ToBytes: function (t) {
        if (typeof atob == 'function') return s.stringToBytes(atob(t));
        t = t.replace(/[^A-Z0-9+\/]/gi, '');
        for (var n = [], r = 0, i = 0; r < t.length; i = ++r % 4) {
          if (i == 0) continue;
          n.push(
            ((e.indexOf(t.charAt(r - 1)) & (Math.pow(2, -2 * i + 8) - 1)) << (i * 2)) |
              (e.indexOf(t.charAt(r)) >>> (6 - i * 2))
          );
        }
        return n;
      },
    });
  t.mode = {};
  var r = (t.charenc = {}),
    i = (r.UTF8 = {
      stringToBytes: function (e) {
        var e = unescape(encodeURIComponent(e));
        for (var t = [], n = 0; n < e.length; n++) t.push(e.charCodeAt(n));
        return t;
      },
      bytesToString: function (e) {
        return decodeURIComponent(escape(s.bytesToString(e)));
      },
    }),
    s = (r.Binary = {
      stringToBytes: function (e) {
        for (var t = [], n = 0; n < e.length; n++) t.push(e.charCodeAt(n));
        return t;
      },
      bytesToString: function (e) {
        for (var t = [], n = 0; n < e.length; n++) t.push(String.fromCharCode(e[n]));
        return t.join('');
      },
    });
})();
(function () {
  var e = Crypto,
    t = e.util,
    n = e.charenc,
    r = n.UTF8,
    i = n.Binary,
    s = [
      1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
      3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
      3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
      2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
      666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
      2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
      430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
      1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
      3329325298,
    ],
    o = (e.SHA256 = function (e, n) {
      var r = t.wordsToBytes(o._sha256(e));
      return n && n.asBytes ? r : n && n.asString ? i.bytesToString(r) : t.bytesToHex(r);
    });
  (o._sha256 = function (e) {
    e.constructor == String && (e = r.stringToBytes(e));
    var n = t.bytesToWords(e),
      i = e.length * 8,
      o = [
        1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635,
        1541459225,
      ],
      u = [],
      a,
      f,
      l,
      c,
      h,
      p,
      d,
      v,
      m,
      g,
      y,
      b;
    (n[i >> 5] |= 128 << (24 - (i % 32))), (n[(((i + 64) >> 9) << 4) + 15] = i);
    for (var m = 0; m < n.length; m += 16) {
      (a = o[0]),
        (f = o[1]),
        (l = o[2]),
        (c = o[3]),
        (h = o[4]),
        (p = o[5]),
        (d = o[6]),
        (v = o[7]);
      for (var g = 0; g < 64; g++) {
        if (g < 16) u[g] = n[g + m];
        else {
          var w = u[g - 15],
            E = u[g - 2],
            S = ((w << 25) | (w >>> 7)) ^ ((w << 14) | (w >>> 18)) ^ (w >>> 3),
            x = ((E << 15) | (E >>> 17)) ^ ((E << 13) | (E >>> 19)) ^ (E >>> 10);
          u[g] = S + (u[g - 7] >>> 0) + x + (u[g - 16] >>> 0);
        }
        var T = (h & p) ^ (~h & d),
          N = (a & f) ^ (a & l) ^ (f & l),
          C = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22)),
          k = ((h << 26) | (h >>> 6)) ^ ((h << 21) | (h >>> 11)) ^ ((h << 7) | (h >>> 25));
        (y = (v >>> 0) + k + T + s[g] + (u[g] >>> 0)),
          (b = C + N),
          (v = d),
          (d = p),
          (p = h),
          (h = c + y),
          (c = l),
          (l = f),
          (f = a),
          (a = y + b);
      }
      (o[0] += a),
        (o[1] += f),
        (o[2] += l),
        (o[3] += c),
        (o[4] += h),
        (o[5] += p),
        (o[6] += d),
        (o[7] += v);
    }
    return o;
  }),
    (o._blocksize = 16);
})();
(function () {
  function o(e, t, n, r) {
    return 0 <= e && e <= 15
      ? t ^ n ^ r
      : 16 <= e && e <= 31
      ? (t & n) | (~t & r)
      : 32 <= e && e <= 47
      ? (t | ~n) ^ r
      : 48 <= e && e <= 63
      ? (t & r) | (n & ~r)
      : 64 <= e && e <= 79
      ? t ^ (n | ~r)
      : 'rmd160_f: j out of range';
  }

  function u(e) {
    return 0 <= e && e <= 15
      ? 0
      : 16 <= e && e <= 31
      ? 1518500249
      : 32 <= e && e <= 47
      ? 1859775393
      : 48 <= e && e <= 63
      ? 2400959708
      : 64 <= e && e <= 79
      ? 2840853838
      : 'rmd160_K1: j out of range';
  }

  function a(e) {
    return 0 <= e && e <= 15
      ? 1352829926
      : 16 <= e && e <= 31
      ? 1548603684
      : 32 <= e && e <= 47
      ? 1836072691
      : 48 <= e && e <= 63
      ? 2053994217
      : 64 <= e && e <= 79
      ? 0
      : 'rmd160_K2: j out of range';
  }

  function p(e, t) {
    var n = (e & 65535) + (t & 65535),
      r = (e >> 16) + (t >> 16) + (n >> 16);
    return (r << 16) | (n & 65535);
  }

  function d(e, t) {
    return (e << t) | (e >>> (32 - t));
  }

  var e = Crypto,
    t = e.util,
    n = e.charenc,
    r = n.UTF8,
    i = n.Binary;
  (t.bytesToLWords = function (e) {
    var t = Array(e.length >> 2);
    for (var n = 0; n < t.length; n++) t[n] = 0;
    for (var n = 0; n < e.length * 8; n += 8) t[n >> 5] |= (e[n / 8] & 255) << n % 32;
    return t;
  }),
    (t.lWordsToBytes = function (e) {
      var t = [];
      for (var n = 0; n < e.length * 32; n += 8) t.push((e[n >> 5] >>> n % 32) & 255);
      return t;
    });
  var s = (e.RIPEMD160 = function (e, n) {
    var r = t.lWordsToBytes(s._rmd160(e));
    return n && n.asBytes ? r : n && n.asString ? i.bytesToString(r) : t.bytesToHex(r);
  });
  s._rmd160 = function (e) {
    e.constructor == String && (e = r.stringToBytes(e));
    var n = t.bytesToLWords(e),
      i = e.length * 8;
    (n[i >> 5] |= 128 << i % 32), (n[(((i + 64) >>> 9) << 4) + 14] = i);
    var s = 1732584193,
      v = 4023233417,
      m = 2562383102,
      g = 271733878,
      y = 3285377520;
    for (var b = 0; b < n.length; b += 16) {
      var w,
        E = s,
        S = v,
        x = m,
        T = g,
        N = y,
        C = s,
        k = v,
        L = m,
        A = g,
        O = y;
      for (var M = 0; M <= 79; ++M)
        (w = p(E, o(M, S, x, T))),
          (w = p(w, n[b + f[M]])),
          (w = p(w, u(M))),
          (w = p(d(w, c[M]), N)),
          (E = N),
          (N = T),
          (T = d(x, 10)),
          (x = S),
          (S = w),
          (w = p(C, o(79 - M, k, L, A))),
          (w = p(w, n[b + l[M]])),
          (w = p(w, a(M))),
          (w = p(d(w, h[M]), O)),
          (C = O),
          (O = A),
          (A = d(L, 10)),
          (L = k),
          (k = w);
      (w = p(v, p(x, A))),
        (v = p(m, p(T, O))),
        (m = p(g, p(N, C))),
        (g = p(y, p(E, k))),
        (y = p(s, p(S, L))),
        (s = w);
    }
    return [s, v, m, g, y];
  };
  var f = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5,
      2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4,
      13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
    ],
    l = [
      5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8,
      12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15,
      0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
    ],
    c = [
      11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15,
      9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14,
      15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
    ],
    h = [
      8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12,
      7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14,
      14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
    ];
})();

function Arcfour() {
  (this.i = 0), (this.j = 0), (this.S = []);
}

function ARC4init(e) {
  var t, n, r;
  for (t = 0; t < 256; ++t) this.S[t] = t;
  n = 0;
  for (t = 0; t < 256; ++t)
    (n = (n + this.S[t] + e[t % e.length]) & 255),
      (r = this.S[t]),
      (this.S[t] = this.S[n]),
      (this.S[n] = r);
  (this.i = 0), (this.j = 0);
}

function ARC4next() {
  var e;
  return (
    (this.i = (this.i + 1) & 255),
    (this.j = (this.j + this.S[this.i]) & 255),
    (e = this.S[this.i]),
    (this.S[this.i] = this.S[this.j]),
    (this.S[this.j] = e),
    this.S[(e + this.S[this.i]) & 255]
  );
}

function prng_newstate() {
  return new Arcfour();
}

(Arcfour.prototype.init = ARC4init), (Arcfour.prototype.next = ARC4next);
var rng_psize = 256;

function rng_seed_int(e) {
  (rng_pool[rng_pptr++] ^= e & 255),
    (rng_pool[rng_pptr++] ^= (e >> 8) & 255),
    (rng_pool[rng_pptr++] ^= (e >> 16) & 255),
    (rng_pool[rng_pptr++] ^= (e >> 24) & 255),
    rng_pptr >= rng_psize && (rng_pptr -= rng_psize);
}

function rng_seed_time() {
  rng_seed_int(new Date().getTime());
}

function rng_get_byte() {
  if (rng_state == null) {
    rng_seed_time(), (rng_state = prng_newstate()), rng_state.init(rng_pool);
    for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
  }
  return rng_state.next();
}

function rng_get_bytes(e) {
  var t;
  for (t = 0; t < e.length; ++t) e[t] = rng_get_byte();
}

function SecureRandom() {}

var rng_state, rng_pool, rng_pptr;
if (rng_pool == null) {
  (rng_pool = []), (rng_pptr = 0);
  var t;
  if (false) {
    var z = Crypto.random(32);
    for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  }
  while (rng_pptr < rng_psize)
    (t = Math.floor(65536 * Math.random())),
      (rng_pool[rng_pptr++] = t >>> 8),
      (rng_pool[rng_pptr++] = t & 255);
  (rng_pptr = 0), rng_seed_time();
}
SecureRandom.prototype.nextBytes = rng_get_bytes;

function BigInteger(e, t, n) {
  e != null &&
    ('number' == typeof e
      ? this.fromNumber(e, t, n)
      : t == null && 'string' != typeof e
      ? this.fromString(e, 256)
      : this.fromString(e, t));
}

function nbi() {
  return new BigInteger(null);
}

function am1(e, t, n, r, i, s) {
  while (--s >= 0) {
    var o = t * this[e++] + n[r] + i;
    (i = Math.floor(o / 67108864)), (n[r++] = o & 67108863);
  }
  return i;
}

function am2(e, t, n, r, i, s) {
  var o = t & 32767,
    u = t >> 15;
  while (--s >= 0) {
    var a = this[e] & 32767,
      f = this[e++] >> 15,
      l = u * a + f * o;
    (a = o * a + ((l & 32767) << 15) + n[r] + (i & 1073741823)),
      (i = (a >>> 30) + (l >>> 15) + u * f + (i >>> 30)),
      (n[r++] = a & 1073741823);
  }
  return i;
}

function am3(e, t, n, r, i, s) {
  var o = t & 16383,
    u = t >> 14;
  while (--s >= 0) {
    var a = this[e] & 16383,
      f = this[e++] >> 14,
      l = u * a + f * o;
    (a = o * a + ((l & 16383) << 14) + n[r] + i),
      (i = (a >> 28) + (l >> 14) + u * f),
      (n[r++] = a & 268435455);
  }
  return i;
}

function int2char(e) {
  return BI_RM.charAt(e);
}

function intAt(e, t) {
  var n = BI_RC[e.charCodeAt(t)];
  return n == null ? -1 : n;
}

function bnpCopyTo(e) {
  for (var t = this.t - 1; t >= 0; --t) e[t] = this[t];
  (e.t = this.t), (e.s = this.s);
}

function bnpFromInt(e) {
  (this.t = 1),
    (this.s = e < 0 ? -1 : 0),
    e > 0 ? (this[0] = e) : e < -1 ? (this[0] = e + DV) : (this.t = 0);
}

function nbv(e) {
  var t = nbi();
  return t.fromInt(e), t;
}

function bnpFromString(e, t) {
  var n;
  if (t == 16) n = 4;
  else if (t == 8) n = 3;
  else if (t == 256) n = 8;
  else if (t == 2) n = 1;
  else if (t == 32) n = 5;
  else {
    if (t != 4) {
      this.fromRadix(e, t);
      return;
    }
    n = 2;
  }
  (this.t = 0), (this.s = 0);
  var r = e.length,
    i = !1,
    s = 0;
  while (--r >= 0) {
    var o = n == 8 ? e[r] & 255 : intAt(e, r);
    if (o < 0) {
      e.charAt(r) == '-' && (i = !0);
      continue;
    }
    (i = !1),
      s == 0
        ? (this[this.t++] = o)
        : s + n > this.DB
        ? ((this[this.t - 1] |= (o & ((1 << (this.DB - s)) - 1)) << s),
          (this[this.t++] = o >> (this.DB - s)))
        : (this[this.t - 1] |= o << s),
      (s += n),
      s >= this.DB && (s -= this.DB);
  }
  n == 8 &&
    (e[0] & 128) != 0 &&
    ((this.s = -1), s > 0 && (this[this.t - 1] |= ((1 << (this.DB - s)) - 1) << s)),
    this.clamp(),
    i && BigInteger.ZERO.subTo(this, this);
}

function bnpClamp() {
  var e = this.s & this.DM;
  while (this.t > 0 && this[this.t - 1] == e) --this.t;
}

function bnToString(e) {
  if (this.s < 0) return '-' + this.negate().toString(e);
  var t;
  if (e == 16) t = 4;
  else if (e == 8) t = 3;
  else if (e == 2) t = 1;
  else if (e == 32) t = 5;
  else {
    if (e != 4) return this.toRadix(e);
    t = 2;
  }
  var n = (1 << t) - 1,
    r,
    i = !1,
    s = '',
    o = this.t,
    u = this.DB - ((o * this.DB) % t);
  if (o-- > 0) {
    u < this.DB && (r = this[o] >> u) > 0 && ((i = !0), (s = int2char(r)));
    while (o >= 0)
      u < t
        ? ((r = (this[o] & ((1 << u) - 1)) << (t - u)), (r |= this[--o] >> (u += this.DB - t)))
        : ((r = (this[o] >> (u -= t)) & n), u <= 0 && ((u += this.DB), --o)),
        r > 0 && (i = !0),
        i && (s += int2char(r));
  }
  return i ? s : '0';
}

function bnNegate() {
  var e = nbi();
  return BigInteger.ZERO.subTo(this, e), e;
}

function bnAbs() {
  return this.s < 0 ? this.negate() : this;
}

function bnCompareTo(e) {
  var t = this.s - e.s;
  if (t != 0) return t;
  var n = this.t;
  t = n - e.t;
  if (t != 0) return this.s < 0 ? -t : t;
  while (--n >= 0) if ((t = this[n] - e[n]) != 0) return t;
  return 0;
}

function nbits(e) {
  var t = 1,
    n;
  return (
    (n = e >>> 16) != 0 && ((e = n), (t += 16)),
    (n = e >> 8) != 0 && ((e = n), (t += 8)),
    (n = e >> 4) != 0 && ((e = n), (t += 4)),
    (n = e >> 2) != 0 && ((e = n), (t += 2)),
    (n = e >> 1) != 0 && ((e = n), (t += 1)),
    t
  );
}

function bnBitLength() {
  return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
}

function bnpDLShiftTo(e, t) {
  var n;
  for (n = this.t - 1; n >= 0; --n) t[n + e] = this[n];
  for (n = e - 1; n >= 0; --n) t[n] = 0;
  (t.t = this.t + e), (t.s = this.s);
}

function bnpDRShiftTo(e, t) {
  for (var n = e; n < this.t; ++n) t[n - e] = this[n];
  (t.t = Math.max(this.t - e, 0)), (t.s = this.s);
}

function bnpLShiftTo(e, t) {
  var n = e % this.DB,
    r = this.DB - n,
    i = (1 << r) - 1,
    s = Math.floor(e / this.DB),
    o = (this.s << n) & this.DM,
    u;
  for (u = this.t - 1; u >= 0; --u) (t[u + s + 1] = (this[u] >> r) | o), (o = (this[u] & i) << n);
  for (u = s - 1; u >= 0; --u) t[u] = 0;
  (t[s] = o), (t.t = this.t + s + 1), (t.s = this.s), t.clamp();
}

function bnpRShiftTo(e, t) {
  t.s = this.s;
  var n = Math.floor(e / this.DB);
  if (n >= this.t) {
    t.t = 0;
    return;
  }
  var r = e % this.DB,
    i = this.DB - r,
    s = (1 << r) - 1;
  t[0] = this[n] >> r;
  for (var o = n + 1; o < this.t; ++o)
    (t[o - n - 1] |= (this[o] & s) << i), (t[o - n] = this[o] >> r);
  r > 0 && (t[this.t - n - 1] |= (this.s & s) << i), (t.t = this.t - n), t.clamp();
}

function bnpSubTo(e, t) {
  var n = 0,
    r = 0,
    i = Math.min(e.t, this.t);
  while (n < i) (r += this[n] - e[n]), (t[n++] = r & this.DM), (r >>= this.DB);
  if (e.t < this.t) {
    r -= e.s;
    while (n < this.t) (r += this[n]), (t[n++] = r & this.DM), (r >>= this.DB);
    r += this.s;
  } else {
    r += this.s;
    while (n < e.t) (r -= e[n]), (t[n++] = r & this.DM), (r >>= this.DB);
    r -= e.s;
  }
  (t.s = r < 0 ? -1 : 0),
    r < -1 ? (t[n++] = this.DV + r) : r > 0 && (t[n++] = r),
    (t.t = n),
    t.clamp();
}

function bnpMultiplyTo(e, t) {
  var n = this.abs(),
    r = e.abs(),
    i = n.t;
  t.t = i + r.t;
  while (--i >= 0) t[i] = 0;
  for (i = 0; i < r.t; ++i) t[i + n.t] = n.am(0, r[i], t, i, 0, n.t);
  (t.s = 0), t.clamp(), this.s != e.s && BigInteger.ZERO.subTo(t, t);
}

function bnpSquareTo(e) {
  var t = this.abs(),
    n = (e.t = 2 * t.t);
  while (--n >= 0) e[n] = 0;
  for (n = 0; n < t.t - 1; ++n) {
    var r = t.am(n, t[n], e, 2 * n, 0, 1);
    (e[n + t.t] += t.am(n + 1, 2 * t[n], e, 2 * n + 1, r, t.t - n - 1)) >= t.DV &&
      ((e[n + t.t] -= t.DV), (e[n + t.t + 1] = 1));
  }
  e.t > 0 && (e[e.t - 1] += t.am(n, t[n], e, 2 * n, 0, 1)), (e.s = 0), e.clamp();
}

function bnpDivRemTo(e, t, n) {
  var r = e.abs();
  if (r.t <= 0) return;
  var i = this.abs();
  if (i.t < r.t) {
    t != null && t.fromInt(0), n != null && this.copyTo(n);
    return;
  }
  n == null && (n = nbi());
  var s = nbi(),
    o = this.s,
    u = e.s,
    a = this.DB - nbits(r[r.t - 1]);
  a > 0 ? (r.lShiftTo(a, s), i.lShiftTo(a, n)) : (r.copyTo(s), i.copyTo(n));
  var f = s.t,
    l = s[f - 1];
  if (l == 0) return;
  var c = l * (1 << this.F1) + (f > 1 ? s[f - 2] >> this.F2 : 0),
    h = this.FV / c,
    p = (1 << this.F1) / c,
    d = 1 << this.F2,
    v = n.t,
    m = v - f,
    g = t == null ? nbi() : t;
  s.dlShiftTo(m, g),
    n.compareTo(g) >= 0 && ((n[n.t++] = 1), n.subTo(g, n)),
    BigInteger.ONE.dlShiftTo(f, g),
    g.subTo(s, s);
  while (s.t < f) s[s.t++] = 0;
  while (--m >= 0) {
    var y = n[--v] == l ? this.DM : Math.floor(n[v] * h + (n[v - 1] + d) * p);
    if ((n[v] += s.am(0, y, n, m, 0, f)) < y) {
      s.dlShiftTo(m, g), n.subTo(g, n);
      while (n[v] < --y) n.subTo(g, n);
    }
  }
  t != null && (n.drShiftTo(f, t), o != u && BigInteger.ZERO.subTo(t, t)),
    (n.t = f),
    n.clamp(),
    a > 0 && n.rShiftTo(a, n),
    o < 0 && BigInteger.ZERO.subTo(n, n);
}

function bnMod(e) {
  var t = nbi();
  return (
    this.abs().divRemTo(e, null, t),
    this.s < 0 && t.compareTo(BigInteger.ZERO) > 0 && e.subTo(t, t),
    t
  );
}

function Classic(e) {
  this.m = e;
}

function cConvert(e) {
  return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e;
}

function cRevert(e) {
  return e;
}

function cReduce(e) {
  e.divRemTo(this.m, null, e);
}

function cMulTo(e, t, n) {
  e.multiplyTo(t, n), this.reduce(n);
}

function cSqrTo(e, t) {
  e.squareTo(t), this.reduce(t);
}

function bnpInvDigit() {
  if (this.t < 1) return 0;
  var e = this[0];
  if ((e & 1) == 0) return 0;
  var t = e & 3;
  return (
    (t = (t * (2 - (e & 15) * t)) & 15),
    (t = (t * (2 - (e & 255) * t)) & 255),
    (t = (t * (2 - (((e & 65535) * t) & 65535))) & 65535),
    (t = (t * (2 - ((e * t) % this.DV))) % this.DV),
    t > 0 ? this.DV - t : -t
  );
}

function Montgomery(e) {
  (this.m = e),
    (this.mp = e.invDigit()),
    (this.mpl = this.mp & 32767),
    (this.mph = this.mp >> 15),
    (this.um = (1 << (e.DB - 15)) - 1),
    (this.mt2 = 2 * e.t);
}

function montConvert(e) {
  var t = nbi();
  return (
    e.abs().dlShiftTo(this.m.t, t),
    t.divRemTo(this.m, null, t),
    e.s < 0 && t.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(t, t),
    t
  );
}

function montRevert(e) {
  var t = nbi();
  return e.copyTo(t), this.reduce(t), t;
}

function montReduce(e) {
  while (e.t <= this.mt2) e[e.t++] = 0;
  for (var t = 0; t < this.m.t; ++t) {
    var n = e[t] & 32767,
      r = (n * this.mpl + (((n * this.mph + (e[t] >> 15) * this.mpl) & this.um) << 15)) & e.DM;
    (n = t + this.m.t), (e[n] += this.m.am(0, r, e, t, 0, this.m.t));
    while (e[n] >= e.DV) (e[n] -= e.DV), e[++n]++;
  }
  e.clamp(), e.drShiftTo(this.m.t, e), e.compareTo(this.m) >= 0 && e.subTo(this.m, e);
}

function montSqrTo(e, t) {
  e.squareTo(t), this.reduce(t);
}

function montMulTo(e, t, n) {
  e.multiplyTo(t, n), this.reduce(n);
}

function bnpIsEven() {
  return (this.t > 0 ? this[0] & 1 : this.s) == 0;
}

function bnpExp(e, t) {
  if (e > 4294967295 || e < 1) return BigInteger.ONE;
  var n = nbi(),
    r = nbi(),
    i = t.convert(this),
    s = nbits(e) - 1;
  i.copyTo(n);
  while (--s >= 0) {
    t.sqrTo(n, r);
    if ((e & (1 << s)) > 0) t.mulTo(r, i, n);
    else {
      var o = n;
      (n = r), (r = o);
    }
  }
  return t.revert(n);
}

function bnModPowInt(e, t) {
  var n;
  return e < 256 || t.isEven() ? (n = new Classic(t)) : (n = new Montgomery(t)), this.exp(e, n);
}

var dbits,
  canary = 0xdeadbeefcafe,
  j_lm = (canary & 16777215) == 15715070;
j_lm && navigator.appName == 'Microsoft Internet Explorer'
  ? ((BigInteger.prototype.am = am2), (dbits = 30))
  : j_lm && navigator.appName != 'Netscape'
  ? ((BigInteger.prototype.am = am1), (dbits = 26))
  : ((BigInteger.prototype.am = am3), (dbits = 28)),
  (BigInteger.prototype.DB = dbits),
  (BigInteger.prototype.DM = (1 << dbits) - 1),
  (BigInteger.prototype.DV = 1 << dbits);
var BI_FP = 52;
(BigInteger.prototype.FV = Math.pow(2, BI_FP)),
  (BigInteger.prototype.F1 = BI_FP - dbits),
  (BigInteger.prototype.F2 = 2 * dbits - BI_FP);
var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz',
  BI_RC = [],
  rr,
  vv;
rr = '0'.charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = 'a'.charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = 'A'.charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
(Classic.prototype.convert = cConvert),
  (Classic.prototype.revert = cRevert),
  (Classic.prototype.reduce = cReduce),
  (Classic.prototype.mulTo = cMulTo),
  (Classic.prototype.sqrTo = cSqrTo),
  (Montgomery.prototype.convert = montConvert),
  (Montgomery.prototype.revert = montRevert),
  (Montgomery.prototype.reduce = montReduce),
  (Montgomery.prototype.mulTo = montMulTo),
  (Montgomery.prototype.sqrTo = montSqrTo),
  (BigInteger.prototype.copyTo = bnpCopyTo),
  (BigInteger.prototype.fromInt = bnpFromInt),
  (BigInteger.prototype.fromString = bnpFromString),
  (BigInteger.prototype.clamp = bnpClamp),
  (BigInteger.prototype.dlShiftTo = bnpDLShiftTo),
  (BigInteger.prototype.drShiftTo = bnpDRShiftTo),
  (BigInteger.prototype.lShiftTo = bnpLShiftTo),
  (BigInteger.prototype.rShiftTo = bnpRShiftTo),
  (BigInteger.prototype.subTo = bnpSubTo),
  (BigInteger.prototype.multiplyTo = bnpMultiplyTo),
  (BigInteger.prototype.squareTo = bnpSquareTo),
  (BigInteger.prototype.divRemTo = bnpDivRemTo),
  (BigInteger.prototype.invDigit = bnpInvDigit),
  (BigInteger.prototype.isEven = bnpIsEven),
  (BigInteger.prototype.exp = bnpExp),
  (BigInteger.prototype.toString = bnToString),
  (BigInteger.prototype.negate = bnNegate),
  (BigInteger.prototype.abs = bnAbs),
  (BigInteger.prototype.compareTo = bnCompareTo),
  (BigInteger.prototype.bitLength = bnBitLength),
  (BigInteger.prototype.mod = bnMod),
  (BigInteger.prototype.modPowInt = bnModPowInt),
  (BigInteger.ZERO = nbv(0)),
  (BigInteger.ONE = nbv(1));

function bnClone() {
  var e = nbi();
  return this.copyTo(e), e;
}

function bnIntValue() {
  if (this.s < 0) {
    if (this.t == 1) return this[0] - this.DV;
    if (this.t == 0) return -1;
  } else {
    if (this.t == 1) return this[0];
    if (this.t == 0) return 0;
  }
  return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
}

function bnByteValue() {
  return this.t == 0 ? this.s : (this[0] << 24) >> 24;
}

function bnShortValue() {
  return this.t == 0 ? this.s : (this[0] << 16) >> 16;
}

function bnpChunkSize(e) {
  return Math.floor((Math.LN2 * this.DB) / Math.log(e));
}

function bnSigNum() {
  return this.s < 0 ? -1 : this.t <= 0 || (this.t == 1 && this[0] <= 0) ? 0 : 1;
}

function bnpToRadix(e) {
  e == null && (e = 10);
  if (this.signum() == 0 || e < 2 || e > 36) return '0';
  var t = this.chunkSize(e),
    n = Math.pow(e, t),
    r = nbv(n),
    i = nbi(),
    s = nbi(),
    o = '';
  this.divRemTo(r, i, s);
  while (i.signum() > 0) (o = (n + s.intValue()).toString(e).substr(1) + o), i.divRemTo(r, i, s);
  return s.intValue().toString(e) + o;
}

function bnpFromRadix(e, t) {
  this.fromInt(0), t == null && (t = 10);
  var n = this.chunkSize(t),
    r = Math.pow(t, n),
    i = !1,
    s = 0,
    o = 0;
  for (var u = 0; u < e.length; ++u) {
    var a = intAt(e, u);
    if (a < 0) {
      e.charAt(u) == '-' && this.signum() == 0 && (i = !0);
      continue;
    }
    (o = t * o + a), ++s >= n && (this.dMultiply(r), this.dAddOffset(o, 0), (s = 0), (o = 0));
  }
  s > 0 && (this.dMultiply(Math.pow(t, s)), this.dAddOffset(o, 0)),
    i && BigInteger.ZERO.subTo(this, this);
}

function bnpFromNumber(e, t, n) {
  if ('number' == typeof t)
    if (e < 2) this.fromInt(1);
    else {
      this.fromNumber(e, n),
        this.testBit(e - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(e - 1), op_or, this),
        this.isEven() && this.dAddOffset(1, 0);
      while (!this.isProbablePrime(t))
        this.dAddOffset(2, 0),
          this.bitLength() > e && this.subTo(BigInteger.ONE.shiftLeft(e - 1), this);
    }
  else {
    var r = [],
      i = e & 7;
    (r.length = (e >> 3) + 1),
      t.nextBytes(r),
      i > 0 ? (r[0] &= (1 << i) - 1) : (r[0] = 0),
      this.fromString(r, 256);
  }
}

function bnToByteArray() {
  var e = this.t,
    t = [];
  t[0] = this.s;
  var n = this.DB - ((e * this.DB) % 8),
    r,
    i = 0;
  if (e-- > 0) {
    n < this.DB &&
      (r = this[e] >> n) != (this.s & this.DM) >> n &&
      (t[i++] = r | (this.s << (this.DB - n)));
    while (e >= 0) {
      n < 8
        ? ((r = (this[e] & ((1 << n) - 1)) << (8 - n)), (r |= this[--e] >> (n += this.DB - 8)))
        : ((r = (this[e] >> (n -= 8)) & 255), n <= 0 && ((n += this.DB), --e)),
        (r & 128) != 0 && (r |= -256),
        i == 0 && (this.s & 128) != (r & 128) && ++i;
      if (i > 0 || r != this.s) t[i++] = r;
    }
  }
  return t;
}

function bnEquals(e) {
  return this.compareTo(e) == 0;
}

function bnMin(e) {
  return this.compareTo(e) < 0 ? this : e;
}

function bnMax(e) {
  return this.compareTo(e) > 0 ? this : e;
}

function bnpBitwiseTo(e, t, n) {
  var r,
    i,
    s = Math.min(e.t, this.t);
  for (r = 0; r < s; ++r) n[r] = t(this[r], e[r]);
  if (e.t < this.t) {
    i = e.s & this.DM;
    for (r = s; r < this.t; ++r) n[r] = t(this[r], i);
    n.t = this.t;
  } else {
    i = this.s & this.DM;
    for (r = s; r < e.t; ++r) n[r] = t(i, e[r]);
    n.t = e.t;
  }
  (n.s = t(this.s, e.s)), n.clamp();
}

function op_and(e, t) {
  return e & t;
}

function bnAnd(e) {
  var t = nbi();
  return this.bitwiseTo(e, op_and, t), t;
}

function op_or(e, t) {
  return e | t;
}

function bnOr(e) {
  var t = nbi();
  return this.bitwiseTo(e, op_or, t), t;
}

function op_xor(e, t) {
  return e ^ t;
}

function bnXor(e) {
  var t = nbi();
  return this.bitwiseTo(e, op_xor, t), t;
}

function op_andnot(e, t) {
  return e & ~t;
}

function bnAndNot(e) {
  var t = nbi();
  return this.bitwiseTo(e, op_andnot, t), t;
}

function bnNot() {
  var e = nbi();
  for (var t = 0; t < this.t; ++t) e[t] = this.DM & ~this[t];
  return (e.t = this.t), (e.s = ~this.s), e;
}

function bnShiftLeft(e) {
  var t = nbi();
  return e < 0 ? this.rShiftTo(-e, t) : this.lShiftTo(e, t), t;
}

function bnShiftRight(e) {
  var t = nbi();
  return e < 0 ? this.lShiftTo(-e, t) : this.rShiftTo(e, t), t;
}

function lbit(e) {
  if (e == 0) return -1;
  var t = 0;
  return (
    (e & 65535) == 0 && ((e >>= 16), (t += 16)),
    (e & 255) == 0 && ((e >>= 8), (t += 8)),
    (e & 15) == 0 && ((e >>= 4), (t += 4)),
    (e & 3) == 0 && ((e >>= 2), (t += 2)),
    (e & 1) == 0 && ++t,
    t
  );
}

function bnGetLowestSetBit() {
  for (var e = 0; e < this.t; ++e) if (this[e] != 0) return e * this.DB + lbit(this[e]);
  return this.s < 0 ? this.t * this.DB : -1;
}

function cbit(e) {
  var t = 0;
  while (e != 0) (e &= e - 1), ++t;
  return t;
}

function bnBitCount() {
  var e = 0,
    t = this.s & this.DM;
  for (var n = 0; n < this.t; ++n) e += cbit(this[n] ^ t);
  return e;
}

function bnTestBit(e) {
  var t = Math.floor(e / this.DB);
  return t >= this.t ? this.s != 0 : (this[t] & (1 << e % this.DB)) != 0;
}

function bnpChangeBit(e, t) {
  var n = BigInteger.ONE.shiftLeft(e);
  return this.bitwiseTo(n, t, n), n;
}

function bnSetBit(e) {
  return this.changeBit(e, op_or);
}

function bnClearBit(e) {
  return this.changeBit(e, op_andnot);
}

function bnFlipBit(e) {
  return this.changeBit(e, op_xor);
}

function bnpAddTo(e, t) {
  var n = 0,
    r = 0,
    i = Math.min(e.t, this.t);
  while (n < i) (r += this[n] + e[n]), (t[n++] = r & this.DM), (r >>= this.DB);
  if (e.t < this.t) {
    r += e.s;
    while (n < this.t) (r += this[n]), (t[n++] = r & this.DM), (r >>= this.DB);
    r += this.s;
  } else {
    r += this.s;
    while (n < e.t) (r += e[n]), (t[n++] = r & this.DM), (r >>= this.DB);
    r += e.s;
  }
  (t.s = r < 0 ? -1 : 0),
    r > 0 ? (t[n++] = r) : r < -1 && (t[n++] = this.DV + r),
    (t.t = n),
    t.clamp();
}

function bnAdd(e) {
  var t = nbi();
  return this.addTo(e, t), t;
}

function bnSubtract(e) {
  var t = nbi();
  return this.subTo(e, t), t;
}

function bnMultiply(e) {
  var t = nbi();
  return this.multiplyTo(e, t), t;
}

function bnSquare() {
  var e = nbi();
  return this.squareTo(e), e;
}

function bnDivide(e) {
  var t = nbi();
  return this.divRemTo(e, t, null), t;
}

function bnRemainder(e) {
  var t = nbi();
  return this.divRemTo(e, null, t), t;
}

function bnDivideAndRemainder(e) {
  var t = nbi(),
    n = nbi();
  return this.divRemTo(e, t, n), [t, n];
}

function bnpDMultiply(e) {
  (this[this.t] = this.am(0, e - 1, this, 0, 0, this.t)), ++this.t, this.clamp();
}

function bnpDAddOffset(e, t) {
  if (e == 0) return;
  while (this.t <= t) this[this.t++] = 0;
  this[t] += e;
  while (this[t] >= this.DV) (this[t] -= this.DV), ++t >= this.t && (this[this.t++] = 0), ++this[t];
}

function NullExp() {}

function nNop(e) {
  return e;
}

function nMulTo(e, t, n) {
  e.multiplyTo(t, n);
}

function nSqrTo(e, t) {
  e.squareTo(t);
}

function bnPow(e) {
  return this.exp(e, new NullExp());
}

function bnpMultiplyLowerTo(e, t, n) {
  var r = Math.min(this.t + e.t, t);
  (n.s = 0), (n.t = r);
  while (r > 0) n[--r] = 0;
  var i;
  for (i = n.t - this.t; r < i; ++r) n[r + this.t] = this.am(0, e[r], n, r, 0, this.t);
  for (i = Math.min(e.t, t); r < i; ++r) this.am(0, e[r], n, r, 0, t - r);
  n.clamp();
}

function bnpMultiplyUpperTo(e, t, n) {
  --t;
  var r = (n.t = this.t + e.t - t);
  n.s = 0;
  while (--r >= 0) n[r] = 0;
  for (r = Math.max(t - this.t, 0); r < e.t; ++r)
    n[this.t + r - t] = this.am(t - r, e[r], n, 0, 0, this.t + r - t);
  n.clamp(), n.drShiftTo(1, n);
}

function Barrett(e) {
  (this.r2 = nbi()),
    (this.q3 = nbi()),
    BigInteger.ONE.dlShiftTo(2 * e.t, this.r2),
    (this.mu = this.r2.divide(e)),
    (this.m = e);
}

function barrettConvert(e) {
  if (e.s < 0 || e.t > 2 * this.m.t) return e.mod(this.m);
  if (e.compareTo(this.m) < 0) return e;
  var t = nbi();
  return e.copyTo(t), this.reduce(t), t;
}

function barrettRevert(e) {
  return e;
}

function barrettReduce(e) {
  e.drShiftTo(this.m.t - 1, this.r2),
    e.t > this.m.t + 1 && ((e.t = this.m.t + 1), e.clamp()),
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
  while (e.compareTo(this.r2) < 0) e.dAddOffset(1, this.m.t + 1);
  e.subTo(this.r2, e);
  while (e.compareTo(this.m) >= 0) e.subTo(this.m, e);
}

function barrettSqrTo(e, t) {
  e.squareTo(t), this.reduce(t);
}

function barrettMulTo(e, t, n) {
  e.multiplyTo(t, n), this.reduce(n);
}

function bnModPow(e, t) {
  var n = e.bitLength(),
    r,
    i = nbv(1),
    s;
  if (n <= 0) return i;
  n < 18 ? (r = 1) : n < 48 ? (r = 3) : n < 144 ? (r = 4) : n < 768 ? (r = 5) : (r = 6),
    n < 8 ? (s = new Classic(t)) : t.isEven() ? (s = new Barrett(t)) : (s = new Montgomery(t));
  var o = [],
    u = 3,
    a = r - 1,
    f = (1 << r) - 1;
  o[1] = s.convert(this);
  if (r > 1) {
    var l = nbi();
    s.sqrTo(o[1], l);
    while (u <= f) (o[u] = nbi()), s.mulTo(l, o[u - 2], o[u]), (u += 2);
  }
  var c = e.t - 1,
    h,
    p = !0,
    d = nbi(),
    v;
  n = nbits(e[c]) - 1;
  while (c >= 0) {
    n >= a
      ? (h = (e[c] >> (n - a)) & f)
      : ((h = (e[c] & ((1 << (n + 1)) - 1)) << (a - n)),
        c > 0 && (h |= e[c - 1] >> (this.DB + n - a))),
      (u = r);
    while ((h & 1) == 0) (h >>= 1), --u;
    (n -= u) < 0 && ((n += this.DB), --c);
    if (p) o[h].copyTo(i), (p = !1);
    else {
      while (u > 1) s.sqrTo(i, d), s.sqrTo(d, i), (u -= 2);
      u > 0 ? s.sqrTo(i, d) : ((v = i), (i = d), (d = v)), s.mulTo(d, o[h], i);
    }
    while (c >= 0 && (e[c] & (1 << n)) == 0)
      s.sqrTo(i, d), (v = i), (i = d), (d = v), --n < 0 && ((n = this.DB - 1), --c);
  }
  return s.revert(i);
}

function bnGCD(e) {
  var t = this.s < 0 ? this.negate() : this.clone(),
    n = e.s < 0 ? e.negate() : e.clone();
  if (t.compareTo(n) < 0) {
    var r = t;
    (t = n), (n = r);
  }
  var i = t.getLowestSetBit(),
    s = n.getLowestSetBit();
  if (s < 0) return t;
  i < s && (s = i), s > 0 && (t.rShiftTo(s, t), n.rShiftTo(s, n));
  while (t.signum() > 0)
    (i = t.getLowestSetBit()) > 0 && t.rShiftTo(i, t),
      (i = n.getLowestSetBit()) > 0 && n.rShiftTo(i, n),
      t.compareTo(n) >= 0 ? (t.subTo(n, t), t.rShiftTo(1, t)) : (n.subTo(t, n), n.rShiftTo(1, n));
  return s > 0 && n.lShiftTo(s, n), n;
}

function bnpModInt(e) {
  if (e <= 0) return 0;
  var t = this.DV % e,
    n = this.s < 0 ? e - 1 : 0;
  if (this.t > 0)
    if (t == 0) n = this[0] % e;
    else for (var r = this.t - 1; r >= 0; --r) n = (t * n + this[r]) % e;
  return n;
}

function bnModInverse(e) {
  var t = e.isEven();
  if ((this.isEven() && t) || e.signum() == 0) return BigInteger.ZERO;
  var n = e.clone(),
    r = this.clone(),
    i = nbv(1),
    s = nbv(0),
    o = nbv(0),
    u = nbv(1);
  while (n.signum() != 0) {
    while (n.isEven()) {
      n.rShiftTo(1, n);
      if (t) {
        if (!i.isEven() || !s.isEven()) i.addTo(this, i), s.subTo(e, s);
        i.rShiftTo(1, i);
      } else s.isEven() || s.subTo(e, s);
      s.rShiftTo(1, s);
    }
    while (r.isEven()) {
      r.rShiftTo(1, r);
      if (t) {
        if (!o.isEven() || !u.isEven()) o.addTo(this, o), u.subTo(e, u);
        o.rShiftTo(1, o);
      } else u.isEven() || u.subTo(e, u);
      u.rShiftTo(1, u);
    }
    n.compareTo(r) >= 0
      ? (n.subTo(r, n), t && i.subTo(o, i), s.subTo(u, s))
      : (r.subTo(n, r), t && o.subTo(i, o), u.subTo(s, u));
  }
  return r.compareTo(BigInteger.ONE) != 0
    ? BigInteger.ZERO
    : u.compareTo(e) >= 0
    ? u.subtract(e)
    : u.signum() < 0
    ? (u.addTo(e, u), u.signum() < 0 ? u.add(e) : u)
    : u;
}

function bnIsProbablePrime(e) {
  var t,
    n = this.abs();
  if (n.t == 1 && n[0] <= lowprimes[lowprimes.length - 1]) {
    for (t = 0; t < lowprimes.length; ++t) if (n[0] == lowprimes[t]) return !0;
    return !1;
  }
  if (n.isEven()) return !1;
  t = 1;
  while (t < lowprimes.length) {
    var r = lowprimes[t],
      i = t + 1;
    while (i < lowprimes.length && r < lplim) r *= lowprimes[i++];
    r = n.modInt(r);
    while (t < i) if (r % lowprimes[t++] == 0) return !1;
  }
  return n.millerRabin(e);
}

function bnpMillerRabin(e) {
  var t = this.subtract(BigInteger.ONE),
    n = t.getLowestSetBit();
  if (n <= 0) return !1;
  var r = t.shiftRight(n);
  (e = (e + 1) >> 1), e > lowprimes.length && (e = lowprimes.length);
  var i = nbi();
  for (var s = 0; s < e; ++s) {
    i.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
    var o = i.modPow(r, this);
    if (o.compareTo(BigInteger.ONE) != 0 && o.compareTo(t) != 0) {
      var u = 1;
      while (u++ < n && o.compareTo(t) != 0) {
        o = o.modPowInt(2, this);
        if (o.compareTo(BigInteger.ONE) == 0) return !1;
      }
      if (o.compareTo(t) != 0) return !1;
    }
  }
  return !0;
}

(NullExp.prototype.convert = nNop),
  (NullExp.prototype.revert = nNop),
  (NullExp.prototype.mulTo = nMulTo),
  (NullExp.prototype.sqrTo = nSqrTo),
  (Barrett.prototype.convert = barrettConvert),
  (Barrett.prototype.revert = barrettRevert),
  (Barrett.prototype.reduce = barrettReduce),
  (Barrett.prototype.mulTo = barrettMulTo),
  (Barrett.prototype.sqrTo = barrettSqrTo);
var lowprimes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
    101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193,
    197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307,
    311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421,
    431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547,
    557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659,
    661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797,
    809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929,
    937, 941, 947, 953, 967, 971, 977, 983, 991, 997,
  ],
  lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
(BigInteger.prototype.chunkSize = bnpChunkSize),
  (BigInteger.prototype.toRadix = bnpToRadix),
  (BigInteger.prototype.fromRadix = bnpFromRadix),
  (BigInteger.prototype.fromNumber = bnpFromNumber),
  (BigInteger.prototype.bitwiseTo = bnpBitwiseTo),
  (BigInteger.prototype.changeBit = bnpChangeBit),
  (BigInteger.prototype.addTo = bnpAddTo),
  (BigInteger.prototype.dMultiply = bnpDMultiply),
  (BigInteger.prototype.dAddOffset = bnpDAddOffset),
  (BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo),
  (BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo),
  (BigInteger.prototype.modInt = bnpModInt),
  (BigInteger.prototype.millerRabin = bnpMillerRabin),
  (BigInteger.prototype.clone = bnClone),
  (BigInteger.prototype.intValue = bnIntValue),
  (BigInteger.prototype.byteValue = bnByteValue),
  (BigInteger.prototype.shortValue = bnShortValue),
  (BigInteger.prototype.signum = bnSigNum),
  (BigInteger.prototype.toByteArray = bnToByteArray),
  (BigInteger.prototype.equals = bnEquals),
  (BigInteger.prototype.min = bnMin),
  (BigInteger.prototype.max = bnMax),
  (BigInteger.prototype.and = bnAnd),
  (BigInteger.prototype.or = bnOr),
  (BigInteger.prototype.xor = bnXor),
  (BigInteger.prototype.andNot = bnAndNot),
  (BigInteger.prototype.not = bnNot),
  (BigInteger.prototype.shiftLeft = bnShiftLeft),
  (BigInteger.prototype.shiftRight = bnShiftRight),
  (BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit),
  (BigInteger.prototype.bitCount = bnBitCount),
  (BigInteger.prototype.testBit = bnTestBit),
  (BigInteger.prototype.setBit = bnSetBit),
  (BigInteger.prototype.clearBit = bnClearBit),
  (BigInteger.prototype.flipBit = bnFlipBit),
  (BigInteger.prototype.add = bnAdd),
  (BigInteger.prototype.subtract = bnSubtract),
  (BigInteger.prototype.multiply = bnMultiply),
  (BigInteger.prototype.divide = bnDivide),
  (BigInteger.prototype.remainder = bnRemainder),
  (BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder),
  (BigInteger.prototype.modPow = bnModPow),
  (BigInteger.prototype.modInverse = bnModInverse),
  (BigInteger.prototype.pow = bnPow),
  (BigInteger.prototype.gcd = bnGCD),
  (BigInteger.prototype.isProbablePrime = bnIsProbablePrime),
  (BigInteger.prototype.square = bnSquare);

function ECFieldElementFp(e, t) {
  (this.x = t), (this.q = e);
}

function feFpEquals(e) {
  return e == this ? !0 : this.q.equals(e.q) && this.x.equals(e.x);
}

function feFpToBigInteger() {
  return this.x;
}

function feFpNegate() {
  return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
}

function feFpAdd(e) {
  return new ECFieldElementFp(this.q, this.x.add(e.toBigInteger()).mod(this.q));
}

function feFpSubtract(e) {
  return new ECFieldElementFp(this.q, this.x.subtract(e.toBigInteger()).mod(this.q));
}

function feFpMultiply(e) {
  return new ECFieldElementFp(this.q, this.x.multiply(e.toBigInteger()).mod(this.q));
}

function feFpSquare() {
  return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
}

function feFpDivide(e) {
  return new ECFieldElementFp(
    this.q,
    this.x.multiply(e.toBigInteger().modInverse(this.q)).mod(this.q)
  );
}

function ECPointFp(e, t, n, r) {
  (this.curve = e),
    (this.x = t),
    (this.y = n),
    r == null ? (this.z = BigInteger.ONE) : (this.z = r),
    (this.zinv = null);
}

function pointFpGetX() {
  return (
    this.zinv == null && (this.zinv = this.z.modInverse(this.curve.q)),
    this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))
  );
}

function pointFpGetY() {
  return (
    this.zinv == null && (this.zinv = this.z.modInverse(this.curve.q)),
    this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))
  );
}

function pointFpEquals(e) {
  if (e == this) return !0;
  if (this.isInfinity()) return e.isInfinity();
  if (e.isInfinity()) return this.isInfinity();
  var t, n;
  return (
    (t = e.y
      .toBigInteger()
      .multiply(this.z)
      .subtract(this.y.toBigInteger().multiply(e.z))
      .mod(this.curve.q)),
    t.equals(BigInteger.ZERO)
      ? ((n = e.x
          .toBigInteger()
          .multiply(this.z)
          .subtract(this.x.toBigInteger().multiply(e.z))
          .mod(this.curve.q)),
        n.equals(BigInteger.ZERO))
      : !1
  );
}

function pointFpIsInfinity() {
  return this.x == null && this.y == null
    ? !0
    : this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
}

function pointFpNegate() {
  return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
}

function pointFpAdd(e) {
  if (this.isInfinity()) return e;
  if (e.isInfinity()) return this;
  var t = e.y
      .toBigInteger()
      .multiply(this.z)
      .subtract(this.y.toBigInteger().multiply(e.z))
      .mod(this.curve.q),
    n = e.x
      .toBigInteger()
      .multiply(this.z)
      .subtract(this.x.toBigInteger().multiply(e.z))
      .mod(this.curve.q);
  if (BigInteger.ZERO.equals(n))
    return BigInteger.ZERO.equals(t) ? this.twice() : this.curve.getInfinity();
  var r = new BigInteger('3'),
    i = this.x.toBigInteger(),
    s = this.y.toBigInteger(),
    o = e.x.toBigInteger(),
    u = e.y.toBigInteger(),
    a = n.square(),
    f = a.multiply(n),
    l = i.multiply(a),
    c = t.square().multiply(this.z),
    h = c.subtract(l.shiftLeft(1)).multiply(e.z).subtract(f).multiply(n).mod(this.curve.q),
    p = l
      .multiply(r)
      .multiply(t)
      .subtract(s.multiply(f))
      .subtract(c.multiply(t))
      .multiply(e.z)
      .add(t.multiply(f))
      .mod(this.curve.q),
    d = f.multiply(this.z).multiply(e.z).mod(this.curve.q);
  return new ECPointFp(this.curve, this.curve.fromBigInteger(h), this.curve.fromBigInteger(p), d);
}

function pointFpTwice() {
  if (this.isInfinity()) return this;
  if (this.y.toBigInteger().signum() == 0) return this.curve.getInfinity();
  var e = new BigInteger('3'),
    t = this.x.toBigInteger(),
    n = this.y.toBigInteger(),
    r = n.multiply(this.z),
    i = r.multiply(n).mod(this.curve.q),
    s = this.curve.a.toBigInteger(),
    o = t.square().multiply(e);
  BigInteger.ZERO.equals(s) || (o = o.add(this.z.square().multiply(s))), (o = o.mod(this.curve.q));
  var u = o
      .square()
      .subtract(t.shiftLeft(3).multiply(i))
      .shiftLeft(1)
      .multiply(r)
      .mod(this.curve.q),
    a = o
      .multiply(e)
      .multiply(t)
      .subtract(i.shiftLeft(1))
      .shiftLeft(2)
      .multiply(i)
      .subtract(o.square().multiply(o))
      .mod(this.curve.q),
    f = r.square().multiply(r).shiftLeft(3).mod(this.curve.q);
  return new ECPointFp(this.curve, this.curve.fromBigInteger(u), this.curve.fromBigInteger(a), f);
}

function pointFpMultiply(e) {
  if (this.isInfinity()) return this;
  if (e.signum() == 0) return this.curve.getInfinity();
  var t = e,
    n = t.multiply(new BigInteger('3')),
    r = this.negate(),
    i = this,
    s;
  for (s = n.bitLength() - 2; s > 0; --s) {
    i = i.twice();
    var o = n.testBit(s),
      u = t.testBit(s);
    o != u && (i = i.add(o ? this : r));
  }
  return i;
}

function pointFpMultiplyTwo(e, t, n) {
  var r;
  e.bitLength() > n.bitLength() ? (r = e.bitLength() - 1) : (r = n.bitLength() - 1);
  var i = this.curve.getInfinity(),
    s = this.add(t);
  while (r >= 0)
    (i = i.twice()),
      e.testBit(r)
        ? n.testBit(r)
          ? (i = i.add(s))
          : (i = i.add(this))
        : n.testBit(r) && (i = i.add(t)),
      --r;
  return i;
}

function ECCurveFp(e, t, n) {
  (this.q = e),
    (this.a = this.fromBigInteger(t)),
    (this.b = this.fromBigInteger(n)),
    (this.infinity = new ECPointFp(this, null, null));
}

function curveFpGetQ() {
  return this.q;
}

function curveFpGetA() {
  return this.a;
}

function curveFpGetB() {
  return this.b;
}

function curveFpEquals(e) {
  return e == this ? !0 : this.q.equals(e.q) && this.a.equals(e.a) && this.b.equals(e.b);
}

function curveFpGetInfinity() {
  return this.infinity;
}

function curveFpFromBigInteger(e) {
  return new ECFieldElementFp(this.q, e);
}

function curveFpDecodePointHex(e) {
  switch (parseInt(e.substr(0, 2), 16)) {
    case 0:
      return this.infinity;
    case 2:
    case 3:
      return null;
    case 4:
    case 6:
    case 7:
      var t = (e.length - 2) / 2,
        n = e.substr(2, t),
        r = e.substr(t + 2, t);
      return new ECPointFp(
        this,
        this.fromBigInteger(new BigInteger(n, 16)),
        this.fromBigInteger(new BigInteger(r, 16))
      );
    default:
      return null;
  }
}

(ECFieldElementFp.prototype.equals = feFpEquals),
  (ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger),
  (ECFieldElementFp.prototype.negate = feFpNegate),
  (ECFieldElementFp.prototype.add = feFpAdd),
  (ECFieldElementFp.prototype.subtract = feFpSubtract),
  (ECFieldElementFp.prototype.multiply = feFpMultiply),
  (ECFieldElementFp.prototype.square = feFpSquare),
  (ECFieldElementFp.prototype.divide = feFpDivide),
  (ECPointFp.prototype.getX = pointFpGetX),
  (ECPointFp.prototype.getY = pointFpGetY),
  (ECPointFp.prototype.equals = pointFpEquals),
  (ECPointFp.prototype.isInfinity = pointFpIsInfinity),
  (ECPointFp.prototype.negate = pointFpNegate),
  (ECPointFp.prototype.add = pointFpAdd),
  (ECPointFp.prototype.twice = pointFpTwice),
  (ECPointFp.prototype.multiply = pointFpMultiply),
  (ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo),
  (ECCurveFp.prototype.getQ = curveFpGetQ),
  (ECCurveFp.prototype.getA = curveFpGetA),
  (ECCurveFp.prototype.getB = curveFpGetB),
  (ECCurveFp.prototype.equals = curveFpEquals),
  (ECCurveFp.prototype.getInfinity = curveFpGetInfinity),
  (ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger),
  (ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex);

function X9ECParameters(e, t, n, r) {
  (this.curve = e), (this.g = t), (this.n = n), (this.h = r);
}

function x9getCurve() {
  return this.curve;
}

function x9getG() {
  return this.g;
}

function x9getN() {
  return this.n;
}

function x9getH() {
  return this.h;
}

function fromHex(e) {
  return new BigInteger(e, 16);
}

function secp128r1() {
  var e = fromHex('FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF'),
    t = fromHex('FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC'),
    n = fromHex('E87579C11079F43DD824993C2CEE5ED3'),
    r = fromHex('FFFFFFFE0000000075A30D1B9038A115'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex('04161FF7528B899B2D0C28607CA52C5B86CF5AC8395BAFEB13C02DA292DDED7A83');
  return new X9ECParameters(s, o, r, i);
}

function secp160k1() {
  var e = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73'),
    t = BigInteger.ZERO,
    n = fromHex('7'),
    r = fromHex('0100000000000000000001B8FA16DFAB9ACA16B6B3'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex(
      '043B4C382CE37AA192A4019E763036F4F5DD4D7EBB938CF935318FDCED6BC28286531733C3F03C4FEE'
    );
  return new X9ECParameters(s, o, r, i);
}

function secp160r1() {
  var e = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF'),
    t = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC'),
    n = fromHex('1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45'),
    r = fromHex('0100000000000000000001F4C8F927AED3CA752257'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex(
      '044A96B5688EF573284664698968C38BB913CBFC8223A628553168947D59DCC912042351377AC5FB32'
    );
  return new X9ECParameters(s, o, r, i);
}

function secp192k1() {
  var e = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37'),
    t = BigInteger.ZERO,
    n = fromHex('3'),
    r = fromHex('FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex(
      '04DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D'
    );
  return new X9ECParameters(s, o, r, i);
}

function secp192r1() {
  var e = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF'),
    t = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC'),
    n = fromHex('64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1'),
    r = fromHex('FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex(
      '04188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF101207192B95FFC8DA78631011ED6B24CDD573F977A11E794811'
    );
  return new X9ECParameters(s, o, r, i);
}

function secp224r1() {
  var e = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001'),
    t = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE'),
    n = fromHex('B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4'),
    r = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex(
      '04B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34'
    );
  return new X9ECParameters(s, o, r, i);
}

function secp256k1() {
  var e = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'),
    t = BigInteger.ZERO,
    n = fromHex('7'),
    r = fromHex('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex(
      '0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8'
    );
  return new X9ECParameters(s, o, r, i);
}

function secp256r1() {
  var e = fromHex('FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF'),
    t = fromHex('FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC'),
    n = fromHex('5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B'),
    r = fromHex('FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551'),
    i = BigInteger.ONE,
    s = new ECCurveFp(e, t, n),
    o = s.decodePointHex(
      '046B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C2964FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5'
    );
  return new X9ECParameters(s, o, r, i);
}

function getSECCurveByName(e) {
  return e == 'secp128r1'
    ? secp128r1()
    : e == 'secp160k1'
    ? secp160k1()
    : e == 'secp160r1'
    ? secp160r1()
    : e == 'secp192k1'
    ? secp192k1()
    : e == 'secp192r1'
    ? secp192r1()
    : e == 'secp224r1'
    ? secp224r1()
    : e == 'secp256k1'
    ? secp256k1()
    : e == 'secp256r1'
    ? secp256r1()
    : null;
}

(X9ECParameters.prototype.getCurve = x9getCurve),
  (X9ECParameters.prototype.getG = x9getG),
  (X9ECParameters.prototype.getN = x9getN),
  (X9ECParameters.prototype.getH = x9getH);
var EventEmitter = function () {};
(EventEmitter.prototype.on = function (e, t, n) {
  n || (n = this),
    this._listeners || (this._listeners = {}),
    this._listeners[e] || (this._listeners[e] = []),
    this._unbinders || (this._unbinders = {}),
    this._unbinders[e] || (this._unbinders[e] = []);
  var r = function (e) {
    t.apply(n, [e]);
  };
  this._unbinders[e].push(t), this._listeners[e].push(r);
}),
  (EventEmitter.prototype.trigger = function (e, t) {
    t === undefined && (t = {}), this._listeners || (this._listeners = {});
    if (!this._listeners[e]) return;
    var n = this._listeners[e].length;
    while (n--) this._listeners[e][n](t);
  }),
  (EventEmitter.prototype.removeListener = function (e, t) {
    this._unbinders || (this._unbinders = {});
    if (!this._unbinders[e]) return;
    var n = this._unbinders[e].length;
    while (n--)
      this._unbinders[e][n] === t &&
        (this._unbinders[e].splice(n, 1), this._listeners[e].splice(n, 1));
  }),
  (EventEmitter.augment = function (e) {
    for (var t in EventEmitter.prototype) e[t] || (e[t] = EventEmitter.prototype[t]);
  });
(function (e) {
  var t = e;
})('object' == typeof module ? module.exports : null);
(BigInteger.valueOf = nbv),
  (BigInteger.prototype.toByteArrayUnsigned = function () {
    var e = this.abs().toByteArray();
    return e.length
      ? (e[0] == 0 && (e = e.slice(1)),
        e.map(function (e) {
          return e < 0 ? e + 256 : e;
        }))
      : e;
  }),
  (BigInteger.fromByteArrayUnsigned = function (e) {
    return e.length
      ? e[0] & 128
        ? new BigInteger([0].concat(e))
        : new BigInteger(e)
      : e.valueOf(0);
  }),
  (BigInteger.prototype.toByteArraySigned = function () {
    var e = this.abs().toByteArrayUnsigned(),
      t = this.compareTo(BigInteger.ZERO) < 0;
    return t ? (e[0] & 128 ? e.unshift(128) : (e[0] |= 128)) : e[0] & 128 && e.unshift(0), e;
  }),
  (BigInteger.fromByteArraySigned = function (e) {
    return e[0] & 128
      ? ((e[0] &= 127), BigInteger.fromByteArrayUnsigned(e).negate())
      : BigInteger.fromByteArrayUnsigned(e);
  });
var names = [
  'log',
  'debug',
  'info',
  'warn',
  'error',
  'assert',
  'dir',
  'dirxml',
  'group',
  'groupEnd',
  'time',
  'timeEnd',
  'count',
  'trace',
  'profile',
  'profileEnd',
];
// "undefined" == typeof window.console && (window.console = {});
// for (var i = 0; i < names.length; ++i) "undefined" == typeof window.console[names[i]] && (window.console[names[i]] = function() {});
Bitcoin.Util = {
  isArray:
    Array.isArray ||
    function (e) {
      return Object.prototype.toString.call(e) === '[object Array]';
    },
  makeFilledArray: function (e, t) {
    var n = [],
      r = 0;
    while (r < e) n[r++] = t;
    return n;
  },
  numToVarInt: function (e) {
    return e < 253
      ? [e]
      : e <= 65536
      ? [253, e >>> 8, e & 255]
      : e <= 1
      ? [254].concat(Crypto.util.wordsToBytes([e]))
      : [255].concat(Crypto.util.wordsToBytes([e >>> 32, e]));
  },
  valueToBigInt: function (e) {
    return e instanceof BigInteger ? e : BigInteger.fromByteArrayUnsigned(e);
  },
  formatValue: function (e) {
    var t = this.valueToBigInt(e).toString(),
      n = t.length > 8 ? t.substr(0, t.length - 8) : '0',
      r = t.length > 8 ? t.substr(t.length - 8) : t;
    while (r.length < 8) r = '0' + r;
    r = r.replace(/0*$/, '');
    while (r.length < 2) r += '0';
    return n + '.' + r;
  },
  parseValue: function (e) {
    var t = e.split('.'),
      n = t[0],
      r = t[1] || '0';
    while (r.length < 8) r += '0';
    r = r.replace(/^0+/g, '');
    var i = BigInteger.valueOf(parseInt(n));
    return (
      (i = i.multiply(BigInteger.valueOf(1e8))), (i = i.add(BigInteger.valueOf(parseInt(r)))), i
    );
  },
  sha256ripe160: function (e) {
    return Crypto.RIPEMD160(
      Crypto.SHA256(e, {
        asBytes: !0,
      }),
      {
        asBytes: !0,
      }
    );
  },
};
for (var i in Crypto.util) Crypto.util.hasOwnProperty(i) && (Bitcoin.Util[i] = Crypto.util[i]);
(function (e) {
  e.Base58 = {
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    validRegex: /^[1-9A-HJ-NP-Za-km-z]+$/,
    base: BigInteger.valueOf(58),
    encode: function (e) {
      var n = BigInteger.fromByteArrayUnsigned(e),
        r = [];
      while (n.compareTo(t.base) >= 0) {
        var i = n.mod(t.base);
        r.unshift(t.alphabet[i.intValue()]), (n = n.subtract(i).divide(t.base));
      }
      r.unshift(t.alphabet[n.intValue()]);
      for (var s = 0; s < e.length; s++) {
        if (e[s] != 0) break;
        r.unshift(t.alphabet[0]);
      }
      return r.join('');
    },
    decode: function (e) {
      var n = BigInteger.valueOf(0),
        r = 0;
      for (var i = e.length - 1; i >= 0; i--) {
        var s = t.alphabet.indexOf(e[i]);
        if (s < 0) throw 'Invalid character';
        (n = n.add(BigInteger.valueOf(s).multiply(t.base.pow(e.length - 1 - i)))),
          e[i] == '1' ? r++ : (r = 0);
      }
      var o = n.toByteArrayUnsigned();
      while (r-- > 0) o.unshift(0);
      return o;
    },
  };
  var t = e.Base58;
})('undefined' != typeof Bitcoin ? Bitcoin : module.exports);
(Bitcoin.Address = function (e) {
  'string' == typeof e && (e = Bitcoin.Address.decodeString(e)),
    (this.hash = e),
    (this.version = 0);
}),
  (Bitcoin.Address.prototype.toString = function () {
    var e = this.hash.slice(0);
    e.unshift(this.version);
    var t = Crypto.SHA256(
        Crypto.SHA256(e, {
          asBytes: !0,
        }),
        {
          asBytes: !0,
        }
      ),
      n = e.concat(t.slice(0, 4));
    return Bitcoin.Base58.encode(n);
  }),
  (Bitcoin.Address.prototype.getHashBase64 = function () {
    return Crypto.util.bytesToBase64(this.hash);
  }),
  (Bitcoin.Address.decodeString = function (e) {
    var t = Bitcoin.Base58.decode(e),
      n = t.slice(0, 21),
      r = Crypto.SHA256(
        Crypto.SHA256(n, {
          asBytes: !0,
        }),
        {
          asBytes: !0,
        }
      );
    if (r[0] != t[21] || r[1] != t[22] || r[2] != t[23] || r[3] != t[24])
      throw 'Checksum validation failed!';
    var i = n.shift();
    if (i != 0) throw 'Version ' + i + ' not supported!';
    return n;
  });

function integerToBytes(e, t) {
  var n = e.toByteArrayUnsigned();
  if (t < n.length) n = n.slice(n.length - t);
  else while (t > n.length) n.unshift(0);
  return n;
}

function dmp(e) {
  return (
    e instanceof BigInteger || (e = e.toBigInteger()),
    Crypto.util.bytesToHex(e.toByteArrayUnsigned())
  );
}

(ECFieldElementFp.prototype.getByteLength = function () {
  return Math.floor((this.toBigInteger().bitLength() + 7) / 8);
}),
  (ECPointFp.prototype.getEncoded = function (e) {
    var t = this.getX().toBigInteger(),
      n = this.getY().toBigInteger(),
      r = integerToBytes(t, 32);
    return (
      e
        ? n.isEven()
          ? r.unshift(2)
          : r.unshift(3)
        : (r.unshift(4), (r = r.concat(integerToBytes(n, 32)))),
      r
    );
  }),
  (ECPointFp.decodeFrom = function (e, t) {
    var n = t[0],
      r = t.length - 1,
      i = t.slice(1, 1 + r / 2),
      s = t.slice(1 + r / 2, 1 + r);
    i.unshift(0), s.unshift(0);
    var o = new BigInteger(i),
      u = new BigInteger(s);
    return new ECPointFp(e, e.fromBigInteger(o), e.fromBigInteger(u));
  }),
  (ECPointFp.prototype.add2D = function (e) {
    if (this.isInfinity()) return e;
    if (e.isInfinity()) return this;
    if (this.x.equals(e.x)) return this.y.equals(e.y) ? this.twice() : this.curve.getInfinity();
    var t = e.x.subtract(this.x),
      n = e.y.subtract(this.y),
      r = n.divide(t),
      i = r.square().subtract(this.x).subtract(e.x),
      s = r.multiply(this.x.subtract(i)).subtract(this.y);
    return new ECPointFp(this.curve, i, s);
  }),
  (ECPointFp.prototype.twice2D = function () {
    if (this.isInfinity()) return this;
    if (this.y.toBigInteger().signum() == 0) return this.curve.getInfinity();
    var e = this.curve.fromBigInteger(BigInteger.valueOf(2)),
      t = this.curve.fromBigInteger(BigInteger.valueOf(3)),
      n = this.x.square().multiply(t).add(this.curve.a).divide(this.y.multiply(e)),
      r = n.square().subtract(this.x.multiply(e)),
      i = n.multiply(this.x.subtract(r)).subtract(this.y);
    return new ECPointFp(this.curve, r, i);
  }),
  (ECPointFp.prototype.multiply2D = function (e) {
    if (this.isInfinity()) return this;
    if (e.signum() == 0) return this.curve.getInfinity();
    var t = e,
      n = t.multiply(new BigInteger('3')),
      r = this.negate(),
      i = this,
      s;
    for (s = n.bitLength() - 2; s > 0; --s) {
      i = i.twice();
      var o = n.testBit(s),
        u = t.testBit(s);
      o != u && (i = i.add2D(o ? this : r));
    }
    return i;
  }),
  (ECPointFp.prototype.isOnCurve = function () {
    var e = this.getX().toBigInteger(),
      t = this.getY().toBigInteger(),
      n = this.curve.getA().toBigInteger(),
      r = this.curve.getB().toBigInteger(),
      i = this.curve.getQ(),
      s = t.multiply(t).mod(i),
      o = e.multiply(e).multiply(e).add(n.multiply(e)).add(r).mod(i);
    return s.equals(o);
  }),
  (ECPointFp.prototype.toString = function () {
    return (
      '(' +
      this.getX().toBigInteger().toString() +
      ',' +
      this.getY().toBigInteger().toString() +
      ')'
    );
  }),
  (ECPointFp.prototype.validate = function () {
    var e = this.curve.getQ();
    if (this.isInfinity()) throw new Error('Point is at infinity.');
    var t = this.getX().toBigInteger(),
      n = this.getY().toBigInteger();
    if (t.compareTo(BigInteger.ONE) < 0 || t.compareTo(e.subtract(BigInteger.ONE)) > 0)
      throw new Error('x coordinate out of bounds');
    if (n.compareTo(BigInteger.ONE) < 0 || n.compareTo(e.subtract(BigInteger.ONE)) > 0)
      throw new Error('y coordinate out of bounds');
    if (!this.isOnCurve()) throw new Error('Point is not on the curve.');
    if (this.multiply(e).isInfinity()) throw new Error('Point is not a scalar multiple of G.');
    return !0;
  }),
  (Bitcoin.ECDSA = (function () {
    function r(e, t, n, r) {
      var i = Math.max(t.bitLength(), r.bitLength()),
        s = e.add2D(n),
        o = e.curve.getInfinity();
      for (var u = i - 1; u >= 0; --u)
        (o = o.twice2D()),
          (o.z = BigInteger.ONE),
          t.testBit(u)
            ? r.testBit(u)
              ? (o = o.add2D(s))
              : (o = o.add2D(e))
            : r.testBit(u) && (o = o.add2D(n));
      return o;
    }

    var e = getSECCurveByName('secp256k1'),
      t = new SecureRandom(),
      n = null,
      i = {
        getBigRandom: function (e) {
          return new BigInteger(e.bitLength(), t)
            .mod(e.subtract(BigInteger.ONE))
            .add(BigInteger.ONE);
        },
        sign: function (t, n) {
          var r = n,
            s = e.getN(),
            o = BigInteger.fromByteArrayUnsigned(t);
          do
            var u = i.getBigRandom(s),
              a = e.getG(),
              f = a.multiply(u),
              l = f.getX().toBigInteger().mod(s);
          while (l.compareTo(BigInteger.ZERO) <= 0);
          var c = u
            .modInverse(s)
            .multiply(o.add(r.multiply(l)))
            .mod(s);
          return i.serializeSig(l, c);
        },
        verify: function (t, n, r) {
          var s, o;
          if (Bitcoin.Util.isArray(n)) {
            var u = i.parseSig(n);
            (s = u.r), (o = u.s);
          } else {
            if ('object' != typeof n || !n.r || !n.s) throw 'Invalid value for signature';
            (s = n.r), (o = n.s);
          }
          var a;
          if (r instanceof ECPointFp) a = r;
          else {
            if (!Bitcoin.Util.isArray(r))
              throw 'Invalid format for pubkey value, must be byte array or ECPointFp';
            a = ECPointFp.decodeFrom(e.getCurve(), r);
          }
          var f = BigInteger.fromByteArrayUnsigned(t);
          return i.verifyRaw(f, s, o, a);
        },
        verifyRaw: function (t, n, r, i) {
          var s = e.getN(),
            o = e.getG();
          if (n.compareTo(BigInteger.ONE) < 0 || n.compareTo(s) >= 0) return !1;
          if (r.compareTo(BigInteger.ONE) < 0 || r.compareTo(s) >= 0) return !1;
          var u = r.modInverse(s),
            a = t.multiply(u).mod(s),
            f = n.multiply(u).mod(s),
            l = o.multiply(a).add(i.multiply(f)),
            c = l.getX().toBigInteger().mod(s);
          return c.equals(n);
        },
        serializeSig: function (e, t) {
          var n = e.toByteArraySigned(),
            r = t.toByteArraySigned(),
            i = [];
          return (
            i.push(2),
            i.push(n.length),
            (i = i.concat(n)),
            i.push(2),
            i.push(r.length),
            (i = i.concat(r)),
            i.unshift(i.length),
            i.unshift(48),
            i
          );
        },
        parseSig: function (e) {
          var t;
          if (e[0] != 48) throw new Error('Signature not a valid DERSequence');
          t = 2;
          if (e[t] != 2) throw new Error('First element in signature must be a DERInteger');
          var n = e.slice(t + 2, t + 2 + e[t + 1]);
          t += 2 + e[t + 1];
          if (e[t] != 2) throw new Error('Second element in signature must be a DERInteger');
          var r = e.slice(t + 2, t + 2 + e[t + 1]);
          t += 2 + e[t + 1];
          var i = BigInteger.fromByteArrayUnsigned(n),
            s = BigInteger.fromByteArrayUnsigned(r);
          return {
            r: i,
            s: s,
          };
        },
        parseSigCompact: function (t) {
          if (t.length !== 65) throw 'Signature has the wrong length';
          var n = t[0] - 27;
          if (n < 0 || n > 7) throw 'Invalid signature type';
          var r = e.getN(),
            i = BigInteger.fromByteArrayUnsigned(t.slice(1, 33)).mod(r),
            s = BigInteger.fromByteArrayUnsigned(t.slice(33, 65)).mod(r);
          return {
            r: i,
            s: s,
            i: n,
          };
        },
        recoverPubKey: function (t, s, o, u) {
          u &= 3;
          var a = u & 1,
            f = u >> 1,
            l = e.getN(),
            c = e.getG(),
            h = e.getCurve(),
            p = h.getQ(),
            d = h.getA().toBigInteger(),
            v = h.getB().toBigInteger();
          n || (n = p.add(BigInteger.ONE).divide(BigInteger.valueOf(4)));
          var m = f ? t.add(l) : t,
            g = m.multiply(m).multiply(m).add(d.multiply(m)).add(v).mod(p),
            y = g.modPow(n, p),
            b = y.isEven() ? u % 2 : (u + 1) % 2,
            w = (y.isEven() ? !a : a) ? y : p.subtract(y),
            E = new ECPointFp(h, h.fromBigInteger(m), h.fromBigInteger(w));
          E.validate();
          var S = BigInteger.fromByteArrayUnsigned(o),
            x = BigInteger.ZERO.subtract(S).mod(l),
            T = t.modInverse(l),
            N = r(E, s, c, x).multiply(T);
          console.log('G.x: ', Crypto.util.bytesToHex(c.x.toBigInteger().toByteArrayUnsigned())),
            console.log('G.y: ', Crypto.util.bytesToHex(c.y.toBigInteger().toByteArrayUnsigned())),
            console.log('s: ', Crypto.util.bytesToHex(T.toByteArrayUnsigned())),
            console.log('Q.x: ', Crypto.util.bytesToHex(N.x.toBigInteger().toByteArrayUnsigned())),
            console.log('Q.y: ', Crypto.util.bytesToHex(N.y.toBigInteger().toByteArrayUnsigned())),
            N.validate();
          if (!i.verifyRaw(S, t, s, N)) throw 'Pubkey recovery unsuccessful';
          var C = new Bitcoin.ECKey();
          return (C.pub = N), C;
        },
        calcPubkeyRecoveryParam: function (e, t, n, r) {
          for (var i = 0; i < 4; i++)
            try {
              var s = Bitcoin.ECDSA.recoverPubKey(t, n, r, i);
              if (s.getBitcoinAddress().toString() == e) return i;
            } catch (o) {}
          throw 'Unable to find valid recovery factor';
        },
      };
    return i;
  })());
Bitcoin.ECKey = (function () {
  var e = Bitcoin.ECDSA,
    t = getSECCurveByName('secp256k1'),
    n = new SecureRandom(),
    r = function (n) {
      if (!n) {
        var i = t.getN();
        this.priv = e.getBigRandom(i);
      } else
        n instanceof BigInteger
          ? (this.priv = n)
          : Bitcoin.Util.isArray(n)
          ? (this.priv = BigInteger.fromByteArrayUnsigned(n))
          : 'string' == typeof n &&
            (n.length == 51 && n[0] == '5'
              ? (this.priv = BigInteger.fromByteArrayUnsigned(r.decodeString(n)))
              : (this.priv = BigInteger.fromByteArrayUnsigned(Crypto.util.base64ToBytes(n))));
      this.compressed = !!r.compressByDefault;
    };
  return (
    (r.compressByDefault = !1),
    (r.prototype.setCompressed = function (e) {
      this.compressed = !!e;
    }),
    (r.prototype.getPub = function () {
      return this.getPubPoint().getEncoded(this.compressed);
    }),
    (r.prototype.getPubPoint = function () {
      return this.pub || (this.pub = t.getG().multiply(this.priv)), this.pub;
    }),
    (r.prototype.getPubKeyHash = function () {
      return this.pubKeyHash
        ? this.pubKeyHash
        : (this.pubKeyHash = Bitcoin.Util.sha256ripe160(this.getPub()));
    }),
    (r.prototype.getBitcoinAddress = function () {
      var e = this.getPubKeyHash(),
        t = new Bitcoin.Address(e);
      return t;
    }),
    (r.prototype.getExportedPrivateKey = function () {
      var e = this.priv.toByteArrayUnsigned();
      while (e.length < 32) e.unshift(0);
      e.unshift(128);
      var t = Crypto.SHA256(
          Crypto.SHA256(e, {
            asBytes: !0,
          }),
          {
            asBytes: !0,
          }
        ),
        n = e.concat(t.slice(0, 4));
      return Bitcoin.Base58.encode(n);
    }),
    (r.prototype.setPub = function (e) {
      this.pub = ECPointFp.decodeFrom(t.getCurve(), e);
    }),
    (r.prototype.toString = function (e) {
      return e === 'base64'
        ? Crypto.util.bytesToBase64(this.priv.toByteArrayUnsigned())
        : Crypto.util.bytesToHex(this.priv.toByteArrayUnsigned());
    }),
    (r.prototype.sign = function (t) {
      return e.sign(t, this.priv);
    }),
    (r.prototype.verify = function (t, n) {
      return e.verify(t, n, this.getPub());
    }),
    (r.decodeString = function (e) {
      var t = Bitcoin.Base58.decode(e),
        n = t.slice(0, 33),
        r = Crypto.SHA256(
          Crypto.SHA256(n, {
            asBytes: !0,
          }),
          {
            asBytes: !0,
          }
        );
      if (r[0] != t[33] || r[1] != t[34] || r[2] != t[35] || r[3] != t[36])
        throw 'Checksum validation failed!';
      var i = n.shift();
      if (i != 128) throw 'Version ' + i + ' not supported!';
      return n;
    }),
    r
  );
})();
(function () {
  var e = (Bitcoin.Opcode = function (e) {
    this.code = e;
  });
  (e.prototype.toString = function () {
    return e.reverseMap[this.code];
  }),
    (e.map = {
      OP_0: 0,
      OP_FALSE: 0,
      OP_PUSHDATA1: 76,
      OP_PUSHDATA2: 77,
      OP_PUSHDATA4: 78,
      OP_1NEGATE: 79,
      OP_RESERVED: 80,
      OP_1: 81,
      OP_TRUE: 81,
      OP_2: 82,
      OP_3: 83,
      OP_4: 84,
      OP_5: 85,
      OP_6: 86,
      OP_7: 87,
      OP_8: 88,
      OP_9: 89,
      OP_10: 90,
      OP_11: 91,
      OP_12: 92,
      OP_13: 93,
      OP_14: 94,
      OP_15: 95,
      OP_16: 96,
      OP_NOP: 97,
      OP_VER: 98,
      OP_IF: 99,
      OP_NOTIF: 100,
      OP_VERIF: 101,
      OP_VERNOTIF: 102,
      OP_ELSE: 103,
      OP_ENDIF: 104,
      OP_VERIFY: 105,
      OP_RETURN: 106,
      OP_TOALTSTACK: 107,
      OP_FROMALTSTACK: 108,
      OP_2DROP: 109,
      OP_2DUP: 110,
      OP_3DUP: 111,
      OP_2OVER: 112,
      OP_2ROT: 113,
      OP_2SWAP: 114,
      OP_IFDUP: 115,
      OP_DEPTH: 116,
      OP_DROP: 117,
      OP_DUP: 118,
      OP_NIP: 119,
      OP_OVER: 120,
      OP_PICK: 121,
      OP_ROLL: 122,
      OP_ROT: 123,
      OP_SWAP: 124,
      OP_TUCK: 125,
      OP_CAT: 126,
      OP_SUBSTR: 127,
      OP_LEFT: 128,
      OP_RIGHT: 129,
      OP_SIZE: 130,
      OP_INVERT: 131,
      OP_AND: 132,
      OP_OR: 133,
      OP_XOR: 134,
      OP_EQUAL: 135,
      OP_EQUALVERIFY: 136,
      OP_RESERVED1: 137,
      OP_RESERVED2: 138,
      OP_1ADD: 139,
      OP_1SUB: 140,
      OP_2MUL: 141,
      OP_2DIV: 142,
      OP_NEGATE: 143,
      OP_ABS: 144,
      OP_NOT: 145,
      OP_0NOTEQUAL: 146,
      OP_ADD: 147,
      OP_SUB: 148,
      OP_MUL: 149,
      OP_DIV: 150,
      OP_MOD: 151,
      OP_LSHIFT: 152,
      OP_RSHIFT: 153,
      OP_BOOLAND: 154,
      OP_BOOLOR: 155,
      OP_NUMEQUAL: 156,
      OP_NUMEQUALVERIFY: 157,
      OP_NUMNOTEQUAL: 158,
      OP_LESSTHAN: 159,
      OP_GREATERTHAN: 160,
      OP_LESSTHANOREQUAL: 161,
      OP_GREATERTHANOREQUAL: 162,
      OP_MIN: 163,
      OP_MAX: 164,
      OP_WITHIN: 165,
      OP_RIPEMD160: 166,
      OP_SHA1: 167,
      OP_SHA256: 168,
      OP_HASH160: 169,
      OP_HASH256: 170,
      OP_CODESEPARATOR: 171,
      OP_CHECKSIG: 172,
      OP_CHECKSIGVERIFY: 173,
      OP_CHECKMULTISIG: 174,
      OP_CHECKMULTISIGVERIFY: 175,
      OP_NOP1: 176,
      OP_NOP2: 177,
      OP_NOP3: 178,
      OP_NOP4: 179,
      OP_NOP5: 180,
      OP_NOP6: 181,
      OP_NOP7: 182,
      OP_NOP8: 183,
      OP_NOP9: 184,
      OP_NOP10: 185,
      OP_PUBKEYHASH: 253,
      OP_PUBKEY: 254,
      OP_INVALIDOPCODE: 255,
    }),
    (e.reverseMap = []);
  for (var t in e.map) e.reverseMap[e.map[t]] = t;
})();
(function () {
  var Opcode = Bitcoin.Opcode;
  for (var i in Opcode.map) CallEval(i, Opcode.map[i]);
  var Script = (Bitcoin.Script = function (e) {
    if (!e) this.buffer = [];
    else if ('string' == typeof e) this.buffer = Crypto.util.base64ToBytes(e);
    else if (Bitcoin.Util.isArray(e)) this.buffer = e;
    else {
      if (!(e instanceof Script)) throw new Error('Invalid script');
      this.buffer = e.buffer;
    }
    this.parse();
  });
  (Script.prototype.parse = function () {
    function n(n) {
      e.chunks.push(e.buffer.slice(t, t + n)), (t += n);
    }

    var e = this;
    this.chunks = [];
    var t = 0;
    while (t < this.buffer.length) {
      var r = this.buffer[t++];
      r >= 240 && (r = (r << 8) | this.buffer[t++]);
      var i;
      r > 0 && r < OP_PUSHDATA1
        ? n(r)
        : r == OP_PUSHDATA1
        ? ((i = this.buffer[t++]), n(i))
        : r == OP_PUSHDATA2
        ? ((i = (this.buffer[t++] << 8) | this.buffer[t++]), n(i))
        : r == OP_PUSHDATA4
        ? ((i =
            (this.buffer[t++] << 24) |
            (this.buffer[t++] << 16) |
            (this.buffer[t++] << 8) |
            this.buffer[t++]),
          n(i))
        : this.chunks.push(r);
    }
  }),
    (Script.prototype.getOutType = function () {
      return this.chunks[this.chunks.length - 1] == OP_CHECKMULTISIG &&
        this.chunks[this.chunks.length - 2] <= 3
        ? 'Multisig'
        : this.chunks.length == 5 &&
          this.chunks[0] == OP_DUP &&
          this.chunks[1] == OP_HASH160 &&
          this.chunks[3] == OP_EQUALVERIFY &&
          this.chunks[4] == OP_CHECKSIG
        ? 'Address'
        : this.chunks.length == 2 && this.chunks[1] == OP_CHECKSIG
        ? 'Pubkey'
        : 'Strange';
    }),
    (Script.prototype.simpleOutHash = function () {
      switch (this.getOutType()) {
        case 'Address':
          return this.chunks[2];
        case 'Pubkey':
          return Bitcoin.Util.sha256ripe160(this.chunks[0]);
        default:
          throw new Error('Encountered non-standard scriptPubKey');
      }
    }),
    (Script.prototype.simpleOutPubKeyHash = Script.prototype.simpleOutHash),
    (Script.prototype.getInType = function () {
      return this.chunks.length == 1 && Bitcoin.Util.isArray(this.chunks[0])
        ? 'Pubkey'
        : this.chunks.length == 2 &&
          Bitcoin.Util.isArray(this.chunks[0]) &&
          Bitcoin.Util.isArray(this.chunks[1])
        ? 'Address'
        : 'Strange';
    }),
    (Script.prototype.simpleInPubKey = function () {
      switch (this.getInType()) {
        case 'Address':
          return this.chunks[1];
        case 'Pubkey':
          throw new Error('Script does not contain pubkey.');
        default:
          throw new Error('Encountered non-standard scriptSig');
      }
    }),
    (Script.prototype.simpleInHash = function () {
      return Bitcoin.Util.sha256ripe160(this.simpleInPubKey());
    }),
    (Script.prototype.simpleInPubKeyHash = Script.prototype.simpleInHash),
    (Script.prototype.writeOp = function (e) {
      this.buffer.push(e), this.chunks.push(e);
    }),
    (Script.prototype.writeBytes = function (e) {
      e.length < OP_PUSHDATA1
        ? this.buffer.push(e.length)
        : e.length <= 255
        ? (this.buffer.push(OP_PUSHDATA1), this.buffer.push(e.length))
        : e.length <= 65535
        ? (this.buffer.push(OP_PUSHDATA2),
          this.buffer.push(e.length & 255),
          this.buffer.push((e.length >>> 8) & 255))
        : (this.buffer.push(OP_PUSHDATA4),
          this.buffer.push(e.length & 255),
          this.buffer.push((e.length >>> 8) & 255),
          this.buffer.push((e.length >>> 16) & 255),
          this.buffer.push((e.length >>> 24) & 255)),
        (this.buffer = this.buffer.concat(e)),
        this.chunks.push(e);
    }),
    (Script.createOutputScript = function (e) {
      var t = new Script();
      return (
        t.writeOp(OP_DUP),
        t.writeOp(OP_HASH160),
        t.writeBytes(e.hash),
        t.writeOp(OP_EQUALVERIFY),
        t.writeOp(OP_CHECKSIG),
        t
      );
    }),
    (Script.prototype.extractAddresses = function (e) {
      switch (this.getOutType()) {
        case 'Address':
          return e.push(new Address(this.chunks[2])), 1;
        case 'Pubkey':
          return e.push(new Address(Util.sha256ripe160(this.chunks[0]))), 1;
        case 'Multisig':
          for (var t = 1; t < this.chunks.length - 2; ++t)
            e.push(new Address(Util.sha256ripe160(this.chunks[t])));
          return this.chunks[0] - OP_1 + 1;
        default:
          throw new Error('Encountered non-standard scriptPubKey');
      }
    }),
    (Script.createMultiSigOutputScript = function (e, t) {
      var n = new Bitcoin.Script();
      n.writeOp(OP_1 + e - 1);
      for (var r = 0; r < t.length; ++r) n.writeBytes(t[r]);
      return n.writeOp(OP_1 + t.length - 1), n.writeOp(OP_CHECKMULTISIG), n;
    }),
    (Script.createInputScript = function (e, t) {
      var n = new Script();
      return n.writeBytes(e), n.writeBytes(t), n;
    }),
    (Script.prototype.clone = function () {
      return new Script(this.buffer);
    });
})();
(function () {
  var e = Bitcoin.Script,
    t = (Bitcoin.Transaction = function (e) {
      (this.version = 1),
        (this.lock_time = 0),
        (this.ins = []),
        (this.outs = []),
        (this.timestamp = null),
        (this.block = null);
      if (e) {
        e.hash && (this.hash = e.hash),
          e.version && (this.version = e.version),
          e.lock_time && (this.lock_time = e.lock_time);
        if (e.ins && e.ins.length)
          for (var t = 0; t < e.ins.length; t++) this.addInput(new u(e.ins[t]));
        if (e.outs && e.outs.length)
          for (var t = 0; t < e.outs.length; t++) this.addOutput(new a(e.outs[t]));
        e.timestamp && (this.timestamp = e.timestamp), e.block && (this.block = e.block);
      }
    });
  (t.objectify = function (e) {
    var n = [];
    for (var r = 0; r < e.length; r++) n.push(new t(e[r]));
    return n;
  }),
    (t.prototype.addInput = function (e, t) {
      arguments[0] instanceof u
        ? this.ins.push(arguments[0])
        : this.ins.push(
            new u({
              outpoint: {
                hash: e.hash,
                index: t,
              },
              script: new Bitcoin.Script(),
              sequence: 4294967295,
            })
          );
    }),
    (t.prototype.addOutput = function (t, n) {
      if (arguments[0] instanceof a) this.outs.push(arguments[0]);
      else {
        if (n instanceof BigInteger) {
          n = n.toByteArrayUnsigned().reverse();
          while (n.length < 8) n.push(0);
        } else Bitcoin.Util.isArray(n);
        this.outs.push(
          new a({
            value: n,
            script: e.createOutputScript(t),
          })
        );
      }
    }),
    (t.prototype.serialize = function () {
      var e = [];
      (e = e.concat(Crypto.util.wordsToBytes([parseInt(this.version)]).reverse())),
        (e = e.concat(Bitcoin.Util.numToVarInt(this.ins.length)));
      for (var t = 0; t < this.ins.length; t++) {
        var n = this.ins[t];
        (e = e.concat(Crypto.util.base64ToBytes(n.outpoint.hash))),
          (e = e.concat(Crypto.util.wordsToBytes([parseInt(n.outpoint.index)]).reverse()));
        var r = n.script.buffer;
        (e = e.concat(Bitcoin.Util.numToVarInt(r.length))),
          (e = e.concat(r)),
          (e = e.concat(Crypto.util.wordsToBytes([parseInt(n.sequence)]).reverse()));
      }
      e = e.concat(Bitcoin.Util.numToVarInt(this.outs.length));
      for (var t = 0; t < this.outs.length; t++) {
        var i = this.outs[t];
        e = e.concat(i.value);
        var r = i.script.buffer;
        (e = e.concat(Bitcoin.Util.numToVarInt(r.length))), (e = e.concat(r));
      }
      return (e = e.concat(Crypto.util.wordsToBytes([parseInt(this.lock_time)]).reverse())), e;
    });
  var n = 171,
    r = 1,
    i = 2,
    s = 3,
    o = 80;
  (t.prototype.hashTransactionForSignature = function (t, n, r) {
    var u = this.clone();
    for (var a = 0; a < u.ins.length; a++) u.ins[a].script = new e();
    u.ins[n].script = t;
    if ((r & 31) == i) {
      u.outs = [];
      for (var a = 0; a < u.ins.length; a++) a != n && (u.ins[a].sequence = 0);
    } else (r & 31) == s;
    r & o && (u.ins = [u.ins[n]]);
    var f = u.serialize();
    f = f.concat(Crypto.util.wordsToBytes([parseInt(r)]).reverse());
    var l = Crypto.SHA256(f, {
      asBytes: !0,
    });
    return Crypto.SHA256(l, {
      asBytes: !0,
    });
  }),
    (t.prototype.getHash = function () {
      var e = this.serialize();
      return Crypto.SHA256(
        Crypto.SHA256(e, {
          asBytes: !0,
        }),
        {
          asBytes: !0,
        }
      );
    }),
    (t.prototype.clone = function () {
      var e = new t();
      (e.version = this.version), (e.lock_time = this.lock_time);
      for (var n = 0; n < this.ins.length; n++) {
        var r = this.ins[n].clone();
        e.addInput(r);
      }
      for (var n = 0; n < this.outs.length; n++) {
        var i = this.outs[n].clone();
        e.addOutput(i);
      }
      return e;
    }),
    (t.prototype.analyze = function (e) {
      if (e instanceof Bitcoin.Wallet) {
        var t = !0,
          n = !0,
          r = null,
          i = null,
          s = null;
        for (var o = this.outs.length - 1; o >= 0; o--) {
          var u = this.outs[o],
            a = u.script.simpleOutPubKeyHash();
          e.hasHash(a) ? (i = a) : (n = !1), (r = a);
        }
        for (var o = this.ins.length - 1; o >= 0; o--) {
          var f = this.ins[o];
          s = f.script.simpleInPubKeyHash();
          if (!e.hasHash(s)) {
            t = !1;
            break;
          }
        }
        var l = this.calcImpact(e),
          c = {};
        return (
          (c.impact = l),
          l.sign > 0 && l.value.compareTo(BigInteger.ZERO) > 0
            ? ((c.type = 'recv'), (c.addr = new Bitcoin.Address(i)))
            : t && n
            ? (c.type = 'self')
            : t
            ? ((c.type = 'sent'), (c.addr = new Bitcoin.Address(r)))
            : (c.type = 'other'),
          c
        );
      }
      return null;
    }),
    (t.prototype.getDescription = function (e) {
      var t = this.analyze(e);
      if (!t) return '';
      switch (t.type) {
        case 'recv':
          return 'Received with ' + t.addr;
        case 'sent':
          return 'Payment to ' + t.addr;
        case 'self':
          return 'Payment to yourself';
        case 'other':
        default:
          return '';
      }
    }),
    (t.prototype.getTotalOutValue = function () {
      var e = BigInteger.ZERO;
      for (var t = 0; t < this.outs.length; t++) {
        var n = this.outs[t];
        e = e.add(Bitcoin.Util.valueToBigInt(n.value));
      }
      return e;
    }),
    (t.prototype.getTotalValue = t.prototype.getTotalOutValue),
    (t.prototype.calcImpact = function (e) {
      if (e instanceof Bitcoin.Wallet) {
        var t = BigInteger.ZERO;
        for (var n = 0; n < this.outs.length; n++) {
          var r = this.outs[n],
            i = Crypto.util.bytesToBase64(r.script.simpleOutPubKeyHash());
          e.hasHash(i) && (t = t.add(Bitcoin.Util.valueToBigInt(r.value)));
        }
        var s = BigInteger.ZERO;
        for (var n = 0; n < this.ins.length; n++) {
          var o = this.ins[n],
            i = Crypto.util.bytesToBase64(o.script.simpleInPubKeyHash());
          if (e.hasHash(i)) {
            var u = e.txIndex[o.outpoint.hash];
            u && (s = s.add(Bitcoin.Util.valueToBigInt(u.outs[o.outpoint.index].value)));
          }
        }
        return t.compareTo(s) >= 0
          ? {
              sign: 1,
              value: t.subtract(s),
            }
          : {
              sign: -1,
              value: s.subtract(t),
            };
      }
      return BigInteger.ZERO;
    });
  var u = (Bitcoin.TransactionIn = function (t) {
    (this.outpoint = t.outpoint),
      t.script instanceof e ? (this.script = t.script) : (this.script = new e(t.script)),
      (this.sequence = t.sequence);
  });
  u.prototype.clone = function () {
    var e = new u({
      outpoint: {
        hash: this.outpoint.hash,
        index: this.outpoint.index,
      },
      script: this.script.clone(),
      sequence: this.sequence,
    });
    return e;
  };
  var a = (Bitcoin.TransactionOut = function (t) {
    t.script instanceof e ? (this.script = t.script) : (this.script = new e(t.script));
    if (Bitcoin.Util.isArray(t.value)) this.value = t.value;
    else if ('string' == typeof t.value) {
      var n = new BigInteger(t.value, 10).toString(16);
      while (n.length < 16) n = '0' + n;
      this.value = Crypto.util.hexToBytes(n);
    }
  });
  a.prototype.clone = function () {
    var e = new a({
      script: this.script.clone(),
      value: this.value.slice(0),
    });
    return e;
  };
})();
Bitcoin.Wallet = (function () {
  var e = Bitcoin.Script,
    t = Bitcoin.TransactionIn,
    n = Bitcoin.TransactionOut,
    r = function () {
      var e = [];
      (this.addressHashes = []),
        (this.txIndex = {}),
        (this.unspentOuts = []),
        (this.addressPointer = 0),
        (this.addKey = function (t, n) {
          t instanceof Bitcoin.ECKey || (t = new Bitcoin.ECKey(t)),
            e.push(t),
            n && ('string' == typeof n && (n = Crypto.util.base64ToBytes(n)), t.setPub(n)),
            this.addressHashes.push(t.getBitcoinAddress().getHashBase64());
        }),
        (this.addKeys = function (e, t) {
          'string' == typeof e && (e = e.split(',')), 'string' == typeof t && (t = t.split(','));
          var n;
          if (Array.isArray(t) && e.length == t.length)
            for (n = 0; n < e.length; n++) this.addKey(e[n], t[n]);
          else for (n = 0; n < e.length; n++) this.addKey(e[n]);
        }),
        (this.getKeys = function () {
          var t = [];
          for (var n = 0; n < e.length; n++) t.push(e[n].toString('base64'));
          return t;
        }),
        (this.getPubKeys = function () {
          var t = [];
          for (var n = 0; n < e.length; n++) t.push(Crypto.util.bytesToBase64(e[n].getPub()));
          return t;
        }),
        (this.clear = function () {
          e = [];
        }),
        (this.getLength = function () {
          return e.length;
        }),
        (this.getAllAddresses = function () {
          var t = [];
          for (var n = 0; n < e.length; n++) t.push(e[n].getBitcoinAddress());
          return t;
        }),
        (this.getCurAddress = function () {
          return e[this.addressPointer] ? e[this.addressPointer].getBitcoinAddress() : null;
        }),
        (this.getNextAddress = function () {
          return (
            this.addressPointer++,
            e[this.addressPointer] || this.generateAddress(),
            e[this.addressPointer].getBitcoinAddress()
          );
        }),
        (this.signWithKey = function (t, n) {
          t = Crypto.util.bytesToBase64(t);
          for (var r = 0; r < this.addressHashes.length; r++)
            if (this.addressHashes[r] == t) return e[r].sign(n);
          throw new Error('Missing key for signature');
        }),
        (this.getPubKeyFromHash = function (t) {
          t = Crypto.util.bytesToBase64(t);
          for (var n = 0; n < this.addressHashes.length; n++)
            if (this.addressHashes[n] == t) return e[n].getPub();
          throw new Error('Hash unknown');
        });
    };
  return (
    (r.prototype.generateAddress = function () {
      this.addKey(new Bitcoin.ECKey());
    }),
    (r.prototype.process = function (e) {
      if (this.txIndex[e.hash]) return;
      var r, i, s;
      for (r = 0; r < e.outs.length; r++) {
        var o = new n(e.outs[r]);
        s = Crypto.util.bytesToBase64(o.script.simpleOutPubKeyHash());
        for (i = 0; i < this.addressHashes.length; i++)
          if (this.addressHashes[i] === s) {
            this.unspentOuts.push({
              tx: e,
              index: r,
              out: o,
            });
            break;
          }
      }
      for (r = 0; r < e.ins.length; r++) {
        var u = new t(e.ins[r]),
          a = u.script.simpleInPubKey();
        s = Crypto.util.bytesToBase64(Bitcoin.Util.sha256ripe160(a));
        for (i = 0; i < this.addressHashes.length; i++)
          if (this.addressHashes[i] === s) {
            for (var f = 0; f < this.unspentOuts.length; f++)
              u.outpoint.hash == this.unspentOuts[f].tx.hash &&
                u.outpoint.index == this.unspentOuts[f].index &&
                this.unspentOuts.splice(f, 1);
            break;
          }
      }
      this.txIndex[e.hash] = e;
    }),
    (r.prototype.getBalance = function () {
      var e = BigInteger.valueOf(0);
      for (var t = 0; t < this.unspentOuts.length; t++) {
        var n = this.unspentOuts[t].out;
        e = e.add(Bitcoin.Util.valueToBigInt(n.value));
      }
      return e;
    }),
    (r.prototype.createSend = function (t, n, r) {
      var i = [],
        s = n.add(r),
        o = BigInteger.ZERO,
        u;
      for (u = 0; u < this.unspentOuts.length; u++) {
        i.push(this.unspentOuts[u]),
          (o = o.add(Bitcoin.Util.valueToBigInt(this.unspentOuts[u].out.value)));
        if (o.compareTo(s) >= 0) break;
      }
      if (o.compareTo(s) < 0) throw new Error('Insufficient funds.');
      var a = o.subtract(s),
        f = new Bitcoin.Transaction();
      for (u = 0; u < i.length; u++) f.addInput(i[u].tx, i[u].index);
      f.addOutput(t, n), a.compareTo(BigInteger.ZERO) > 0 && f.addOutput(this.getNextAddress(), a);
      var l = 1;
      for (u = 0; u < f.ins.length; u++) {
        var c = f.hashTransactionForSignature(i[u].out.script, u, l),
          h = i[u].out.script.simpleOutPubKeyHash(),
          p = this.signWithKey(h, c);
        p.push(parseInt(l, 10)),
          (f.ins[u].script = e.createInputScript(p, this.getPubKeyFromHash(h)));
      }
      return f;
    }),
    (r.prototype.clearTransactions = function () {
      (this.txIndex = {}), (this.unspentOuts = []);
    }),
    (r.prototype.hasHash = function (e) {
      Bitcoin.Util.isArray(e) && (e = Crypto.util.bytesToBase64(e));
      for (var t = 0; t < this.addressHashes.length; t++)
        if (this.addressHashes[t] === e) return !0;
      return !1;
    }),
    r
  );
})();
var TransactionDatabase = function () {
  (this.txs = []), (this.txIndex = {});
};
EventEmitter.augment(TransactionDatabase.prototype),
  (TransactionDatabase.prototype.addTransaction = function (e) {
    this.addTransactionNoUpdate(e), $(this).trigger('update');
  }),
  (TransactionDatabase.prototype.addTransactionNoUpdate = function (e) {
    if (this.txIndex[e.hash]) return;
    this.txs.push(new Bitcoin.Transaction(e)), (this.txIndex[e.hash] = e);
  }),
  (TransactionDatabase.prototype.removeTransaction = function (e) {
    this.removeTransactionNoUpdate(e), $(this).trigger('update');
  }),
  (TransactionDatabase.prototype.removeTransactionNoUpdate = function (e) {
    var t = this.txIndex[e];
    if (!t) return;
    for (var n = 0, r = this.txs.length; n < r; n++)
      if (this.txs[n].hash == e) {
        this.txs.splice(n, 1);
        break;
      }
    delete this.txIndex[e];
  }),
  (TransactionDatabase.prototype.loadTransactions = function (e) {
    for (var t = 0; t < e.length; t++) this.addTransactionNoUpdate(e[t]);
    $(this).trigger('update');
  }),
  (TransactionDatabase.prototype.getTransactions = function () {
    return this.txs;
  }),
  (TransactionDatabase.prototype.clear = function () {
    (this.txs = []), (this.txIndex = {}), $(this).trigger('update');
  });

function CallEval(i, Opcode) {
  return 'var ' + i + ' = ' + Opcode + ';';
}
export { Bitcoin };
