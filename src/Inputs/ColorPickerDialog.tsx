import * as React from 'react';
import { withStyles, Dialog, DialogTitle, IconButton } from '@material-ui/core';
import Lens from '@material-ui/icons/Lens';
import { InputProps } from './Inputs';
import {TwitterPicker, RGBColor} from 'react-color';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
  avatar: {
  },
};

interface ColorPickerButtonState {}

interface ColorPickerButtonPropsOpt {

}

interface ColorPickerButtonProps {
  defaultValue: RGBColor
}

class ColorPickerButton extends React.Component<ColorPickerButtonProps & InputProps, ColorPickerButtonState> {
    static defaultProps: ColorPickerButtonPropsOpt;

    state = {
        displayColorPicker: false,
        color: this.props.defaultValue,
    };
    
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
      this.setState({ color: color.rgb })
      this.props.onInputCaptured(this.props.statePath, color.rgb);
    };
  
    render() {
      return (
        <div>
            <IconButton onClick={this.handleClick}>
                <Lens style={{color:`rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`}}/>
            </IconButton>
            { this.state.displayColorPicker ?
              (
              <div style={{position:"absolute", zIndex: 2}}>
                <div style={{position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px',}} onClick={this.handleClose} />
                <TwitterPicker  
                  width={'168px'} 
                  color={this.state.color} 
                  onChange={this.handleChange} 
                  colors={['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#9900EF', '#9900EF']} 
                />
              </div>
              ) : (
              null
              )
            }
            
        </div>
      );
    }
  }

  export default ColorPickerButton;