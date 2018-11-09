import { bit } from "led-matrix-ts";

export const generate2dArrayOfOffBits = (m: number, n: number) => {
  return [...Array(m)].map(e => Array(n).fill(0));
}

export const generateArrayOfOffBits = (n: number) => {
  return Array(n).fill(0 as bit)
}