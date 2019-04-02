export interface SteinhartCoefInfo {
  inputUnit: string;
  t1: number;
  t2: number;
  t3: number;
  rt1: number;
  rt2: number;
  rt3: number;
  a: number;
  b: number;
  c: number;
}

export function calculateTemperature(R_NTC: number, A: number, B: number, C: number): number {
  R_NTC = Math.log(R_NTC);
  let tempK = 1 / (A + (B + (C * R_NTC * R_NTC )) * R_NTC );
  return tempK - 273.15;     
}