import * as React from 'react';
import { Component } from 'react';
import { LedMatrixMode, PlaybackMode } from './utils/led-map';
import { RGBColor } from 'react-color';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import Structure from './sections/Structure';
import { 
  RendererTypes, 
  PanelFrame, 
  Scroller, 
  LedMatrixPlayer, 
  LedMatrix, 
  Character, 
  BitArray, 
  CharactersJSON, 
  AsciiRendererParameter, 
  CanvasRendererParameter, 
  ScrollerBuilder, 
  ScrollerTypes,
  RendererBuilder,
  Sequence
} from 'led-matrix-ts';
import { toHexString } from './utils/color';
import { updateState } from './utils/state';

interface AppProps extends RouteComponentProps { }

export enum s {
  ledSettings = 'ledSettings',
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
  scrollerType = 'scrollerType',
  rendererType = 'rendererType',
  reverse = 'reverse',
  size = 'size',
  letterSpacing = 'letterSpacing',
  viewportWidth = 'viewportWidth',
  errors = 'errors',
  isError = 'isError',
  message = 'message',
  pendingCharacter = 'pendingCharacter',
  pendingEditCharacter = 'pendingEditCharacter',
  pendingDeleteCharacter = 'pendingDeleteCharacter',
  usedCharacters = 'usedCharacters',
  loadedCharacters = 'loadedCharacters',
  height = 'height',
  onRendererElementReady = 'onRendererElementReady',
  ledMatrixMode = 'ledMatrixMode',
  playbackMode = 'playbackMode'
}

export interface AppState extends CanUpdateState, CanUpdateStateErrors {
  ledSettings: LedSettingsState,
  errors: AppErrors
  ledMatrixMode: LedMatrixMode,
  playbackMode: PlaybackMode,
  pendingCharacter: Character
  pendingEditCharacter: Character
  pendingDeleteCharacter: Character
  usedCharacters: Character[]
  height: number
  onRendererChanged: () => void
}

export interface LedSettingsState {
  sequence: PanelFrame[],
  fps: number
  asciiParameters: {
    characterOff: string
    characterOn: string
  },
  canvaParameters: {
    colorOff: RGBColor
    colorOn: RGBColor
    strokeOff: RGBColor
    strokeOn: RGBColor
  },
  rendererType: RendererTypes
  increment: number
  padding: {
    bottom: number
    left: number
    right: number
    top: number
  },
  scrollerType: ScrollerTypes
  reverse: boolean
  size: number
  letterSpacing: number
  viewportWidth: number
  loadedCharacters: Character[],
  input: string,
}

export interface AppErrors {
  input: Error,
  pendingCharacter: Error
  pendingEditCharacter: Error,
  pendingDeleteCharacter: Error
}

export type Error = {
  isError: boolean,
  message: string
}

export interface CanUpdateState {
  updateState: (keys: s[], value: any, callback?: () => void) => void
}

export interface CanUpdateStateErrors {
  updateStateError: (keys: s[], value: any) => void,
}


class App extends Component<AppProps, AppState> {
  private ledMatrix: LedMatrix;
  private ledMatrixPlayer: LedMatrixPlayer;
  private ledMatrixId = 'led-matrix';

  private getLedSettingsFromLocalStorage(): LedSettingsState {
    const settings = JSON.parse(localStorage.getItem('ledSettings'));
    const loadedCharacters = settings.loadedCharacters.map(x => new Character(x.pattern, new BitArray(x.output), x.width))
    return {
      ...settings,
      loadedCharacters: loadedCharacters
    }
  }

