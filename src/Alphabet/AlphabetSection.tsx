import * as React from 'react'
import { Slider } from '@material-ui/lab';
import { SliderProps } from '@material-ui/lab/Slider';
import { withStyles, WithStyles, createStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { bit, CanvaRenderer, CanvaRenderers } from 'led-matrix-ts';

interface AlphabetSectionState {
  character: {
    width: number,
    height: number,
    data: bit[][]
  },
  lastIndex: {
    h: number,
    w: number
  },
  isMouseDown: boolean
}

interface AlphabetSectionPropsOpt {
}

interface AlphabetSectionProps extends AlphabetSectionPropsOpt, SliderProps {
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
    lastIndex: { h: -1, w: -1},
    isMouseDown: false
  }
  
  static defaultProps: AlphabetSectionPropsOpt;

  constructor(props) {
    super(props);
    this.canvaClickHandler = this.canvaClickHandler.bind(this);
  }

  componentDidMount() {
    const el = document.getElementById("character");

    this.renderer = new CanvaRenderers.Rect({
      element: el
    })

    this.renderer.render(this.state.character.data);

    el.addEventListener('mousemove', (e) => {
      const i = this.canvaGetIndex(e);

      if (i.h != this.state.lastIndex.h || i.w != this.state.lastIndex.w) {
        this.setState({...this.state, lastIndex: Object.assign({}, i)})
        if (this.state.isMouseDown) {
          this.canvaClickHandler(e)
        }
      }


    });

    el.addEventListener('mousedown', (e) => {
      this.canvaClickHandler(e);
      if(!this.state.isMouseDown) {
        this.setState({...this.state, isMouseDown: true});
      }
    });

    el.addEventListener('mouseup', (e) => {
      if(this.state.isMouseDown) {
        this.setState({...this.state, isMouseDown: false});
      }
    })

    el.addEventListener('mouseleave', (e) => {
      if(this.state.isMouseDown) {
        this.setState({...this.state, isMouseDown: false});
      }
    })
  }

  componentWillUnmount() {
    const el = document.getElementById("character");
    el.removeEventListener('click', this.canvaClickHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.character.data != this.state.character.data) {
      this.renderer.render(this.state.character.data);
    }
  }

  private canvaGetIndex(event) {
    const el = document.getElementById("character");
    var rect = el.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  
    const w = Math.floor(x / (el.offsetWidth / this.state.character.data[0].length));
    const h = Math.floor(y / (el.offsetHeight / this.state.character.data.length));

    return {h, w}
  }

  private canvaClickHandler(event) {
    var newArr = this.state.character.data.map(function(arr) {
        return arr.slice();
    });
    
    newArr[this.state.lastIndex.h][this.state.lastIndex.w] = newArr[this.state.lastIndex.h][this.state.lastIndex.w] == 0 ? 1 : 0;
    
    this.setState((prevState) => ({
      ...prevState, 
      character: {
        ...prevState.character,
        data: newArr
      }
    }));
  }

  render() {

    return (
      <div>
        <canvas id="character" width="400" height="400" />
      </div>
    )
  }
}

AlphabetSection.defaultProps = {
}

export default withStyles(themeDependantStyles)(AlphabetSection);