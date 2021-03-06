import * as React from 'react'
import { InputProps } from './Inputs';
import { IconButton } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton'

interface IconButtonCustomProps extends InputProps {
};

const IconButtonCustom: React.SFC<IconButtonCustomProps & IconButtonProps> = (props) => {
  const handleChanges = (e) => {
    props.onInputCaptured(props.statePath, e.currentTarget.value);
  }
    
  const { statePath, onInputCaptured, ...iconButtonProps} = props;
  return (
    <IconButton
      {...iconButtonProps}
      onClick={handleChanges}
    />
  )
}

export default IconButtonCustom;