import * as React from 'react'
import { InputProps } from './Inputs';
import { Select } from '@material-ui/core';
import { SelectProps } from '@material-ui/core/Select';
import { MenuItem } from 'material-ui';

interface SelectCustomProps extends InputProps {
  menuItems: React.ReactElement<MenuItem>[],
};

const SelectCustom: React.SFC<SelectCustomProps & SelectProps> = (props) => {
  const handleChanges = (e) => {
    return props.onInputCaptured(props.statePath, e.target.value);
  }
  
  const {menuItems, statePath, onInputCaptured, ...selectProps} = props;
  return (
    <Select
      {...selectProps}
      onChange={handleChanges}
    >
      {props.menuItems}
    </Select>
  )
}

export default SelectCustom;
