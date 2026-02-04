declare module "jalaali-js" {
  export function toJalaali(
    y: number,
    m: number,
    d: number
  ): { jy: number; jm: number; jd: number };
  export function toGregorian(
    jy: number,
    jm: number,
    jd: number
  ): { gy: number; gm: number; gd: number };
}
