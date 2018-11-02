import * as React from 'react'
import { withStyles, WithStyles, createStyles, Grid, TextField, Theme } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { bit, CanvaRenderers, Character, BitArray } from 'led-matrix-ts';
import { s, CanUpdateState, Error } from '../App';
import TooltipSlider from '../Inputs/TooltipSlider';
import ToggleExpansionPanel from '../Led/ToggleExpansionPanel';
import ToggleExpansionPanelItem from '../Led/ToggleExpansionPanelItem';
import LedConfigurationFormItem from '../Led/LedConfigurationFormItem';

export enum a {
  mode = 'mode',
  character = 'character',
  width = 'width',
  height = 'height',
  pattern = 'pattern',
  data = 'data',
  lastMouseIndex = 'lastMouseIndex',
  x = 'x',
  y = 'y',
  isMouseDown = 'isMouseDown'
}

enum alphabetMode {
  create,
  edit
}

interface AlphabetSectionState {
  mode: alphabetMode,
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
  isMouseDown: boolean
}

interface AlphabetSectionProps extends CanUpdateState {
  loadedCharacters: Character[]
  errorPendingCharacter: Error,
  errorPendingEditCharacter: Error,
  errorPendingDeleteCharacter: Error
}

const styles = StyleSheet.create({
  common: {
    background: 'rgb(240, 240, 240)'
  },
  configuration: {
    maxHeight: '100vh',
    overflowY: "auto",
  },
  characterCanvasContainer: {
    '@media (max-width: 600px)': {
      height: '100%'
    }
  }
});

const themeDependantStyles = ({ spacing, palette }: Theme) => createStyles({
  container: {
    margin: spacing.unit * 4
  },
  characterCanvasContainer: {
    margin: `${spacing.unit * 4}px ${spacing.unit * 2}px`
  },
  characterSelected: {
    background: palette.primary.main,
    color: palette.primary.contrastText
  },
  character: {
    margin: 0,
    padding: spacing.unit,
    cursor: "pointer"
  }
});

class AlphabetSection extends React.Component<AlphabetSectionProps & WithStyles<typeof themeDependantStyles>, AlphabetSectionState> {
  renderer: CanvaRenderers.Rect
  defaultCharacter = {
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
  }

  // Set the default state
  state = {
    mode: alphabetMode.create,
    character: Object.assign({}, this.defaultCharacter),
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
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handlePatternChanged = this.handlePatternChanged.bind(this);
    this.updateState = this.updateState.bind(this);
    this.setCanvasContainerSize = this.setCanvasContainerSize.bind(this);
    this.setCanvasContainerBitToSize = this.setCanvasContainerBitToSize.bind(this);
    this.onModeEdit = this.onModeEdit.bind(this);
    this.onModeAdd = this.onModeAdd.bind(this);
    this.getCharacterFromState = this.getCharacterFromState.bind(this);
  }

  componentDidMount() {
    const el = document.getElementById("characterCanvas");

    this.renderer = new CanvaRenderers.Rect({
      elementId: 'characterCanvas'
    })

    this.setCanvasContainerSize();
    this.renderer.render(this.state.character.data);

    el.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mouseup', this.onMouseUp);

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
    if (prevState.character.data.length != this.state.character.data.length
      || prevState.character.data[0].length != this.state.character.data[0].length) {
      this.setCanvasContainerSize();
    }

    if (prevState.character.data != this.state.character.data) {
      this.renderer.render(this.state.character.data);
    }

    if (prevState.character.width != this.state.character.width &&
      prevState.character.pattern == this.state.character.pattern) {
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

    if (prevState.character.height != this.state.character.height &&
      prevState.character.pattern == this.state.character.pattern) {
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
    if (this.state.mode == alphabetMode.create) {
      this.props.updateState([s.led, s.pendingCharacter], this.getCharacterFromState('[' + this.state.character.pattern + ']'));
    } else {
      this.props.updateState([s.led, s.pendingEditCharacter], this.getCharacterFromState(this.state.character.pattern));
    }
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

    this.setCanvasContainerBitToSize(canvas, sizePerBit);
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

  private onDelete() {
    this.props.updateState([s.led, s.pendingDeleteCharacter], this.getCharacterFromState(this.state.character.pattern));
  }

  private onModeAdd(e) {
    this.setState((prevState) => ({
      ...prevState,
      character: Object.assign({}, this.defaultCharacter),
      mode: alphabetMode.create
    }));
  }

  private onModeEdit(e) {
    const id = e.currentTarget.dataset.id;
    const character = this.props.loadedCharacters.filter(x => x.pattern == id)[0];

    let data: bit[][] = [];
    for (let i = 0; i < character.height; i++) {
      data.push(character.output.atIndexRange(i * character.width, character.width));
    }
    this.setState((prevState) => ({
      ...prevState,
      character: {
        data: data,
        height: character.height,
        width: character.width,
        pattern: character.pattern
      },
      mode: alphabetMode.edit
    }));
  }

  private getCharacterFromState(pattern: string) {
    return new Character(pattern, new BitArray([].concat.apply([], this.state.character.data)), this.state.character.width);
  }

  render() {

    return (
      <Grid container item direction="row-reverse">

        <Grid item container md={9} justify="center" alignContent="center" alignItems="center" className={css(styles.common)}>
          <Grid
            item
            container
            id="characterCanvasContainer"
            className={[this.props.classes.characterCanvasContainer, css(styles.characterCanvasContainer)].join(" ")}
            style={{ width: '100%', height: '80vh' }} // need this here to draw the right size onComponentMount
            justify="center"
            alignContent="center"
            alignItems="center"
          >
            <canvas id="characterCanvas" />
          </Grid>
        </Grid>

        <Grid item container md={3} className={css(styles.common, styles.configuration)}>
          <ToggleExpansionPanel>
            <ToggleExpansionPanelItem title="Configuration">
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


              {
                this.state.mode == alphabetMode.edit ?
                  <input type="button" value="Delete" onClick={this.onDelete} /> :
                  ''
              }
              <input type="button" value="Save" onClick={this.onSave} />
            </ToggleExpansionPanelItem>
            <ToggleExpansionPanelItem title="Characters">
              <input type="button" value="Add new" onClick={this.onModeAdd} />
              <li style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                {
                  
                  this.props.loadedCharacters ?
                    this.props.loadedCharacters.map((c) => (
                      <ul 
                        onClick={this.onModeEdit} 
                        data-id={c.pattern}
                        key={c.pattern} 
                        className={[this.props.classes.character,  c.pattern == this.state.character.pattern ? this.props.classes.characterSelected : ""]. join(" ")}
                      >
                      {c.pattern}
                      </ul>
                    ))
                    : ''
                }
              </li>
            </ToggleExpansionPanelItem>
          </ToggleExpansionPanel>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(themeDependantStyles)(AlphabetSection);