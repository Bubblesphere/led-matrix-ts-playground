import * as React from 'react';
import { Component } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType } from 'led-matrix-ts';
import { LedMovementState } from './utils/led-map';
import { RGBColor } from 'react-color';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import LedSection from './Led/LedSection';
import AlphabetSection from './Alphabet/AlphabetSection';
import Menu from './Menu/Menu';
import Led from './Led/Led';
import Structure from './Structure';
import { Character } from 'led-matrix-ts';

interface AppProps {}

export enum s {
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
  pathCharacters = 'pathCharacters',
  rendererType = 'rendererType',
  reverse = 'reverse',
  size = 'size',
  letterSpacing = 'letterSpacing',
  movementState = 'movementState',
  viewportWidth = 'viewportWidth',
  error = 'error',
  isError = 'isError',
  message = 'message',
  pendingCharacter = 'pendingCharacter',
  usedCharacters = 'usedCharacters',
  loadedCharacters = 'loadedCharacters'
}

export type Error = {
  isError: boolean,
  message: string
}

export interface CanUpdateState {
  updateState: (keys: s[], value: any) => void
}

export interface LedMovement {
  movementState: LedMovementState
}

export interface CanUpdateStateErrors {
  onError: (keys: s[], value: any) => void,
  error: {
    input: Error
  }
}

export interface LedInput {
  input: string
}

export interface LedState extends CanUpdateState, CanUpdateStateErrors, LedMovement, LedInput, LedInput {
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
  padding: {
    bottom: number,
    left: number
    right: number,
    top: number,
  },
  panelType: PanelType,
  pathCharacters: string,
  rendererType: RendererType,
  reverse: boolean,
  size: number,
  letterSpacing: number,
  viewportWidth: number,
  pendingCharacter: Character,
  usedCharacters: Character[],
  loadedCharacters: Character[]
}

export interface AppState {
  led: LedState
}

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
      pathCharacters: `${process.env.PUBLIC_URL}/alphabet.json`,
      rendererType: RendererType.CanvasSquare,
      reverse: false,
      size: 1,
      letterSpacing: 1,
      movementState: LedMovementState.play,
      viewportWidth: 50,
      updateState: this.updateState.bind(this),
      onError: this.updateStateError.bind(this),
      error: {
        input: {
          isError: false,
          message: ''
        }
      },
      pendingCharacter: null,
      usedCharacters: null,
      loadedCharacters: null
    },
  }

  constructor(props) {
    super(props);
  }

  updateStateError(keys: s[], value) {
    keys.unshift(s.led, s.error);
    this.updateState(keys, value);
  }

  updateState(keys: s[], value) {
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
      <Router>
        <Structure {...this.state} />
      </Router>
    );
  }
}

export default App;