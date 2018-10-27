import { s } from "../App";

export interface InputProps {
  statePath: s[],
  onInputCaptured: (statePath: s[], value: any) => void
}