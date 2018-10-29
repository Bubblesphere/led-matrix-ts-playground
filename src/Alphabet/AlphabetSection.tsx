import * as React from 'react'
import { withStyles, WithStyles, createStyles, Grid, TextField } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { bit, CanvaRenderers, Character, BitArray } from 'led-matrix-ts';
import { s, CanUpdateState, Error } from '../App';

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
    width: '80vw',
    height: '80vh'
  }
});

const themeDependantStyles = () => createStyles({
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
    var newArr = this.state.character.data.map(function (arr) {
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
    this.props.updateState([s.led, s.pendingCharacter], new Character(['[' + this.state.character.pattern + ']'], new BitArray([].concat.apply([], this.state.character.data)), this.state.character.width));
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

  render() {

    return (
      <Grid container item>
        <Grid item container sm={3}>
          <li>
            {
              this.props.loadedCharacters ?
                this.props.loadedCharacters.map((c) => (
                  <ul>{c.patterns.join(',')}</ul>
                ))
                : ''
            }
          </li>
        </Grid>
        <Grid item container sm={2}>
          <TextField
            id="input"
            label={this.props.errorPendingCharacter.isError ? this.props.errorPendingCharacter.message : "Pattern"}
            error={this.props.errorPendingCharacter.isError}
            onChange={this.handlePatternChanged}
          />

          <input type="button" value="Save" onClick={this.onSave} />
        </Grid>
        <Grid item container sm={7} justify="center" alignContent="center" alignItems="center">
          <Grid item container id="characterCanvasContainer" className={css(styles.characterCanvasContainer)} justify="center" alignContent="center" alignItems="center">
            <canvas id="characterCanvas" />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(themeDependantStyles)(AlphabetSection);