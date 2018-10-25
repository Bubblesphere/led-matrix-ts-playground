import * as React from 'react';
import { Component } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType } from 'led-matrix-ts';
import { LedMovementState } from './utils/led-map';
import { RGBColor } from 'react-color';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import LedSection from './Led/LedSection';
import Menu from './Menu/Menu';
import Led from './Led/Led';

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
  pathCharacters = 'pathCharacters',
  rendererType = 'rendererType',
  reverse = 'reverse',
  size = 'size',
  letterSpacing = 'letterSpacing',
  movementState = 'movementState',
  viewportWidth = 'viewportWidth',
  error = 'error',
  isError = 'isError',
  message = 'message'
}

export type Error = {
  isError: boolean,
  message: string
}

export interface LedChangeable {
  onChange: (keys: p[], value: any) => void
}

export interface LedMovement {
  movementState: LedMovementState
}

export interface LedError {
  onError: (keys: p[], value: any) => void,
  error: {
    input: Error
  }
}

export interface LedInput {
  input: string
}

export interface LedState extends LedChangeable, LedMovement, LedInput, LedError, LedInput {
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
}

export interface AppState {
  led: LedState
}

const appStyles = StyleSheet.create({
  app: {
    margin: 0,
    flexFlow: "column",
    height: '100vh',
    width: '100%'
  },
  menu: {
    flex: '0 1 64px',
    background: '#444',
    color: '#bbb',
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
      pathCharacters: `${process.env.PUBLIC_URL}/alphabet.json`,
      rendererType: RendererType.CanvasSquare,
      reverse: false,
      size: 1,
      letterSpacing: 1,
      movementState: LedMovementState.play,
      viewportWidth: 50,
      onChange: this.handleChanges.bind(this),
      onError: this.handleChangesError.bind(this),
      error: {
        input: {
          isError: false,
          message: ''
        }
      }
    },
  }

  constructor(props) {
    super(props);
    this.renderLed = this.renderLed.bind(this);
    this.renderAlphabet = this.renderAlphabet.bind(this);
    this.renderFullscreen = this.renderFullscreen.bind(this);
    this.renderNotFullscreen = this.renderNotFullscreen.bind(this);
  }

  handleChangesError(keys: p[], value) {
    keys.unshift(p.led, p.error);
    this.handleChanges(keys, value);
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

  renderLed() {
    return (
      <LedSection {...this.state.led} />
    );
  }

  renderAlphabet() {
    return (
      <h1>Welcome</h1>
    );
  }

  renderFullscreen() {
    return (
      <Grid item container direction="column" className={css(appStyles.app)} alignItems="center" justify="center" alignContent="center">
        <Led {...this.state.led} />
      </Grid>
    );
  }

  renderNotFullscreen() {
    return (
      <Grid item container direction="column" className={css(appStyles.app)}>
        <Grid container item xs={12} className={css(appStyles.menu)}>
          <Menu />
        </Grid>
        <Grid container item xs={12}>
          <Route exact path="/" render={this.renderLed}/>
          <Route exact path="/alphabet" render={this.renderAlphabet} />
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Router>
        <Grid container>
          <Route exact path="/fullscreen" render={this.renderFullscreen}/>
          <Route exact path="/" render={this.renderNotFullscreen} />
        </Grid>
      </Router>
    );
  }
}

export default App;