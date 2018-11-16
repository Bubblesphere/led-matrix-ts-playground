import * as React from 'react'
import { withStyles, WithStyles, createStyles, Grid, TextField, Theme, Button } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { bit, Character, BitArray } from 'led-matrix-ts';
import { s, CanUpdateState, Error } from '../App';
import TooltipSlider from '../components/inputs/TooltipSlider';
import ToggleExpansionPanel from '../components/toggleExpansionPanel/ToggleExpansionPanel';
import ToggleExpansionPanelSection from '../components/toggleExpansionPanel/ToggleExpansionPanelSection';
import ToggleExpansionPanelItem from '../components/toggleExpansionPanel/ToggleExpansionPanelItem';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { updateState } from '../utils/state';
import { RGBColor } from 'react-color';
import DrawableLedPanel, { DrawableLedPanelMode, DrawableLedPanelCharacter, DrawableLedPanelDefaultProps } from '../components/led/DrawableLedPanel';

export enum a {
  mode = 'mode',
  expansionPanelIndex = 'expansionPanelIndex',
  character = 'character',
  width = 'width',
  height = 'height',
  pattern = 'pattern',
  data = 'data',
  pendingSave = 'pendingSave'
}

interface AlphabetSectionState {
  character: DrawableLedPanelCharacter
  mode: DrawableLedPanelMode,
  expansionPanelIndex: number,
  pendingSave: boolean
}

interface AlphabetSectionProps extends CanUpdateState {
  loadedCharacters: Character[]
  errorPendingCharacter: Error,
  errorPendingEditCharacter: Error,
  errorPendingDeleteCharacter: Error,
  pendingCharacter: boolean,
  canvasParameters: {
    colorOff: RGBColor,
    colorOn: RGBColor,
    strokeOff: RGBColor,
    strokeOn: RGBColor
  }
}

const styles = StyleSheet.create({
  common: {
    background: 'rgb(240, 240, 240)'
  },
  configuration: {
    maxHeight: '100vh',
    overflowY: "auto",
  }
});

const themeDependantStyles = ({ spacing, palette }: Theme) => createStyles({
  container: {
    margin: spacing.unit * 4
  },
  characterSelected: {
    background: palette.primary.main,
    color: palette.primary.contrastText
  },
  character: {
    margin: 0,
    padding: spacing.unit,
    cursor: "pointer",
    display: 'inline-block',
    borderRadius: spacing.unit,
    '&:hover': {
      background: palette.primary.light,
      color: palette.primary.contrastText
    }
  },
  rightIcon: {
    marginLeft: spacing.unit,
  },
  button: {
    margin: spacing.unit
  }
});

class AlphabetSection extends React.Component<AlphabetSectionProps & WithStyles<typeof themeDependantStyles>, AlphabetSectionState> {
  // Set the default state
  defaultCharacter = {
    pattern: '',
    width: 7,
    height: 16,
    data: [
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
      [0, 0, 0, 0, 0, 0, 0] as bit[],
    ] as bit[][]
  }

  state = {
    character: this.defaultCharacter,
    expansionPanelIndex: 0,
    pendingSave: true,
    mode: DrawableLedPanelDefaultProps.mode
  }

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handlePatternChanged = this.handlePatternChanged.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onModeEdit = this.onModeEdit.bind(this);
    this.onModeAdd = this.onModeAdd.bind(this);
    this.getCharacterFromState = this.getCharacterFromState.bind(this);
    this.handleExpansionPanelIndexChanged = this.handleExpansionPanelIndexChanged.bind(this);
    this.onCharacterDataChangedHandle = this.onCharacterDataChangedHandle.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {

    // Character was added successfully?
    if (prevProps.pendingCharacter == true && this.props.pendingCharacter == false) {
      this.updateState([a.character, a.pattern], prevState.character.pattern);
      this.updateState([a.mode], DrawableLedPanelMode.edit);
    }

    // If the character data changed or there's an error, show the save button
    if ((prevState.character.pattern == this.state.character.pattern
      && prevState.character.data != this.state.character.data)
      || (prevProps.errorPendingCharacter.isError == false && this.props.errorPendingCharacter.isError == true)) {

      this.updateState([a.pendingSave], true);
    }
  }

  private onSave() {
    this.updateState([a.pendingSave], false);

    const char = this.getCharacterFromState(this.state.character.pattern);
    console.log(char.output.atIndexRange(0, char.output.size));

    if (this.state.mode == DrawableLedPanelMode.create) {
      this.props.updateState([s.led, s.pendingCharacter], char);
    } else {
      this.props.updateState([s.led, s.pendingEditCharacter], char);
    }
  }

  private handlePatternChanged(e) {
    const target = e.target.value;
    this.updateState([a.character, a.pattern], target);
  }

  private onDelete() {
    this.props.updateState([s.led, s.pendingDeleteCharacter], this.getCharacterFromState(this.state.character.pattern));
    this.updateState([a.character], Object.assign({}, this.defaultCharacter));
    this.updateState([a.mode], DrawableLedPanelMode.create);
    this.updateState([a.expansionPanelIndex], 1);
    this.updateState([a.pendingSave], true);
  }

