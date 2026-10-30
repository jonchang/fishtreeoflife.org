// Number formatting and URL helpers. The number formats reproduce what the
// Jekyll site's Rakefile (Ruby) and Liquid templates printed, so the ported
// pages show the same figures.

/** 31644 -> "31,644" (Rakefile fmt_int). */
export function fmtInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * A share as a whole percentage, never rounding a non-zero share down to 0%
 * or a partial one up to 100% (Rakefile fmt_pct).
 */
export function fmtPct(num: number, den: number): string {
  if (den === 0) return '';
  const pct = (100.0 * num) / den;
  if (num > 0 && pct < 0.5) return '<1%';
  if (num < den && pct >= 99.5) return '>99%';
  // Ruby's Float#round rounds half away from zero; pct is never negative.
  return `${Math.round(pct)}%`;
}

/** A diversification rate with two decimals, or "" if missing (Rakefile fmt_dr). */
export function fmtDr(x: number | string | undefined | null): string {
  return typeof x === 'number' && !Number.isNaN(x) ? rubyFixed(x, 2) : '';
}

/**
 * Ruby's format("%.<digits>f", x). Ruby's dtoa generates the digits in
 * floating point and, when the remainder is within rounding error of one
 * half, rounds half to even. So format("%.2f", 0.175) is "0.18" and
 * format("%.2f", 0.165) is "0.16", where JavaScript's toFixed gives "0.17" for
 * both. Mean rates stored with four decimals (0.1750) hit this case.
 */
export function rubyFixed(x: number, digits: number): string {
  if (!Number.isFinite(x)) return String(x);
  const sign = x < 0 || Object.is(x, -0) ? '-' : '';
  const v = Math.abs(x);
  if (v === 0) return sign + (0).toFixed(digits);

  // Decimal exponent: 10^k <= v < 10^(k+1).
  let k = Math.floor(Math.log10(v));
  if (10 ** k > v) k--;
  else if (10 ** (k + 1) <= v) k++;
  // Number of significant digits to generate.
  const ilim = digits + k + 1;
  // Outside the range of the quick path (tiny values, or more digits than a
  // double holds); not reached by the site's data.
  if (ilim <= 0 || ilim > 14 || k > 22 || k < -22) return sign + v.toFixed(digits);

  let d = k > 0 ? v / 10 ** k : k < 0 ? v * 10 ** -k : v;
  let ieps = 2;
  if (d < 1) {
    d *= 10;
    ieps++;
  }
  // Error bound of the floating-point digit generation, as in dtoa.c.
  let eps = (ieps * d + 7) * 2 ** -52;
  eps *= 10 ** (ilim - 1);

  let n = 0; // the generated digits as an integer
  let generated = 0;
  let bump = false;
  for (let i = 1; ; i++, d *= 10) {
    const digit = Math.trunc(d);
    d -= digit;
    n = n * 10 + digit;
    generated = i;
    if (d === 0 || i === ilim) {
      if (d > 0.5 + eps) bump = true;
      else if (d < 0.5 - eps) bump = false;
      else bump = digit % 2 === 1; // half to even
      break;
    }
  }
  n *= 10 ** (ilim - generated);
  if (bump) n += 10 ** (ilim - generated);

  const scale = 10 ** digits;
  const whole = Math.floor(n / scale);
  const frac = n - whole * scale;
  return digits > 0 ? `${sign}${whole}.${String(frac).padStart(digits, '0')}` : `${sign}${whole}`;
}

/**
 * Ruby's Float#round(digits) for digits >= 1: round half away from zero,
 * with a correction for products like 0.5 * 10^digits that lose precision.
 */
export function rubyRound(x: number, digits: number): number {
  if (x === 0 || !Number.isFinite(x)) return x;
  const s = 10 ** digits;
  let f = Math.sign(x) * Math.round(Math.abs(x * s));
  if (x > 0) {
    if ((f + 0.5) / s <= x) f += 1;
  } else if ((f - 0.5) / s >= x) {
    f -= 1;
  }
  return f / s;
}

/** Ruby's Float#to_s: 1.0 rather than 1, and 5.0e-05 rather than 0.00005. */
export function rubyFloatToS(x: number): string {
  if (!Number.isFinite(x)) return Number.isNaN(x) ? 'NaN' : x > 0 ? 'Infinity' : '-Infinity';
  if (Number.isInteger(x) && Math.abs(x) < 1e16) return `${x}.0`;
  const a = Math.abs(x);
  if (a < 1e-4 || a >= 1e16) {
    const [mant = '', exp = '0'] = x.toExponential().split('e');
    const m = mant.includes('.') ? mant : `${mant}.0`;
    const e = Number(exp);
    return `${m}e${e < 0 ? '-' : '+'}${String(Math.abs(e)).padStart(2, '0')}`;
  }
  return String(x);
}

/**
 * Ruby's Array#sum over floats: Kahan-Babuska compensated summation. Means
 * computed with it match the Rakefile's to the last bit.
 */
export function rubySum(xs: readonly number[]): number {
  let f = 0;
  let c = 0;
  for (const x of xs) {
    const t = f + x;
    if (Math.abs(f) >= Math.abs(x)) c += f - t + x;
    else c += x - t + f;
    f = t;
  }
  return f + c;
}

/** Liquid's capitalize: first letter upper case, the rest lower case. */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Jekyll's slugify in "pretty" mode with case kept, which built the taxon
 * page URLs from the stub file names (Rakefile taxon_url):
 * "Incertae sedis in Carangaria" -> "Incertae-sedis-in-Carangaria".
 */
export function prettySlug(name: string): string {
  return name.replace(/[^\p{M}\p{L}\p{Nd}._~!$&'()+,;=@]+/gu, '-').replace(/^-|-$/g, '');
}

/**
 * Jekyll's default slugify (the Liquid `slugify` filter), which the taxon
 * pages used to link fossils: "Serrivomer sp." -> "serrivomer-sp".
 */
export function defaultSlug(name: string): string {
  return name
    .replace(/[^\p{M}\p{L}\p{Nd}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/** URL path of a taxon page, e.g. /taxonomy/order/Incertae-sedis-in-Carangaria/. */
export function taxonUrl(rank: string, name: string): string {
  return `/taxonomy/${rank}/${prettySlug(name)}/`;
}

/** URL path of a fossil page. */
export function fossilUrl(slug: string): string {
  return `/fossils/${slug}/`;
}

/**
 * Turns a site-relative file path from the data ("downloads/taxonomy/order/
 * Incertae sedis in Carangaria.tre") into an absolute URL path with each
 * segment percent-encoded ("/downloads/taxonomy/order/Incertae%20sedis%20in%20Carangaria.tre").
 */
export function filePath(relative: string): string {
  return '/' + relative.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
}
