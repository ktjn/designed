const HEX_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_PATTERN = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
const RGBA_PATTERN =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]|0?\.\d+)\s*\)$/i;
const HSL_PATTERN =
  /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function toHexByte(value: number): string {
  return clampByte(value).toString(16).padStart(2, "0");
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const sat = Math.min(100, Math.max(0, s)) / 100;
  const lightness = Math.min(100, Math.max(0, l)) / 100;

  const c = (1 - Math.abs(2 * lightness - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

export function isValidColor(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") return false;
  return (
    HEX_PATTERN.test(trimmed) ||
    RGB_PATTERN.test(trimmed) ||
    RGBA_PATTERN.test(trimmed) ||
    HSL_PATTERN.test(trimmed)
  );
}

export function normalizeToHex(value: string): string | null {
  const trimmed = value.trim();

  if (HEX_PATTERN.test(trimmed)) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return `#${hex
        .split("")
        .map((char) => char + char)
        .join("")
        .toLowerCase()}`;
    }
    return `#${hex.toLowerCase()}`;
  }

  const rgbMatch = trimmed.match(RGB_PATTERN);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `#${toHexByte(Number(r))}${toHexByte(Number(g))}${toHexByte(
      Number(b),
    )}`;
  }

  const rgbaMatch = trimmed.match(RGBA_PATTERN);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const alphaByte = toHexByte(Number(a) * 255);
    return `#${toHexByte(Number(r))}${toHexByte(Number(g))}${toHexByte(
      Number(b),
    )}${alphaByte}`;
  }

  const hslMatch = trimmed.match(HSL_PATTERN);
  if (hslMatch) {
    const [, h, s, l] = hslMatch;
    const [r, g, b] = hslToRgb(Number(h), Number(s), Number(l));
    return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
  }

  return null;
}