  state = {
    ledSettings: localStorage.getItem('ledSettings') ?
      this.getLedSettingsFromLocalStorage() : {
        asciiParameters: {
          characterOff: ' ',
          characterOn: 'X',
        },
        canvaParameters: {
          colorOff: { r: 44, g: 62, b: 80, a: 1 } as RGBColor,
          colorOn: { r: 39, g: 174, b: 96, a: 1 } as RGBColor,
          strokeOff: { r: 52, g: 73, b: 94, a: 1 } as RGBColor,
          strokeOn: { r: 46, g: 204, b: 113, a: 1 } as RGBColor,
        },
        fps: 25,
        increment: 1,
        input: 'test',
        padding: {
          bottom: 1,
          left: 1,
          right: 15,
          top: 1
        },
        scrollerType: ScrollerTypes.Side,
        rendererType: RendererTypes.CanvasSquare,
        reverse: false,
        size: 1,
        letterSpacing: 1,
        viewportWidth: 50,
        loadedCharacters: null,
        sequence: null
      },
    errors: {
      input: {
        isError: false,
        message: ''
      },
      pendingCharacter: {
        isError: false,
        message: ''
      },
      pendingEditCharacter: {
        isError: false,
        message: ''
      },
      pendingDeleteCharacter: {
        isError: false,
        message: ''
      }
    },
    ledMatrixMode: LedMatrixMode.NotLoaded,
    playbackMode: PlaybackMode.play,
    pendingCharacter: null,
    pendingEditCharacter: null,
    pendingDeleteCharacter: null,
    usedCharacters: null,
    height: 8,
    onRendererChanged: this.onRendererChanged.bind(this),
    updateState: this.updateState.bind(this),
    updateStateError: this.updateStateError.bind(this),
  }

  constructor(props) {
    super(props);
    this.setCharacterBitOff = this.setCharacterBitOff.bind(this);
    this.setCharacterBitOn = this.setCharacterBitOn.bind(this);
    this.setColorBitOff = this.setColorBitOff.bind(this);
    this.setColorStrokeOff = this.setColorStrokeOff.bind(this);
    this.setColorStrokeOn = this.setColorStrokeOn.bind(this);
    this.setFps = this.setFps.bind(this);
    this.setIncrement = this.setIncrement.bind(this);
    this.setInput = this.setInput.bind(this);
    this.setPlaybackMode = this.setPlaybackMode.bind(this);
    this.setPadding = this.setPadding.bind(this);
    this.setScrollerType = this.setScrollerType.bind(this);
    this.handleAddCharacter = this.handleAddCharacter.bind(this);
    this.handleEditCharacter = this.handleEditCharacter.bind(this);
    this.handleDeleteCharacter = this.handleDeleteCharacter.bind(this);
    this.setRenderer = this.setRenderer.bind(this);
    this.setRendererParameters = this.setRendererParameters.bind(this);
    this.setReverse = this.setReverse.bind(this);
    this.setSize = this.setSize.bind(this);
    this.setLetterSpacing = this.setLetterSpacing.bind(this);
    this.setViewportWidth = this.setViewportWidth.bind(this);
    this.handlePotentialErrors = this.handlePotentialErrors.bind(this);
    this.loadLedMatrixPostCharacters = this.loadLedMatrixPostCharacters.bind(this);
  }