  private onModeAdd(e) {
    this.updateState([a.character], Object.assign({}, this.defaultCharacter));
    this.updateState([a.mode], DrawableLedPanelMode.create);
    this.updateState([a.expansionPanelIndex], 0);
    this.updateState([a.pendingSave], true);
  }

  private onModeEdit(e) {
    const id = e.currentTarget.dataset.id;
    const character = this.props.loadedCharacters.filter(x => x.pattern == id)[0];

    let data: bit[][] = [];
    for (let i = 0; i < character.height; i++) {
      data.push(character.output.atIndexRange(i * character.width, character.width));
    }

    this.updateState([a.character], {
      data: data,
      height: character.height,
      width: character.width,
      pattern: character.pattern
    });
    this.updateState([a.mode], DrawableLedPanelMode.edit);
    this.updateState([a.pendingSave], false);
  }

  private getCharacterFromState(pattern: string) {
    return new Character(pattern, new BitArray([].concat.apply([], this.state.character.data)), this.state.character.width);
  }

  private handleExpansionPanelIndexChanged(index: number) {
    this.updateState([a.expansionPanelIndex], index);
  }

  private onCharacterDataChangedHandle(data: bit[][]) {
    this.updateState([a.character, a.data], data);
  }

  private updateState(keys: a[], value, callback?: () => void) {
    this.setState((prevState) => {
      return updateState(keys as string[], value, prevState);
    }, callback);
  }

  render() {
    return (
      <Grid container item direction="row-reverse">

        <Grid item container md={9} justify="center" alignContent="center" alignItems="center" className={css(styles.common)}>
          <DrawableLedPanel
            canvasParameters={this.props.canvasParameters}
            onCharacterDataChangedHandle={this.onCharacterDataChangedHandle}
            character={this.state.character}
          />
        </Grid>

        <Grid item container md={3} className={css(styles.common, styles.configuration)}>
          <ToggleExpansionPanel expanded={this.state.expansionPanelIndex} onChange={this.handleExpansionPanelIndexChanged}>
            <ToggleExpansionPanelSection title="Configuration">
              <ToggleExpansionPanelItem label="Pattern">
                <TextField
                  id="input"
                  label={this.props.errorPendingCharacter.isError ? this.props.errorPendingCharacter.message : "Pattern"}
                  error={this.props.errorPendingCharacter.isError}
                  onChange={this.handlePatternChanged}
                  disabled={this.state.mode == DrawableLedPanelMode.edit}
                  value={this.state.character.pattern}
                />

              </ToggleExpansionPanelItem>

              <ToggleExpansionPanelItem label="Width">
                <TooltipSlider
                  id="width"
                  statePath={[a.character, a.width]}
                  min={1}
                  max={100}
                  lastCapturedValue={this.state.character.width}
                  onInputCaptured={this.updateState}
                />
              </ToggleExpansionPanelItem>

              <ToggleExpansionPanelItem label="Height">
                <TooltipSlider
                  id="height"
                  statePath={[a.character, a.height]}
                  min={1}
                  max={100}
                  lastCapturedValue={this.state.character.height}
                  onInputCaptured={this.updateState}
                />
              </ToggleExpansionPanelItem>

              <Grid item container justify="flex-end">

                {
                  this.state.pendingSave == true ?
                    <Button variant="contained" color="primary" aria-label="Save" onClick={this.onSave} size="large" className={this.props.classes.button}>
                      Save
                      <SaveIcon className={this.props.classes.rightIcon} />
                    </Button> :
                    ''
                }
                {
                  this.state.mode == DrawableLedPanelMode.edit ?
                    <Button variant="contained" type="button" aria-label="Delete" onClick={this.onDelete} color="secondary" size="small" className={this.props.classes.button}>
                      Delete
                      <DeleteIcon className={this.props.classes.rightIcon} />
                    </Button> :
                    ''
                }

              </Grid>

            </ToggleExpansionPanelSection>
            <ToggleExpansionPanelSection title="Characters">
              <li style={{ maxHeight: '50vh', overflowY: 'auto', listStyle: 'none' }}>
                {

                  this.props.loadedCharacters ?
                    this.props.loadedCharacters.map((c) => (
                      <ul
                        onClick={this.onModeEdit}
                        data-id={c.pattern}
                        key={c.pattern}
                        className={[this.props.classes.character, c.pattern == this.state.character.pattern ? this.props.classes.characterSelected : ""].join(" ")}
                      >
                        {c.pattern}
                      </ul>
                    ))
                    : ''
                }
              </li>
              <Grid item container justify="flex-end">
                <Button variant="contained" color="primary" aria-label="Add" onClick={this.onModeAdd} className={this.props.classes.button}>
                  New
                  <AddIcon />
                </Button>
              </Grid>
            </ToggleExpansionPanelSection>
          </ToggleExpansionPanel>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(themeDependantStyles)(AlphabetSection);