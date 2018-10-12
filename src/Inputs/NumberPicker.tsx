import * as React from 'react'
import { TextField } from '@material-ui/core';
import { InputProps } from './Inputs';
import { TextFieldProps } from 'material-ui';

interface NumberPickerPropsOpt {
  value?: number,
  min?: number,
  max?: number,
}

interface NumberPickerProps extends NumberPickerPropsOpt, InputProps {
  id: string,
  label: string,
};

const NumberPicker: React.SFC<NumberPickerProps & TextFieldProps> = (props) => {
  const validate = (value) => {
    if (value < props.min) {
      return props.min;
    }

    if (value > props.max) {
      return props.max;
    }

    return value;
  }

  const onChange = (e) => {
    const value = Number(e.target.value);

    e.target.value = validate(value);

    if (value === e.target.value) {
      // A new valid value was inputed
      props.onInputCaptured(props.statePath, value);
    }
  };

  return (
   <TextField
    id={props.id}
    label={props.label}
    helperText={`Value must be between ${props.min} and ${props.max}`}
    type="number"
    defaultValue={validate(props.value)}
    onChange={onChange}
   />
  )
}

NumberPicker.defaultProps = {
  value: 50,
  min: 0,
  max: 100
}

export default NumberPicker;