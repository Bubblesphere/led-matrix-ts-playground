import * as React from 'react'
import { InputProps } from './Inputs';
import { Select } from '@material-ui/core';
import { SelectProps } from '@material-ui/core/Select';

interface SelectCustomProps extends InputProps {
  menuItems: JSX.Element[],
};

const SelectCustom: React.SFC<SelectCustomProps & SelectProps> = (props) => {
  const handleChanges = (e) => {
    return props.onInputCaptured(props.statePath, e.target.value);
  }
  
  return (
    <Select
      {...props}
      onChange={handleChanges}
    >
      {props.menuItems}
    </Select>
  )
}

export default SelectCustom;
