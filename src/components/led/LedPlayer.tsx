import * as React from 'react'
import { Exception, RendererTypes, PanelFrame, Renderer, Sequence, RendererBuilder, CanvasRenderers } from 'led-matrix-ts';
import LedPanel from './LedPanel';
import { updateState } from '../../utils/state';

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
  index: number,
  renderer: Renderer
}

interface LedPlayerProps {
  sequence: Sequence,
  fps: number,
  rendererType: RendererTypes,
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
    index: 0,
    renderer: new CanvasRenderers.Rect({
      elementId: this.ledPanelId
    })
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.onChangeRendererType();
    this.onChangePlayback();
    this.onChangeIndex();
    this.onChangeSequence();
    this.onChangeFps();
    this.onChangeRendererType();
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

    if (prevProps.rendererType != this.props.rendererType) {
      this.onChangeRendererType();
    }
  }

  private onChangeIndex() {
    const reachedBoundary = this.state.index >= this.props.sequence.length;

    if (reachedBoundary) {
      this.props.onReachingBoundary();
    }

    if (this.props.sequence.length > 0) {
      this.props.onPanelUpdate(this.props.sequence[this.state.index]);
      this.state.renderer.render(this.props.sequence[this.state.index]);
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

  private onChangeRendererType() {
    Exception.throwIfNull(this.props.rendererType, Exception.getDescriptionForProperty(this.CLASS_NAME, 'rendererType'))
    this.updateState([a.renderer], RendererBuilder.build(this.props.rendererType, this.ledPanelId));
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
    return (
      this.props.sequence && this.state.renderer && this.props.sequence.length > 0 ?
        (
          <LedPanel
            panelFrame={this.props.sequence[this.state.index]}
            renderer={this.state.renderer}
            maxHeightPixel={'70vh'}
            rendererType={RendererTypes.CanvasSquare}
            onRendererElementChanged={null}
          />) :
        (
          <div style={{maxHeight: '70vh'}} />
        )
    )
  }
}

LedPlayer.defaultProps = {
  onPanelUpdate: (panelFrame) => { },
  onReachingBoundary: () => { }
}

export default LedPlayer;