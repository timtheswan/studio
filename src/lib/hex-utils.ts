export interface Point {
  x: number;
  y: number;
}

export interface CubeCoords {
  q: number;
  r: number;
  s: number;
}

export interface OffsetCoords {
  col: number;
  row: number;
}

export const HEX_SIZE = 50; // pixels from center to a corner

export function hexToPixel(hex: CubeCoords): Point {
  const x = HEX_SIZE * (3 / 2 * hex.q);
  const y = HEX_SIZE * (Math.sqrt(3) / 2 * hex.q + Math.sqrt(3) * hex.r);
  return { x, y };
}

function hexRound(frac: CubeCoords): CubeCoords {
  let q = Math.round(frac.q);
  let r = Math.round(frac.r);
  let s = Math.round(frac.s);

  const q_diff = Math.abs(q - frac.q);
  const r_diff = Math.abs(r - frac.r);
  const s_diff = Math.abs(s - frac.s);

  if (q_diff > r_diff && q_diff > s_diff) {
    q = -r - s;
  } else if (r_diff > s_diff) {
    r = -q - s;
  } else {
    s = -q - r;
  }
  return { q, r, s };
}

export function pixelToCube(point: Point): CubeCoords {
  const q_frac = ((2 / 3 * point.x)) / HEX_SIZE;
  const r_frac = ((-1 / 3 * point.x + Math.sqrt(3) / 3 * point.y)) / HEX_SIZE;
  return hexRound({ q: q_frac, r: r_frac, s: -q_frac - r_frac });
}

export function cubeToOffset(cube: CubeCoords): OffsetCoords {
    const col = cube.q;
    const row = cube.r + (cube.q - (cube.q & 1)) / 2;
    return { col, row };
}

export function getHexCornerPoints(center: Point): string {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i;
        const angle_rad = Math.PI / 180 * angle_deg;
        points.push(
            `${center.x + HEX_SIZE * Math.cos(angle_rad)},${center.y + HEX_SIZE * Math.sin(angle_rad)}`
        );
    }
    return points.join(' ');
}
