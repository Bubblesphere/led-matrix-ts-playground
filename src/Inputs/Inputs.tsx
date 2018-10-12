import { p } from "../App";

export interface InputProps {
  id: string,
  statePath: p[],
  onInputCaptured: (statePath: p[], value: any) => void
}