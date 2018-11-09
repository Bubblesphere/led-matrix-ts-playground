import * as React from 'react'
import { InputProps } from './Inputs';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField'

interface TextFieldCustomProps extends InputProps {
};

const TextFieldCustom: React.SFC<TextFieldCustomProps & TextFieldProps> = (props) => {
  const handleChanges = (e) => {
    props.onInputCaptured(props.statePath, e.target.value);
  }
    
  const { statePath, onInputCaptured, ...textFieldProps} = props;
  return (
    <TextField
      {...textFieldProps}
      onChange={handleChanges}
    />
  )
}

export default TextFieldCustom;