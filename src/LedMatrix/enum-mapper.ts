import { PanelType } from 'led-matrix-ts';

export enum LedMovementState {
  play,
  stop,
  pause,
  resume,
  seek
}

export enum Renderers {
  ASCII,
  CanvasSquare,
  CanvasCircle
}

export const panelTypes = [
  {
    id: PanelType.SideScrollingPanel,
    text: "Side"
  },
  {
    id: PanelType.VerticalScrollingPanel,
    text: "Vertical"
  }
];

export const renderers = [
  {
    id: Renderers.ASCII,
    text: "ASCII"
  },
  {
    id: Renderers.CanvasSquare,
    text: "Canvas (Square)"
  },
  {
    id: Renderers.CanvasCircle,
    text: "Canvas (Circle)"
  }
]

