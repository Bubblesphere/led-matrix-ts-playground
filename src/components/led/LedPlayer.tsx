import * as React from 'react'
import { Exception, PanelFrame, Sequence } from 'led-matrix-ts';
import { updateState } from '../../utils/state';
import { Panel } from './panels/panel';

enum a {
  index = 'index',
  renderer = 'renderer'
}

export enum PlaybackMode {
  Play,
  Stop,
  Pause,
  Resume
}

interface LedPlayerState {
  index: number
}

interface LedPlayerProps {
  sequence: Sequence,
  fps: number,
  playbackMode: PlaybackMode
}

interface LedPlayerPropsOpt {
  onPanelUpdate?: (panelFrame: PanelFrame) => void,
  onReachingBoundary?: () => void
}

class LedPlayer extends React.Component<LedPlayerProps & LedPlayerPropsOpt, LedPlayerState> {
  readonly CLASS_NAME = LedPlayer.name;

  private _shouldUpdate: boolean;
  private _now: number;
  private _then: number;
  private _elapsed: number;

  ledPanelId = 'led-matrix';

  static defaultProps: LedPlayerPropsOpt;

  state = {
    index: 0
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.onChangePlayback();
    this.onChangeFps();
  }

  componentWillUnmount() {
    this._shouldUpdate = false;
  }

  componentDidUpdate(prevProps: LedPlayerProps, prevState: LedPlayerState) {
    if (prevProps.playbackMode != this.props.playbackMode) {
      this.onChangePlayback();
    }

    if (prevState.index != this.state.index) {
      this.onChangeIndex();
    }

    if (prevProps.sequence != this.props.sequence) {
      this.onChangeSequence()
    }

    if (prevProps.fps != this.props.fps) {
      this.onChangeFps();
    }
  }

  private onChangeIndex() {
    const reachedBoundary = this.state.index >= this.props.sequence.length;

    if (reachedBoundary) {
      this.props.onReachingBoundary();
    }

    if (this.props.sequence.length > 0) {
      this.props.onPanelUpdate(this.props.sequence[this.state.index]);
    }
  }

  private onChangePlayback() {
    switch (+this.props.playbackMode) {
      case PlaybackMode.Play:
        this.updateState([a.index], 0);
        this._startLoop();
        break;
      case PlaybackMode.Stop:
        this.updateState([a.index], 0);
        this._shouldUpdate = false;
        break;
      case PlaybackMode.Pause:
        this._shouldUpdate = false;
        break;
      case PlaybackMode.Resume:
        this._startLoop();
        break;
    }
  }

  private onChangeSequence() {
    Exception.throwIfNull(this.props.sequence, Exception.getDescriptionForProperty(this.CLASS_NAME, 'sequence'));
  }

  private onChangeFps() {
    const fpsDescription = Exception.getDescriptionForProperty(this.CLASS_NAME, 'fps');
    Exception.throwIfNull(this.props.fps, fpsDescription);
    Exception.throwIfNotBetween(this.props.fps, fpsDescription, 0, 60);
  }

  private updateState(keys: a[], value, callback?: () => void) {
    this.setState((prevState) => {
      return updateState(keys as string[], value, prevState);
    }, callback);
  }


  /* Moves the panel a single step */
  private _nextPanelFrame(): void {
    if (this.props.sequence.length > 0) {
      Exception.throwIfNull(this.props.sequence, Exception.getDescriptionForProperty(this.CLASS_NAME, 'sequence'))
      this.updateState([a.index], (this.state.index + 1) % this.props.sequence.length);
    }
  }

  /* Starts the looping process */
  private _startLoop() {
    this._then = Date.now();
    this._shouldUpdate = true;
    this._loop();
  }

  /* Steps at an interval of the panel's fps */
  private _loop(): void {
    requestAnimationFrame(this._loop.bind(this));
    if (this._shouldUpdate) {
      this._callIfReadyForNextFrame(this._nextPanelFrame.bind(this));
    }
  }

  /* Calls the callback if ready next frame (fps based) */
  private _callIfReadyForNextFrame(callback: () => any) {
    const lengthMsEachFrame = 1000 / this.props.fps;
    this._now = Date.now();
    this._elapsed = this._now - this._then;

    // if enough time has elapsed, draw the next frame
    if (this._elapsed > lengthMsEachFrame) {

      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this._then = this._now - (this._elapsed % lengthMsEachFrame);

      // Put your drawing code here
      callback();
    }
  }

  render() {

    const panelWithProps = this.props.sequence && this.props.sequence.length > 0 ?
      React.Children.toArray(this.props.children).map((child, index) => (
        React.cloneElement(child as React.ReactElement<any>, {
          panelFrame: this.props.sequence[this.state.index]
        })
      )) :
      <div style={{ maxHeight: '65vh' }} />

    return panelWithProps;
  }
}

LedPlayer.defaultProps = {
  onPanelUpdate: (panelFrame) => { },
  onReachingBoundary: () => { }
}

export default LedPlayer;