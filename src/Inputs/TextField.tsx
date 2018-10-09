import * as React from 'react'
import { InputProps } from './Inputs';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField'

interface TextFieldCustomProps {
};

const TextFieldCustom: React.SFC<TextFieldCustomProps & InputProps & TextFieldProps> = (props) => {
  const handleChanges = (e) => {
    props.onInputCaptured(props.id, e.target.value == "" ? " " : e.target.value);
  }
    
  return (
    <TextField
      {...props}
      onChange={handleChanges}
    />
  )
}

export default TextFieldCustom;