  componentDidMount() {
    // Initialize library with state at mount
    this.ledMatrix = new LedMatrix({
      increment: this.state.ledSettings.increment,
      panelWidth: this.state.ledSettings.viewportWidth,
      letterSpacing: this.state.ledSettings.letterSpacing,
      reverse: this.state.ledSettings.reverse,
      padding: [
        this.state.ledSettings.padding.top,
        this.state.ledSettings.padding.right,
        this.state.ledSettings.padding.bottom,
        this.state.ledSettings.padding.left
      ]
    });

    this.ledMatrixPlayer = new LedMatrixPlayer(
      this.ledMatrix.sequence,
      {
        fps: this.state.ledSettings.fps,
        renderer: RendererBuilder.build(this.state.ledSettings.rendererType, this.ledMatrixId)
      }
    );

    this.ledMatrix.event.newSequence.on((sequence) => {
      this.ledMatrixPlayer.sequence = sequence;
    })

    this.setRendererParameters();


    if (this.state.ledMatrixMode == LedMatrixMode.NotLoaded) {
      if (this.props.location.pathname == '/') {
        // Load library if the panel DOM element is visible on mount
        this.loadLedMatrix();
      } else {
        // Force redirect to main page if ledMatrix isn't loaded
        this.props.history.push('/');
      }
    }

    this.props.history.listen((location) => {
      if (this.state.ledMatrixMode == LedMatrixMode.Loaded) {
        if (location.pathname == '/') {
          this.setPlaybackMode();
          this.setRenderer();
          this.setRendererParameters();
        } else {
          this.ledMatrixPlayer.pause();
        }
      }
    });
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    if (this.state.ledMatrixMode == LedMatrixMode.NotLoaded
      && this.props.location.pathname == '/') {
      this.loadLedMatrix();
    }

    if (this.state.ledMatrixMode == LedMatrixMode.Loaded) {
      if (this.props.location.pathname == '/fullscreen') {
        // Make sure the led panel is playing when using fullscreen
        this.ledMatrixPlayer.play();
      }

      if (prevState.pendingCharacter != this.state.pendingCharacter
        && this.state.pendingCharacter != null) {
        this.handleAddCharacter();
      }

      if (prevState.pendingEditCharacter != this.state.pendingEditCharacter
        && this.state.pendingEditCharacter != null) {
        this.handleEditCharacter();
      }

      if (prevState.pendingDeleteCharacter != this.state.pendingDeleteCharacter
        && this.state.pendingDeleteCharacter != null) {
        this.handleDeleteCharacter();
      }

      if (prevState.playbackMode != this.state.playbackMode) {
        this.setPlaybackMode();
      }

      if (this.state.height != this.ledMatrix.height) {
        this.state.updateState([s.height], this.ledMatrix.height);
      }

      if (prevState.ledSettings != this.state.ledSettings) {
        // Save any changes to led settings to local storage
        localStorage.setItem('ledSettings', JSON.stringify({
          ...this.state.ledSettings,
          loadedCharacters: this.state.ledSettings.loadedCharacters.map(x => ({
            pattern: x.pattern,
            output: x.output.atIndexRange(0, x.output.size),
            width: x.width
          }))
        }));

        if (prevState.ledSettings.scrollerType != this.state.ledSettings.scrollerType) {
          this.setScrollerType();
        }

        if (prevState.ledSettings.fps != this.state.ledSettings.fps) {
          this.setFps();
        }

        if (prevState.ledSettings.increment != this.state.ledSettings.increment) {
          this.setIncrement();
        }

        if (prevState.ledSettings.viewportWidth != this.state.ledSettings.viewportWidth) {
          this.setViewportWidth();
        }

        if (prevState.ledSettings.letterSpacing != this.state.ledSettings.letterSpacing) {
          this.setLetterSpacing();
        }

        if (prevState.ledSettings.input != this.state.ledSettings.input) {
          this.setInput();
        }

        if (prevState.ledSettings.size != this.state.ledSettings.size) {
          this.setSize();
        }

        if (prevState.ledSettings.reverse != this.state.ledSettings.reverse) {
          this.setReverse();
        }

        if (prevState.ledSettings.padding != this.state.ledSettings.padding) {
          this.setPadding();
        }

        const rendererChanged = prevState.ledSettings.rendererType != this.state.ledSettings.rendererType;
        if (this.state.ledSettings.rendererType == RendererTypes.ASCII) {
          if (rendererChanged ||
            prevState.ledSettings.asciiParameters.characterOn != this.state.ledSettings.asciiParameters.characterOn) {
            this.setCharacterBitOn();
          }

          if (rendererChanged ||
            prevState.ledSettings.asciiParameters.characterOff != this.state.ledSettings.asciiParameters.characterOff) {
            this.setCharacterBitOff();
          }
        } else {
          if (rendererChanged ||
            prevState.ledSettings.canvaParameters.colorOn != this.state.ledSettings.canvaParameters.colorOn) {
            this.setColorBitOn();
          }

          if (rendererChanged ||
            prevState.ledSettings.canvaParameters.colorOff != this.state.ledSettings.canvaParameters.colorOff) {
            this.setColorBitOff();
          }

          if (rendererChanged ||
            prevState.ledSettings.canvaParameters.strokeOn != this.state.ledSettings.canvaParameters.strokeOn) {
            this.setColorStrokeOn();
          }

          if (rendererChanged ||
            prevState.ledSettings.canvaParameters.strokeOff != this.state.ledSettings.canvaParameters.strokeOff) {
            this.setColorStrokeOff();
          }
        }
      }
    }
  }

