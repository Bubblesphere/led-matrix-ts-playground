import { PanelType } from 'led-matrix-ts';

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
    id: 0,
    text: "ASCII"
  },
  {
    id: 1,
    text: "Canvas (Square)"
  },
  {
    id: 2,
    text: "Canvas (Circle)"
  }
]

export enum LedMovementState {
  play,
  stop,
  pause,
  resume
}