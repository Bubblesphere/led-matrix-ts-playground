import { PanelFrame } from 'led-matrix-ts';

export interface Panel {}

export interface PanelProps {
  panelFrame: PanelFrame
}

export enum PanelTypes {
  Ascii,
  CanvasSquare,
  CanvasCircle
}

export const panels = [
  {
    id: PanelTypes.Ascii,
    text: "ASCII"
  },
  {
    id: PanelTypes.CanvasSquare,
    text: "Canvas (Square)"
  },
  {
    id: PanelTypes.CanvasCircle,
    text: "Canvas (Circle)"
  }
]
