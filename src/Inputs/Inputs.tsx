import { p } from "../App";

export interface InputProps {
  statePath: p[],
  onInputCaptured: (statePath: p[], value: any) => void
}