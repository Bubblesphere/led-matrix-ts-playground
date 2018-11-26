import * as React from 'react'
import { CanvasRenderers, PanelFrame } from 'led-matrix-ts';
import { RGBColor } from 'react-color';
import { toHexString } from '../../../utils/color';
import { generate2dArrayOfOffBits, generateArrayOfOffBits } from '../../../utils/array';
import { updateState } from '../../../utils/state';
import CanvasPanel from './CanvasPanel'

export enum DrawableCanvasPanelMode {
  create,
  edit
}

export interface DrawableCanvasPanelCharacter {
  data: PanelFrame
  pattern: string,
  width: number,
  height: number
}

enum a {
  lastMouseIndex = 'lastMouseIndex',
  x = 'x',
  y = 'y',
  isMouseDown = 'isMouseDown'
}

interface DrawableCanvasPanelState {
  lastMouseIndex: {
    x: number,
    y: number
  },
  isMouseDown: boolean
}

interface DrawableCanvasPanelProps {
  canvasParameters: {
    colorOff: RGBColor,
    colorOn: RGBColor,
    strokeOff: RGBColor,
    strokeOn: RGBColor
  },
  onCharacterDataChangedHandle: (data: PanelFrame) => void,
  character: DrawableCanvasPanelCharacter
}

interface DrawableCanvasPanelPropsOpt {
  mode: DrawableCanvasPanelMode
}

class DrawableCanvasPanel extends React.Component<DrawableCanvasPanelProps & DrawableCanvasPanelPropsOpt, DrawableCanvasPanelState> {
  renderer: CanvasRenderers.Rect
  ledPanelId = 'led-matrix';
  static defaultProps: DrawableCanvasPanelPropsOpt;

  // Set the default state
  state = {
    mode: DrawableCanvasPanelMode.create,
    lastMouseIndex: {
      x: -1,
      y: -1
    },
    isMouseDown: false
  }

  constructor(props) {
    super(props);
    this.toggleBitAtLastMouseIndex = this.toggleBitAtLastMouseIndex.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    const el = document.getElementById(this.ledPanelId);

    this.renderer = new CanvasRenderers.Rect({
      elementId: this.ledPanelId,
      colorBitOff: toHexString(this.props.canvasParameters.colorOff),
      colorBitOn: toHexString(this.props.canvasParameters.colorOn),
      colorStrokeOff: toHexString(this.props.canvasParameters.strokeOff),
      colorStrokeOn: toHexString(this.props.canvasParameters.strokeOn)
    });

    el.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    const el = document.getElementById(this.ledPanelId);
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate(prevProps, prevState) {
    // Width was adjusted for current character
    if (prevProps.character.width != this.props.character.width &&
      prevProps.character.pattern == this.props.character.pattern) {

      let finalCharacterData = null;
        
      // Width is bigger than it was?
      if (prevProps.character.width < this.props.character.width) {
        const arrToAppend = generateArrayOfOffBits(this.props.character.width - prevProps.character.width - 1);
        
        // Append the difference to the end of each row of the character
        finalCharacterData = this.props.character.data.map((arr) => {
          return arr.concat(0, arrToAppend);
        });

      } else if (prevProps.character.width > this.props.character.width) {

        // Remove the difference at the end of each character
        finalCharacterData = this.props.character.data.map((arr) => {
          return arr.slice(0, this.props.character.width);
        });

      }

      // Update state
      this.props.onCharacterDataChangedHandle(finalCharacterData);
    }

    // Height was adjusted for current character
    if (prevProps.character.height != this.props.character.height &&
      prevProps.character.pattern == this.props.character.pattern) {

      let finalCharacterData = null;

      // Height is bigger than it was?
      if (prevProps.character.height < this.props.character.height) {
        const arrToAppend = generate2dArrayOfOffBits(this.props.character.height - prevProps.character.height, this.props.character.width);

        // Append additional rows to character
        finalCharacterData = this.props.character.data.concat(arrToAppend);
      } else if (prevProps.character.height > this.props.character.height) {
        // now smaller
        finalCharacterData = this.props.character.data.slice(0, this.props.character.height);
      }

      // Update state
      this.props.onCharacterDataChangedHandle(finalCharacterData);
    }
  }

  private onMouseMove(e) {
    const mouseIndex = this.getMouseIndexPositionOnCanvas(e);

    // Did the mouse position state changed since last time?
    if (mouseIndex.y != this.state.lastMouseIndex.y
      || mouseIndex.x != this.state.lastMouseIndex.x) {

      // Update state
      this.updateState([a.lastMouseIndex], mouseIndex);

      if (this.state.isMouseDown) {
        // Mouse is down and moving, draw at current bit
        this.toggleBitAtLastMouseIndex(e)
      }
    }
  }

  private onMouseDown(e) {
    this.toggleBitAtLastMouseIndex(e);

    if (!this.state.isMouseDown) {
      this.updateState([a.isMouseDown], true);
    }
  }

  private onMouseUp(e) {
    if (this.state.isMouseDown) {
      this.updateState([a.isMouseDown], false);
    }
  }

  private getMouseIndexPositionOnCanvas(event) {
    const el = document.getElementById(this.ledPanelId);
    var rect = el.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    const xPos = Math.floor(x / (el.offsetWidth / this.props.character.data[0].length));
    const yPos = Math.floor(y / (el.offsetHeight / this.props.character.data.length));

    return {
      x: xPos,
      y: yPos
    }
  }

  private toggleBitAtLastMouseIndex(event) {
    var newArr = this.props.character.data.map((arr) => {
      return arr.slice();
    });

    newArr[this.state.lastMouseIndex.y][this.state.lastMouseIndex.x] = newArr[this.state.lastMouseIndex.y][this.state.lastMouseIndex.x] == 0 ? 1 : 0;
    
    this.props.onCharacterDataChangedHandle(newArr);
  }

  private updateState(keys: a[], value, callback?: () => void) {
    this.setState((prevState) => {
      return updateState(keys as string[], value, prevState);
    }, callback);
  }

  render() {
    return (
      <CanvasPanel 
        id={this.ledPanelId}
        maxHeightPixel='65vh'
        panelFrame={this.props.character.data}
        colorBitOn={toHexString(this.props.canvasParameters.colorOn)}
        colorBitOff={toHexString(this.props.canvasParameters.colorOff)}
        colorStrokeOn={toHexString(this.props.canvasParameters.strokeOn)}
        colorStrokeOff={toHexString(this.props.canvasParameters.strokeOff)}
      />
    )
  }
}

DrawableCanvasPanel.defaultProps = {
  mode: DrawableCanvasPanelMode.create
}

export const DrawableCanvasPanelDefaultProps = DrawableCanvasPanel.defaultProps

export default DrawableCanvasPanel;