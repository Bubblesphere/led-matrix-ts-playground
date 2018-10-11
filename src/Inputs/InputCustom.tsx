import * as React from 'react'
import { Input } from '@material-ui/core';
import { InputProps } from './Inputs';

interface InputCustomProps {
  value: string,
};

const InputCustom: React.SFC<InputCustomProps & InputProps> = (props) => {
  const validate = (value) => {
    return value;
  }

  const onChange = (e) => {
    const value = e.target.value;

    e.target.value = validate(value);

    if (value === e.target.value) {
      // A new valid value was inputed
      props.onInputCaptured(props.id, value);
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
  value: 'X',
  onInputCaptured: (value) => { console.log(value); }
}

export default InputCustom;