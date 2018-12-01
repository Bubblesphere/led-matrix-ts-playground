import { ScrollerTypes } from "led-matrix-ts";

export enum LedMatrixMode {
  NotLoaded,
  Loading,
  Loaded
}

export const scrollers = [
  {
    id: ScrollerTypes.Side,
    text: "Side"
  },
  {
    id: ScrollerTypes.Vertical,
    text: "Vertical"
  }
];
