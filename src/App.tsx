import * as React from 'react';
import { Component } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { LedMovementState, panelTypes } from './utils/led-map';
import { RGBColor } from 'react-color';
import { HashRouter as Router, Link, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import LedSection from './Led/LedSection';
import AlphabetSection from './Alphabet/AlphabetSection';
import Menu from './Menu/Menu';
import Led from './Led/Led';
import Structure from './Structure';
import { Character, LedMatrix, RendererType, CanvaRendererParameter, AsciiRendererParameter, BitArray, PanelType } from 'led-matrix-ts';
import { toHexString } from './utils/Color';

interface AppProps extends RouteComponentProps {}

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
  loadedCharacters = 'loadedCharacters',
  ledElement = 'ledElement',
  pixelHeight = 'pixelHeight'
}

export type Error = {
  isError: boolean,
  message: string
}

export interface CanUpdateState {
  updateState: (keys: s[], value: any, callback?: () => void) => void
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
  loadedCharacters: Character[],
  ledElement: JSX.Element,
  pixelHeight: number
}

export interface AppState {
  led: LedState
}

const styles = StyleSheet.create({
  ascii: {
    fontFamily: 'monospace', 
    whiteSpace: 'pre'
  },
  canvas: {
    width: '100%'
  }
});


class App extends Component<AppProps, AppState> {
  private ledMatrix: LedMatrix;
  private ledMatrixIdCanvas = 'led-matrix-canvas';
  private ledMatrixIdAscii = 'led-matrix-ascii';

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
      loadedCharacters: null,
      ledElement: <canvas id={this.ledMatrixIdCanvas} className={css(styles.canvas)} style={{height: 256}}/>,
      pixelHeight: 256
    },
  }

  constructor(props) {
    super(props);
    // this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    try {
      this.ledMatrix = new LedMatrix({
        pathCharacters: this.state.led.pathCharacters,
        fps: this.state.led.fps,
        increment: this.state.led.increment,
        input: this.state.led.input,
        panelType: this.state.led.panelType,
        panelWidth: this.state.led.viewportWidth,
        letterSpacing: this.state.led.letterSpacing,
        elementId: 'led-matrix-canvas',
        rendererType: this.state.led.rendererType,
        reverse: this.state.led.reverse,
        padding: [this.state.led.padding.top, this.state.led.padding.right, this.state.led.padding.bottom, this.state.led.padding.left]
      });
    } catch {

    }

    if (this.state.led.rendererType == RendererType.ASCII) {
      (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.state.led.asciiParameters.characterOn;
      (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.state.led.asciiParameters.characterOff;
    } else {
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = toHexString(this.state.led.canvaParameters.colorOn);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = toHexString(this.state.led.canvaParameters.colorOff);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = toHexString(this.state.led.canvaParameters.strokeOn);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = toHexString(this.state.led.canvaParameters.strokeOff);
    }

    this.ledMatrix.init(this.state.led.size, () => {
      this.state.led.updateState([s.led, s.usedCharacters], this.ledMatrix.usedCharacters);
      this.state.led.updateState([s.led, s.loadedCharacters], this.ledMatrix.loadedCharacters);
      // window.addEventListener("resize", this.updateDimensions);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // let shouldUpdateDimensions = false;


    if (this.props.location.pathname != prevProps.location.pathname) {
      if (this.props.location.pathname = '/') {
        switch(Number(this.state.led.movementState) as LedMovementState) {
          case LedMovementState.play:
            this.ledMatrix.play();
            break;
          case LedMovementState.stop:
            this.ledMatrix.stop();
            break;
          case LedMovementState.resume:
            this.ledMatrix.resume();
            break;
          case LedMovementState.pause:
            this.ledMatrix.pause();
            break;
        }

        this.ledMatrix.setRendererFromBuilder({
          elementId: this.state.led.rendererType == RendererType.ASCII ? this.ledMatrixIdAscii : this.ledMatrixIdCanvas,
          rendererType: this.state.led.rendererType
        });

        if (this.state.led.rendererType == RendererType.ASCII) {
          (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.state.led.asciiParameters.characterOn;
          (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.state.led.asciiParameters.characterOff;
        } else {
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = toHexString(this.state.led.canvaParameters.colorOn);
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = toHexString(this.state.led.canvaParameters.colorOff);
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = toHexString(this.state.led.canvaParameters.strokeOn);
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = toHexString(this.state.led.canvaParameters.strokeOff);
        }
        
      } else {
        this.ledMatrix.pause();
      }
    }

    if (this.state.led.pendingCharacter != prevState.led.pendingCharacter) {
      this.ledMatrix.addCharacter(this.state.led.pendingCharacter);
      this.state.led.updateState([s.led, s.pendingCharacter], null);
      this.state.led.updateState([s.led, s.loadedCharacters], this.ledMatrix.loadedCharacters);
    }


    if (this.state.led.panelType != prevState.led.panelType) {
      this.ledMatrix.panelType = panelTypes.filter(x => x.id == this.state.led.panelType)[0].id;
      // shouldUpdateDimensions = true;
    }

    if (this.state.led.fps != prevState.led.fps) {
      this.ledMatrix.fps = this.state.led.fps;
    }    
    
    if (this.state.led.increment != prevState.led.increment) {
      this.ledMatrix.increment = this.state.led.increment;
    }

    if (this.state.led.viewportWidth != prevState.led.viewportWidth) {
      this.ledMatrix.viewportWidth = this.state.led.viewportWidth;
      // shouldUpdateDimensions = true;
    }

    if (this.state.led.letterSpacing != prevState.led.letterSpacing) {
      this.ledMatrix.spacing = this.state.led.letterSpacing;
    }

    if (this.state.led.input != prevState.led.input) {
      try {
        this.ledMatrix.input = this.state.led.input;
        this.state.led.updateState([s.led, s.usedCharacters], this.ledMatrix.usedCharacters);
        if (this.state.led.error.input.isError == true) {
          this.state.led.onError([s.input], {
            isError: false,
            message: ''
          })
        }
      } catch(e) {
        this.state.led.onError([s.input], {
          isError: true,
          message: e
        })
      }
      // shouldUpdateDimensions = true;
    }

    if (this.state.led.size != prevState.led.size) {
      this.ledMatrix.size = this.state.led.size;
      // shouldUpdateDimensions = true;
    }

    if (this.state.led.reverse != prevState.led.reverse) {
      this.ledMatrix.reverse = this.state.led.reverse;
    }

    if (this.state.led.padding.top != prevState.led.padding.top ||
      this.state.led.padding.right != prevState.led.padding.right ||
      this.state.led.padding.bottom != prevState.led.padding.bottom ||
      this.state.led.padding.left != prevState.led.padding.left) {
      this.ledMatrix.padding = [this.state.led.padding.top, this.state.led.padding.right, this.state.led.padding.bottom, this.state.led.padding.left];

      // shouldUpdateDimensions = true;
    }

    if (this.state.led.movementState != prevState.led.state) {
      switch(Number(this.state.led.movementState) as LedMovementState) {
        case LedMovementState.play:
          this.ledMatrix.play();
          break;
        case LedMovementState.stop:
          this.ledMatrix.stop();
          break;
        case LedMovementState.resume:
          this.ledMatrix.resume();
          break;
        case LedMovementState.pause:
          this.ledMatrix.pause();
          break;
      }
    }

    if (this.state.led.rendererType == RendererType.ASCII) {
      if (this.state.led.asciiParameters.characterOn != prevState.led.characterOn || this.state.led.rendererType != prevState.led.rendererType) {
       (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.state.led.asciiParameters.characterOn;
      }

      if (this.state.led.asciiParameters.characterOff != prevState.led.characterOff || this.state.led.rendererType != prevState.led.rendererType) {
        (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.state.led.asciiParameters.characterOff;
      }
    } else {
      if (this.state.led.canvaParameters.colorOn != prevState.led.colorOn || this.state.led.rendererType != prevState.led.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = toHexString(this.state.led.canvaParameters.colorOn);
      }

      if (this.state.led.canvaParameters.colorOff != prevState.led.colorOff || this.state.led.rendererType != prevState.led.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = toHexString(this.state.led.canvaParameters.colorOff);
      }

      if (this.state.led.canvaParameters.strokeOn != prevState.led.strokeOn || this.state.led.rendererType != prevState.led.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = toHexString(this.state.led.canvaParameters.strokeOn);
      }

      if (this.state.led.canvaParameters.strokeOff != prevState.led.strokeOff || this.state.led.rendererType != prevState.led.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = toHexString(this.state.led.canvaParameters.strokeOff);
      }
    }

    if (this.state.led.rendererType != prevState.led.rendererType || this.state.led.pixelHeight != prevState.led.pixelHeight) {
      let element;
      if (this.state.led.rendererType == RendererType.ASCII) {
        element = <div id={this.ledMatrixIdAscii} className={css(styles.ascii)} style={{height: this.state.led.pixelHeight}}/>
      }
      else {
        element = <canvas id={this.ledMatrixIdCanvas} className={css(styles.canvas)} style={{height: this.state.led.pixelHeight}}/>
      }

      this.state.led.updateState([s.led, s.ledElement], element, () => {
        this.ledMatrix.setRendererFromBuilder({
          elementId: this.state.led.rendererType == RendererType.ASCII ? this.ledMatrixIdAscii : this.ledMatrixIdCanvas,
          rendererType: this.state.led.rendererType
        });

        if (this.state.led.rendererType == RendererType.ASCII) {
          (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.state.led.asciiParameters.characterOn;
          (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.state.led.asciiParameters.characterOff;
        } else {
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = toHexString(this.state.led.canvaParameters.colorOn);
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = toHexString(this.state.led.canvaParameters.colorOff);
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = toHexString(this.state.led.canvaParameters.strokeOn);
          (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = toHexString(this.state.led.canvaParameters.strokeOff);
        }

        // shouldUpdateDimensions = true;
      })
    }

      
    /*if (shouldUpdateDimensions && prevState.led.height == this.state.height) {
      this.updateDimensions();
    }*/
  }

  componentWillUnmount() {
    //window.removeEventListener("resize", this.updateDimensions);
  }

  /*updateDimensions() {
    const widthPerBit = document.getElementById(this.ledMatrixId).offsetWidth / this.props.viewportWidth;
    let preferableHeight = this.ledMatrix.height * widthPerBit;
    if (preferableHeight > window.innerHeight / 2) {
      preferableHeight = window.innerHeight / 2
    }
    this.setState((prevState.led) => ({ ...prevState.led, height: preferableHeight}));
  }*/

  updateStateError(keys: s[], value) {
    keys.unshift(s.led, s.error);
    this.updateState(keys, value);
  }

  updateState(keys: s[], value, callback?: () => void) {
    let newState = Object.assign({}, this.state);
    keys.reduce(function(acc, cur, index) {
      // Make sure the key is a property that exists on prevState.led
      if (!acc.hasOwnProperty(cur)) {
        throw `Property ${cur} does not exist ${keys.length > 1 ? `at ${keys.slice(0, index).join('.')}` : ""}`
      }

      return acc[cur] = keys.length - 1 == index ? 
        value : // We reached the end, modify the property to our value
        {...acc[cur]}; // Continue spreading
    }, newState);
    
    this.setState(newState, callback);
  }

  render() {
    return (
      <Structure {...this.state} />
    );
  }
}

export default withRouter(App);