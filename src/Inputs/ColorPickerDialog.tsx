import * as React from 'react';
import { IconButton } from '@material-ui/core';
import Lens from '@material-ui/icons/Lens';
import { InputProps } from './Inputs';
import {TwitterPicker, RGBColor, TwitterPickerProps} from 'react-color';
import { toHexString, toRgbString } from '../utils/Color';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  popup: {
    position:"absolute", 
    zIndex: 2
  },
  closer: {
    position: 'fixed', 
    top: 0, 
    right: 0, 
    bottom: 0, 
    left: 0,
  },
});

interface ColorPickerButtonState {}

interface ColorPickerButtonPropsOpt {
  rgbColors?: RGBColor[],
  columns?: number
}

interface ColorPickerButtonProps extends ColorPickerButtonPropsOpt, InputProps, TwitterPickerProps {
  id: string,
  defaultValue: RGBColor
}

class ColorPickerButton extends React.Component<ColorPickerButtonProps, ColorPickerButtonState> {
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
    const {id, defaultValue, statePath, onInputCaptured, ...colorPickerDialogProps} = this.props;
    return (
      <div id={this.props.id}>
          <IconButton onClick={this.handleClick}>
              <Lens style={{color: toRgbString(this.props.defaultValue)}} />
          </IconButton>
          { this.state.displayColorPicker ?
            (
              <div className={css(styles.popup)}>
                <div 
                  className={css(styles.closer)} 
                  onClick={this.handleClose} 
                />
                <TwitterPicker  
                  {...colorPickerDialogProps}
                  width={`${15 + 9 + (36 * this.props.columns)}px`} 
                  color={this.state.color} 
                  onChange={this.handleChange} 
                  colors={this.props.rgbColors.map(x => toHexString(x))} 
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

ColorPickerButton.defaultProps = {
  rgbColors: [
    { r: 26, g: 188, b: 156 } as RGBColor,
    { r: 46, g: 204, b: 113 } as RGBColor,
    { r: 52, g: 152, b: 219 } as RGBColor,
    { r: 155, g: 89, b: 182 } as RGBColor,
    { r: 52, g: 73, b: 94 } as RGBColor,
    { r: 22, g: 160, b: 133 } as RGBColor,
    { r: 39, g: 174, b: 96 } as RGBColor,
    { r: 41, g: 128, b: 185 } as RGBColor,
    { r: 142, g: 68, b: 173 } as RGBColor,
    { r: 44, g: 62, b: 80 } as RGBColor,
    { r: 241, g: 196, b: 15 } as RGBColor,
    { r: 230, g: 126, b: 34 } as RGBColor,
    { r: 231, g: 76, b: 60 } as RGBColor,
    { r: 236, g: 240, b: 241 } as RGBColor,
    { r: 149, g: 165, b: 166 } as RGBColor,
    { r: 243, g: 156, b: 18 } as RGBColor,
    { r: 211, g: 84, b: 0 } as RGBColor,
    { r: 192, g: 57, b: 43 } as RGBColor,
    { r: 189, g: 195, b: 199 } as RGBColor,
    { r: 127, g: 140, b: 141 } as RGBColor
  ],
  columns: 5
}

export default ColorPickerButton;