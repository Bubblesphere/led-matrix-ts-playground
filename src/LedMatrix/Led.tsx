import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix, CanvaRenderers, RendererType, Padding } from 'led-matrix-ts';
import { panelTypes, LedMovementState } from './enum-mapper';


interface LedState {

}

interface LedProps {
  panelType: PanelType,
  rendererType: RendererType,
  increment: number,
  fps: number,
  width: number,
  spacing: number,
  input: string,
  size: number,
  state: LedMovementState,
  reverse: boolean,
  index: number,
  padding: Padding
  onPanelUpdate: (index, indexUpperBound) => void,
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

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.panelType != prevProps.panelType) {
      this.ledMatrix.panelType = panelTypes.filter(x => x.id == this.props.panelType)[0].id;
    }

    if (this.props.rendererType != prevProps.rendererType) {
      this.ledMatrix.setRendererFromBuilder({
        element: document.getElementById('led-matrix'),
        rendererType: this.props.rendererType
      });
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

    if (this.props.reverse != prevProps.reverse) {
      this.ledMatrix.reverse = this.props.reverse;
    }

    if (this.props.padding != prevProps.padding) {
      this.ledMatrix.padding = this.props.padding;
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
        case LedMovementState.seek:
        console.log('seek')
          this.ledMatrix.seek(this.props.index);
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
      panelType: this.props.panelType,
      panelWidth: this.props.width,
      spacing: this.props.spacing,
      element: document.getElementById('led-matrix'),
      rendererType: this.props.rendererType,
      reverse: this.props.reverse,
      padding: this.props.padding
    });

    
    this.ledMatrix.init(1);
    
    this.ledMatrix.event.panelUpdate.on((i) => {
      this.props.onPanelUpdate(this.ledMatrix.index, this.ledMatrix.indexUpperBound);
    })

  }

  GetRendererElement() {
    return this.props.rendererType == RendererType.ASCII ?
      <div id="led-matrix" style={{fontFamily: 'monospace', whiteSpace: 'pre'}}/> :
      <canvas id="led-matrix" width="1000" height="256" />
  }


  render() {
    return (
      <Grid item={true} xs={8} className={css(styles.main)}>
        {this.GetRendererElement()}
      </Grid>
    );
  }
}

export default Led;