  private handleAddCharacter() {
    this.handlePotentialErrors(s.pendingCharacter, () => {
      this.ledMatrix.addCharacter(this.state.pendingCharacter);
      this.state.updateState([s.pendingCharacter], null);
      this.state.updateState([s.ledSettings, s.loadedCharacters], this.ledMatrix.loadedCharacters, () => {
        this.setInput();
        this.setSize();
      });
    });
  }

  private handleEditCharacter() {
    this.handlePotentialErrors(s.pendingEditCharacter, () => {
      this.ledMatrix.editCharacter(this.state.pendingEditCharacter);
      this.state.updateState([s.pendingEditCharacter], null);
      this.state.updateState([s.ledSettings, s.loadedCharacters], this.ledMatrix.loadedCharacters, () => {
        this.setInput();
        this.setSize();
      });
    });
  }

  private handleDeleteCharacter() {
    this.handlePotentialErrors(s.pendingDeleteCharacter, () => {
      this.ledMatrix.deleteCharacter(this.state.pendingDeleteCharacter);
      this.state.updateState([s.pendingDeleteCharacter], null);
      this.state.updateState([s.ledSettings, s.loadedCharacters], this.ledMatrix.loadedCharacters, () => {
        this.setInput();
        this.setSize();
      });
    });
  }

  private handlePotentialErrors(errorPlaceholder: s, callback: () => void) {
    try {
      callback();
      if (this.state.errors[errorPlaceholder].isError == true) {
        this.state.updateStateError([errorPlaceholder], {
          isError: false,
          message: ''
        });
      }
    } catch (e) {
      this.state.updateStateError([errorPlaceholder], {
        isError: true,
        message: e
      });
    }
  }

  private setScrollerType() {
    this.ledMatrix.scroller = ScrollerBuilder.build(this.state.ledSettings.scrollerType, '');
  }

  private setIncrement() {
    this.ledMatrix.increment = this.state.ledSettings.increment;
  }

  private setFps() {
    this.ledMatrixPlayer.fps = this.state.ledSettings.fps;
  }

  private setViewportWidth() {
    this.ledMatrix.viewportWidth = this.state.ledSettings.viewportWidth;
  }

  private setLetterSpacing() {
    this.ledMatrix.letterSpacing = this.state.ledSettings.letterSpacing;
  }

  private setInput() {
    this.handlePotentialErrors(s.input, () => {
      this.ledMatrix.input = this.state.ledSettings.input;
      this.state.updateState([s.usedCharacters], this.ledMatrix.usedCharacters);
    });
  }

  private setReverse() {
    this.ledMatrix.reverse = this.state.ledSettings.reverse;
  }

  private setSize() {
    this.ledMatrix.size = this.state.ledSettings.size;
  }

  private setPadding() {
    this.ledMatrix.padding = [
      this.state.ledSettings.padding.top,
      this.state.ledSettings.padding.right,
      this.state.ledSettings.padding.bottom,
      this.state.ledSettings.padding.left
    ];
  }

