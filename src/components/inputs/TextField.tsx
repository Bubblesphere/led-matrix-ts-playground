import * as React from 'react'
import { InputProps } from './Inputs';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField'

interface TextFieldCustomProps extends InputProps {
};

const TextFieldCustom: React.SFC<TextFieldCustomProps & TextFieldProps> = (props) => {
  let typingTimer;              
  let doneTypingInterval = 200;

  const doneTyping = (value) => {
    props.onInputCaptured(props.statePath, value);
  }

  const onKeyUp = (e) => {
    const value = e.target.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      doneTyping(value);
    }, doneTypingInterval);   
  }
    
  const { statePath, onInputCaptured, ...textFieldProps} = props;
  return (
    <TextField
      {...textFieldProps}
      onKeyUp={onKeyUp}
    />
  )
}

export default TextFieldCustom;