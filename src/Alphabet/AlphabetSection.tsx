import * as React from 'react'
import { withStyles, WithStyles, createStyles, Grid, TextField, Theme } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { bit, CanvaRenderers, Character, BitArray } from 'led-matrix-ts';
import { s, CanUpdateState, Error } from '../App';
import TooltipSlider from '../Inputs/TooltipSlider';
import LedConfigurationFormItem from '../Led/LedConfigurationFormItem';
import LedConfigurationPanel from '../Led/LedConfigurationPanel';

export enum a {
  character = 'character',
  width = 'width',
  height = 'height',
  pattern = 'pattern',
  data = 'data',
  lastMouseIndex = 'lastMouseIndex',
  x = 'x',
  y = 'y',
  isMouseDown = 'isMouseDown',
  sizePerBit = 'sizePerBit'
}

interface AlphabetSectionState {
  character: {
    width: number,
    height: number,
    pattern: string,
    data: bit[][]
  },
  lastMouseIndex: {
    x: number,
    y: number
  },
  isMouseDown: boolean,
  sizePerBit: number
}

interface AlphabetSectionProps extends CanUpdateState {
  loadedCharacters: Character[]
  errorPendingCharacter: Error
}

const styles = StyleSheet.create({
  characterCanvasContainer: {
    width: '100%',
    height: '80vh'
  }
});

const themeDependantStyles = ({ spacing }: Theme) => createStyles({
  container: {
    margin: spacing.unit * 4
  },
  common: {
    background: 'rgb(240, 240, 240)'
  },
  configuration: {
    maxHeight: '100vh',
    overflowY: "auto"
  }
});

class AlphabetSection extends React.Component<AlphabetSectionProps & WithStyles<typeof themeDependantStyles>, AlphabetSectionState> {
  renderer: CanvaRenderers.Rect

