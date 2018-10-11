import * as React from 'react';
import { Component } from 'react';
import ConfigurationSection from './Led/ConfigurationSection';
import DisplaySection from './Led/DisplaySection';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType } from 'led-matrix-ts';
import { LedMovementState } from './Led/LedMatrix/led-map';
import { RGBColor } from 'react-color';

interface AppProps {}

export enum p {
  led = 'led',
  asciiParameters = 'asciiParameters',
  characterOff = 'characterOff',
  characterOn = 'characterOn',
  canvaParameters = 'canvaParameters',
  colorOff = 'colorOff',
  colorOn = 'colorOn',
  strokeOff = 'strokeOff',
  strokeOn = 'strokeOn',
  fps = 'fps',
  increment = 'increment',
  input = 'input',
  padding = 'padding',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
  top = 'top',
  panelType = 'panelType',
  pathToCharacters = 'pathToCharacters',
  rendererType = 'rendererType',
  reverse = 'reverse',
  size = 'size',
  spacing = 'spacing',
  state = 'state',
  width = 'width',
}

interface AppState {
  led: {
    asciiParameters: {
      characterOff: string,
      characterOn: string,
    },
    canvaParameters: {
      colorOff: RGBColor,
      colorOn: RGBColor,
      strokeOff: RGBColor,
      strokeOn: RGBColor,
    },
    fps: number,
    increment: number,
    input: string,
    padding: {
      bottom: number,
      left: number
      right: number,
      top: number,
    },
    panelType: PanelType,
    pathToCharacters: string,
    rendererType: RendererType,
    reverse: boolean,
    size: number,
    spacing: number,
    state: LedMovementState,
    width: number,
  }
}

const appStyles = StyleSheet.create({
  app: {
    margin: 0,
    minHeight: '100vh',
    width: '100%'
  },
  centeredVertical: {
    alignSelf: 'center'
  },
});

class App extends Component<AppProps, AppState> {
  state = {
    led: {
      asciiParameters: {
        characterOff: ' ',
        characterOn: 'X',
      },
      canvaParameters: {
        colorOff: { r: 44, g: 62, b: 80, a: 1} as RGBColor,
        colorOn: { r: 39, g: 174, b: 96, a: 1} as RGBColor,      
        strokeOff: { r: 52, g: 73, b: 94, a: 1} as RGBColor,
        strokeOn: { r: 46, g: 204, b: 113, a: 1} as RGBColor,
      },
      fps: 25,
      increment: 1,
      input: 'Test',
      padding: {
        bottom: 1,
        left: 1,
        right: 15,
        top: 1
      },
      panelType: PanelType.SideScrollingPanel,
      pathToCharacters: `${process.env.PUBLIC_URL}/alphabet.json`,
      rendererType: RendererType.CanvasSquare,
      reverse: false,
      size: 1,
      spacing: 1,
      state: LedMovementState.play,
      width: 50,
    }
  }

  constructor(props) {
    super(props);
    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChanges(keys: p[], value) {
    let newState = Object.assign({}, this.state);
    keys.reduce(function(acc, cur, index) {
      // Make sure the key is a property that exists on prevState
      if (!acc.hasOwnProperty(cur)) {
        throw `Property ${cur} does not exist ${keys.length > 1 ? `at ${keys.slice(0, index).join('.')}` : ""}`
      }

      return acc[cur] = keys.length - 1 == index ? 
        value : // We reached the end, modify the property to our value
        {...acc[cur]}; // Continue spreading
    }, newState);
    
    this.setState(newState);
  }

  render() {
    return (
        <Grid container={true} spacing={24} className={css(appStyles.app)}>
          <ConfigurationSection 
            profile={{
              onChange: this.handleChanges, 
              ...this.state.led
            }}
          />
          <DisplaySection 
            led={{
              onChange: this.handleChanges, 
              ...this.state.led
            }}
          />
        </Grid>
    );
  }
}

export default App;
