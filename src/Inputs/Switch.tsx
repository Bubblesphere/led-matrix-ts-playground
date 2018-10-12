import * as React from 'react'
import { InputProps } from './Inputs';
import { Switch } from '@material-ui/core';
import { SwitchProps } from '@material-ui/core/Switch'

interface SwitchCustomProps extends InputProps {
};

const SwitchCustom: React.SFC<SwitchCustomProps & SwitchProps> = (props) => {
  const handleChanges = (e) => {
    props.onInputCaptured(props.statePath, e.target.checked);
  }
    
  return (
    <Switch
      {...props}
      onChange={handleChanges}
    />
  )
}

export default SwitchCustom;