  private setRenderer() {
    this.ledMatrixPlayer.renderer = RendererBuilder.build(this.state.ledSettings.rendererType, this.ledMatrixId)
  }

  private setCharacterBitOn() {
    (this.ledMatrixPlayer.renderer.parameters as any as AsciiRendererParameter).characterBitOn = 
      this.state.ledSettings.asciiParameters.characterOn;
  }

  private setCharacterBitOff() {
    (this.ledMatrixPlayer.renderer.parameters as any as AsciiRendererParameter).characterBitOff = 
    this.state.ledSettings.asciiParameters.characterOff;
  }

  private setColorBitOn() {
    (this.ledMatrixPlayer.renderer.parameters as any as CanvasRendererParameter).colorBitOn = 
    toHexString(this.state.ledSettings.canvaParameters.colorOn);
  }

  private setColorBitOff() {
    (this.ledMatrixPlayer.renderer.parameters as any as CanvasRendererParameter).colorBitOff = 
    toHexString(this.state.ledSettings.canvaParameters.colorOff);
  }

  private setColorStrokeOn() {
    (this.ledMatrixPlayer.renderer.parameters as any as CanvasRendererParameter).colorStrokeOn = 
    toHexString(this.state.ledSettings.canvaParameters.strokeOn);
  }

  private setColorStrokeOff() {
    (this.ledMatrixPlayer.renderer.parameters as any as CanvasRendererParameter).colorStrokeOff = 
    toHexString(this.state.ledSettings.canvaParameters.strokeOff);
  }

  private onRendererChanged() {
    this.setRenderer();
    this.setRendererParameters();
  }

  private setRendererParameters() {
    if (this.state.ledSettings.rendererType == RendererTypes.ASCII) {
      this.setCharacterBitOn();
      this.setCharacterBitOff();
    } else {
      this.setColorBitOn();
      this.setColorBitOff();
      this.setColorStrokeOn();
      this.setColorStrokeOff();
    }
  }

  private setPlaybackMode() {
    switch (Number(this.state.playbackMode) as PlaybackMode) {
      case PlaybackMode.play:
        this.ledMatrixPlayer.play();
        break;
      case PlaybackMode.stop:
        this.ledMatrixPlayer.stop();
        break;
      case PlaybackMode.resume:
        this.ledMatrixPlayer.resume();
        break;
      case PlaybackMode.pause:
        this.ledMatrixPlayer.pause();
        break;
    }
  }

  private loadLedMatrix() {
    this.state.updateState([s.ledMatrixMode], LedMatrixMode.Loading, () => {
      // If no characters are loaded, we'll get our characters from a json file
      if (!this.state.ledSettings.loadedCharacters) {
        CharactersJSON.import(`${process.env.PUBLIC_URL}/alphabet.json`, (characters) => {
          this.ledMatrix.addCharacters(characters);
          this.loadLedMatrixPostCharacters();
        });
      } else {
        this.ledMatrix.addCharacters(this.state.ledSettings.loadedCharacters);
        this.loadLedMatrixPostCharacters();
      }

    });
  }

  private loadLedMatrixPostCharacters() {
    this.state.updateState([s.usedCharacters], this.ledMatrix.usedCharacters);
    this.state.updateState([s.ledSettings, s.loadedCharacters], this.ledMatrix.loadedCharacters);
    this.state.updateState([s.height], this.ledMatrix.height);
    this.setInput();
    this.setSize();
    this.ledMatrixPlayer.play();
    this.state.updateState([s.ledMatrixMode], LedMatrixMode.Loaded);
  }

  updateStateError(keys: s[], value) {
    keys.unshift(s.errors);
    this.updateState(keys, value);
  }

  updateState(keys: s[], value, callback?: () => void) {
    this.setState((prevState) => {
      return updateState(keys as string[], value, prevState);
    }, callback);
  }

  render() {
    return (
      <Structure {...this.state} />
    );
  }
}

export default withRouter(App);