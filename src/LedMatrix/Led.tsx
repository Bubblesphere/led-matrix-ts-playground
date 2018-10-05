import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix, CanvaRenderer, CanvaRenderers } from 'led-matrix-ts';
import { panelTypes, LedMovementState } from './enum-mapper';
import ProfileFormItem from '../Profile/ProfileFormItem';
import TooltipSlider from '../Inputs/TooltipSlider';


interface LedState {

}

interface LedProps {
  panel: PanelType,
  renderer: number,
  increment: number,
  fps: number,
  width: number,
  spacing: number,
  input: string,
  size: number,
  state: LedMovementState,
  onChange: (property, value) => void
}

const styles = StyleSheet.create({
  main: {
    background: '#bbb'
  }
});

class Led extends Component<LedProps, LedState> {
  ledMatrix: LedMatrix;

  constructor(props) {
    super(props);
    this.handleChangesInput = this.handleChangesInput.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleChangesMovement = this.handleChangesMovement.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.panel != prevProps.panel) {
      this.ledMatrix.panelType = panelTypes.filter(x => x.id == this.props.panel)[0].id;
    }

    if (this.props.fps != prevProps.fps) {
      this.ledMatrix.fps = this.props.fps;
    }    
    
    if (this.props.increment != prevProps.increment) {
      this.ledMatrix.increment = this.props.increment;
    }

    if (this.props.width != prevProps.width) {
      this.ledMatrix.viewportWidth = this.props.width;
    }

    if (this.props.spacing != prevProps.spacing) {
      this.ledMatrix.spacing = this.props.spacing;
    }

    if (this.props.input != prevProps.input) {
      this.ledMatrix.input = this.props.input;
    }

    if (this.props.size != prevProps.size) {
      this.ledMatrix.size = this.props.size;
    }

    if (this.props.state != prevProps.state) {
      switch(Number(this.props.state) as LedMovementState) {
        case LedMovementState.play:
          this.ledMatrix.play();
          break;
        case LedMovementState.stop:
          this.ledMatrix.stop();
          break;
        case LedMovementState.resume:
          this.ledMatrix.resume();
          break;
        case LedMovementState.pause:
          this.ledMatrix.pause();
          break;
      }
    }
  }

  componentDidMount() {
    this.ledMatrix = new LedMatrix({
      pathCharacters: `${process.env.PUBLIC_URL}/alphabet.json`,
      fps: this.props.fps,
      increment: this.props.increment,
      input: this.props.input,
      panelType: this.props.panel,
      panelWidth: this.props.width,
      spacing: this.props.spacing,
      renderer: new CanvaRenderers.Rect({
        canva: document.getElementById('led-matrix-canva') as HTMLCanvasElement
      })
    });

    this.ledMatrix.init(1, () => {
      /*this.setState({
        panel: this.ledMatrix.panelType,
        increment: this.ledMatrix.increment,
        fps: this.ledMatrix.fps,
        width: this.ledMatrix.viewportWidth,
        spacing: this.ledMatrix.spacing,
        input: this.ledMatrix.input,
        size: this.ledMatrix.size
      })*/
    });
  }

  handleChangesMovement(event) {
    this.handleChanges(event.target.name, Number(event.target.dataset.value) as LedMovementState);
  }

  handleChangesInput(event) {
    this.handleChanges(event.target.name, event.target.value == "" ? " " : event.target.value);
  }

  handleChanges(property, value) {
    this.props.onChange(property, value);
  }

  render() {
    return (
      <Grid item={true} xs={8} className={css(styles.main)}>
        <ProfileFormItem name="Input">
          <input
            name="input"
            type="text"
            value={this.props.input}
            onChange={this.handleChangesInput}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Size">
          <TooltipSlider 
            id="size"
            min={1} 
            max={5} 
            lastCapturedValue={this.props.size} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <input type="button" name="state" value="Play" data-value={LedMovementState.play} onClick={this.handleChangesMovement} />
        <input type="button" name="state" value="Stop" data-value={LedMovementState.stop} onClick={this.handleChangesMovement} />
        <input type="button" name="state" value="Pause" data-value={LedMovementState.pause} onClick={this.handleChangesMovement} />
        <input type="button" name="state" value="Resume" data-value={LedMovementState.resume} onClick={this.handleChangesMovement} />
        <div id="led-matrix" style={{fontFamily: 'monospace', whiteSpace: 'pre'}}/>
        <canvas id="led-matrix-canva" width="1000" height="256" />
      </Grid>
    );
  }
}

export default Led;