  // Set the default state
  state = {
    character: {
      width: 10,
      height: 8,
      pattern: '',
      data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as bit[],
      ] as bit[][]
    },
    lastMouseIndex: {
      x: -1,
      y: -1
    },
    isMouseDown: false,
    sizePerBit: 0
  }

  constructor(props) {
    super(props);
    this.toggleBitAtLastMouseIndex = this.toggleBitAtLastMouseIndex.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handlePatternChanged = this.handlePatternChanged.bind(this);
    this.updateState = this.updateState.bind(this);
    this.setCanvasContainerSize = this.setCanvasContainerSize.bind(this);
    this.setCanvasContainerBitToSize = this.setCanvasContainerBitToSize.bind(this);
  }

  componentDidMount() {
    const el = document.getElementById("characterCanvas");

    this.renderer = new CanvaRenderers.Rect({
      elementId: 'characterCanvas'
    })

    this.renderer.render(this.state.character.data);

    el.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mouseup', this.onMouseUp);

    this.setCanvasContainerSize();
    window.addEventListener('resize', this.setCanvasContainerSize);
  }

  componentWillUnmount() {
    const el = document.getElementById("characterCanvas");
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('resize', this.setCanvasContainerSize);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.character.data != this.state.character.data
      || prevState.sizePerBit != this.state.sizePerBit) {
      this.renderer.render(this.state.character.data);
    }

    if (prevState.character.data.length != this.state.character.data.length
      || prevState.character.data[0].length != this.state.character.data[0].length) {
      this.setCanvasContainerSize();
    }

    if (prevState.character.width != this.state.character.width) {
      this.setCanvasContainerBitToSize(document.getElementById("characterCanvas"), this.state.sizePerBit);
      if (prevState.character.width < this.state.character.width) {
        // now bigger
        const arrToAppend = new Array(this.state.character.width - prevState.character.width - 1).fill(0);
        var newArr = this.state.character.data.map((arr) => {
          return arr.concat(0, arrToAppend);
        });

        this.setState((prevState) => ({
          ...prevState,
          character: {
            ...prevState.character,
            data: newArr
          }
        }));
      } else if (prevState.character.width > this.state.character.width) {
        // now smaller
        var newArr = this.state.character.data.map((arr) => {
          return arr.slice(0, this.state.character.width);
        });

        this.setState((prevState) => ({
          ...prevState,
          character: {
            ...prevState.character,
            data: newArr
          }
        }));
      }

    }

    if (prevState.character.height != this.state.character.height) {
      this.setCanvasContainerBitToSize(document.getElementById("characterCanvas"), this.state.sizePerBit);
      if (prevState.character.height < this.state.character.height) {
        // now bigger
        const arrToAppend = this.arrayOfZeros(this.state.character.height - prevState.character.height, this.state.character.width);

        var newArr = this.state.character.data.concat(arrToAppend);

        this.setState((prevState) => ({
          ...prevState,
          character: {
            ...prevState.character,
            data: newArr
          }
        }));
      } else if (prevState.character.height > this.state.character.height) {
        // now smaller
        var newArr = this.state.character.data.slice(0, this.state.character.height);

        this.setState((prevState) => ({
          ...prevState,
          character: {
            ...prevState.character,
            data: newArr
          }
        }));
      }

    }
  }

  private onMouseMove(e) {
    const mouseIndex = this.getMouseIndexOnCanvas(e);
    if (mouseIndex.y != this.state.lastMouseIndex.y
      || mouseIndex.x != this.state.lastMouseIndex.x) {
      this.setState({ ...this.state, lastMouseIndex: mouseIndex });
      if (this.state.isMouseDown) {
        this.toggleBitAtLastMouseIndex(e)
      }
    }
  }

  private onMouseDown(e) {
    this.toggleBitAtLastMouseIndex(e);
    if (!this.state.isMouseDown) {
      this.setState({ ...this.state, isMouseDown: true });
    }
  }

  private onMouseUp(e) {
    if (this.state.isMouseDown) {
      this.setState({ ...this.state, isMouseDown: false });
    }
  }

  private getMouseIndexOnCanvas(event) {
    const el = document.getElementById("characterCanvas");
    var rect = el.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    const xPos = Math.floor(x / (el.offsetWidth / this.state.character.data[0].length));
    const yPos = Math.floor(y / (el.offsetHeight / this.state.character.data.length));

    return {
      x: xPos,
      y: yPos
    }
  }

  private toggleBitAtLastMouseIndex(event) {
    var newArr = this.state.character.data.map((arr) => {
      return arr.slice();
    });

    newArr[this.state.lastMouseIndex.y][this.state.lastMouseIndex.x] = newArr[this.state.lastMouseIndex.y][this.state.lastMouseIndex.x] == 0 ? 1 : 0;

    this.setState((prevState) => ({
      ...prevState,
      character: {
        ...prevState.character,
        data: newArr
      }
    }));
  }

  private onSave() {
    this.props.updateState([s.led, s.pendingCharacter], new Character(['[' + this.state.character.pattern + ']'], new BitArray([].concat.apply([], this.state.character.data)), Number(this.state.character.width)));
  }

  private handlePatternChanged(e) {
    const target = e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      character: {
        ...prevState.character,
        pattern: target
      }
    }))
  }

  private setCanvasContainerSize() {
    const canvasContainer = document.getElementById('characterCanvasContainer') as HTMLCanvasElement;
    const canvas = document.getElementById('characterCanvas') as HTMLCanvasElement;

    // Round to lowest {buffer} to optimize window resize event
    const buffer = 100;
    const totalWidth = Math.floor(canvasContainer.offsetWidth / buffer) * buffer;
    const totalHeight = Math.floor(canvasContainer.offsetHeight / buffer) * buffer;

    const optimalWidthPerBit = totalWidth / this.state.character.width;
    const optimalHeightPerBit = totalHeight / this.state.character.height;

    // scale using the lowest optimal
    let sizePerBit: number;
    if (optimalWidthPerBit < optimalHeightPerBit) {
      sizePerBit = optimalWidthPerBit
    } else {
      sizePerBit = optimalHeightPerBit
    }

    // Reduce the number of times the work is done depending on the buffer
    if (sizePerBit != this.state.sizePerBit) {
      console.log(sizePerBit);
      this.setCanvasContainerBitToSize(canvas, sizePerBit);
      this.setState((prevState) => ({
        ...prevState,
        sizePerBit: sizePerBit
      }));
    }
  }

  private setCanvasContainerBitToSize(canvas: HTMLElement, size: number) {
    canvas.style.width = this.state.character.width * size + 'px';
    canvas.style.height = this.state.character.height * size + 'px';
  }

  private arrayOfZeros(m, n) {
    return [...Array(m)].map(e => Array(n).fill(0));
  }

  private updateState(keys: s[], value, callback?: () => void) {
    let newState = Object.assign({}, this.state);
    keys.reduce(function (acc, cur, index) {
      // Make sure the key is a property that exists on prevState.led
      if (!acc.hasOwnProperty(cur)) {
        throw `Property ${cur} does not exist ${keys.length > 1 ? `at ${keys.slice(0, index).join('.')}` : ""}`
      }

      return acc[cur] = keys.length - 1 == index ?
        value : // We reached the end, modify the property to our value
        { ...acc[cur] }; // Continue spreading
    }, newState);

    this.setState(newState, callback);
  }

  render() {

    return (
      <Grid container item>
        <Grid item container sm={3}>
          <Grid
            item
            container
            direction={"column"}
            spacing={16}
            classes={{
              container: this.props.classes.container
            }}
            wrap="nowrap"
          >
            <LedConfigurationPanel label="Character list">
              <li>
                {
                  this.props.loadedCharacters ?
                    this.props.loadedCharacters.map((c) => (
                      <ul>{c.patterns.join(',')}</ul>
                    ))
                    : ''
                }
              </li>
            </LedConfigurationPanel>
            <LedConfigurationPanel label="Character creation">
              <TextField
                id="input"
                label={this.props.errorPendingCharacter.isError ? this.props.errorPendingCharacter.message : "Pattern"}
                error={this.props.errorPendingCharacter.isError}
                onChange={this.handlePatternChanged}
              />

              <LedConfigurationFormItem label="Width">
                <TooltipSlider
                  id="width"
                  statePath={[a.character, a.width]}
                  min={1}
                  max={100}
                  lastCapturedValue={this.state.character.width}
                  onInputCaptured={this.updateState}
                />
              </LedConfigurationFormItem>

              <LedConfigurationFormItem label="Height">
                <TooltipSlider
                  id="height"
                  statePath={[a.character, a.height]}
                  min={1}
                  max={100}
                  lastCapturedValue={this.state.character.height}
                  onInputCaptured={this.updateState}
                />
              </LedConfigurationFormItem>


              <input type="button" value="Save" onClick={this.onSave} />
            </LedConfigurationPanel>
          </Grid>
        </Grid>
        <Grid item container sm={9} justify="center" alignContent="center" alignItems="center">
          <Grid item container id="characterCanvasContainer" className={css(styles.characterCanvasContainer)} justify="center" alignContent="center" alignItems="center">
            <canvas id="characterCanvas" />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(themeDependantStyles)(AlphabetSection);