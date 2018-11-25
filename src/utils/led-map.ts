import { ScrollerTypes, RendererTypes } from "led-matrix-ts";

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


export const renderers = [
  {
    id: RendererTypes.ASCII,
    text: "ASCII"
  },
  {
    id: RendererTypes.CanvasSquare,
    text: "Canvas (Square)"
  },
  {
    id: RendererTypes.CanvasCircle,
    text: "Canvas (Circle)"
  }
]

