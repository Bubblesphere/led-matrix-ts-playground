import { PanelType } from 'led-matrix-ts';

export enum PlaybackMode {
  play,
  stop,
  pause,
  resume
}

export enum LedMatrixMode {
  NotLoaded,
  Loading,
  Loaded
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

