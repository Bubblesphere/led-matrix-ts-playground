import * as React from 'react'
import { Input } from '@material-ui/core';
import { InputProps } from './Inputs';
import { InputProps as MaterialInputProps } from '@material-ui/core/Input';


interface InputCustomPropsOpt {
  value?: string
}

interface InputCustomProps extends InputCustomPropsOpt, InputProps {
};

const InputCustom: React.SFC<InputCustomProps & MaterialInputProps> = (props) => {
  const validate = (value) => {
    return value;
  }

  const onChange = (e) => {
    const value = e.target.value;

    e.target.value = validate(value);

    if (value === e.target.value) {
      // A new valid value was inputed
      props.onInputCaptured(props.statePath, value);
    }
  };

  return (
   <Input
    id={props.id}
    type="text"
    defaultValue={validate(props.value)}
    onChange={onChange}
   />
  )
}

InputCustom.defaultProps = {
  value: 'X'
}

export default InputCustom;