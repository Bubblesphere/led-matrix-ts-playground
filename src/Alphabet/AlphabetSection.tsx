import * as React from 'react'
import { withStyles, WithStyles, createStyles, Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { bit, CanvaRenderers, Character, BitArray } from 'led-matrix-ts';
import { s, CanUpdateState } from '../App';
import { Redirect } from 'react-router-dom';

interface AlphabetSectionState {
  character: {
    width: number,
    height: number,
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
}

const styles = StyleSheet.create({
});

const themeDependantStyles = () => createStyles({
});

class AlphabetSection extends React.Component<AlphabetSectionProps & WithStyles<typeof themeDependantStyles>, AlphabetSectionState> {
  renderer: CanvaRenderers.Rect

  // Set the default state
  state = {
    character: {
      width: 10,
      height: 5,
      data: [
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,1,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[],
        [0,0,0,0,0,0,0,0,0,0] as bit[]
      ] as bit[][]
    },
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
  }

  componentDidMount() {
    const el = document.getElementById("character");

    this.renderer = new CanvaRenderers.Rect({
      elementId: 'character'
    })

    this.renderer.render(this.state.character.data);

    el.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    const el = document.getElementById("character");
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.character.data != this.state.character.data) {
      this.renderer.render(this.state.character.data);
    }
  }

  private onMouseMove(e) {
    const mouseIndex = this.getMouseIndexOnCanvas(e);
    if (mouseIndex.y != this.state.lastMouseIndex.y 
      || mouseIndex.x != this.state.lastMouseIndex.x) {
      this.setState({...this.state, lastMouseIndex: mouseIndex});
      if (this.state.isMouseDown) {
        this.toggleBitAtLastMouseIndex(e)
      }
    }
  }

  private onMouseDown(e) {
    this.toggleBitAtLastMouseIndex(e);
    if(!this.state.isMouseDown) {
      this.setState({...this.state, isMouseDown: true});
    }
  }

  private onMouseUp(e) {
    if(this.state.isMouseDown) {
      this.setState({...this.state, isMouseDown: false});
    }
  }

  private getMouseIndexOnCanvas(event) {
    const el = document.getElementById("character");
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
    var newArr = this.state.character.data.map(function(arr) {
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
    this.props.updateState([s.led, s.pendingCharacter], new Character(['[pattern]'], new BitArray([].concat.apply([], this.state.character.data)), this.state.character.width));
  }

  render() {

    return (
      <Grid container item>
        <Grid item container md={3}>
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
        <Grid item container md={9}>
          <canvas id="character" width="400" height="400" />
          <input type="button" value="Save" onClick={this.onSave}/>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(themeDependantStyles)(AlphabetSection);