import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix, CanvaRenderers, RendererType, Padding } from 'led-matrix-ts';
import { panelTypes, LedMovementState } from './led-map';


interface LedState {

}

export interface LedProps {
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
  paddingTop: number,
  paddingRight: number,
  paddingBottom: number,
  paddingLeft: number,
  onChange: (property, value) => void
}

const styles = StyleSheet.create({
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

    if (this.props.paddingTop != prevProps.paddingTop ||
      this.props.paddingRight != prevProps.paddingRight ||
      this.props.paddingBottom != prevProps.paddingBottom ||
      this.props.paddingLeft != prevProps.paddingLeft) {
      this.ledMatrix.padding = [this.props.paddingTop, this.props.paddingRight, this.props.paddingBottom, this.props.paddingLeft];
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
      panelType: this.props.panelType,
      panelWidth: this.props.width,
      spacing: this.props.spacing,
      element: document.getElementById('led-matrix'),
      rendererType: this.props.rendererType,
      reverse: this.props.reverse,
      padding: [this.props.paddingTop, this.props.paddingRight, this.props.paddingBottom, this.props.paddingLeft]
    });

    this.ledMatrix.init(1);
  }

  GetRendererElement() {
    return this.props.rendererType == RendererType.ASCII ?
      <div id="led-matrix" style={{fontFamily: 'monospace', whiteSpace: 'pre'}}/> :
      <canvas id="led-matrix" height="256" style={{width: '100%'}}/>
  }

  render() {
    return (
      <Grid item xs={11}>
        {this.GetRendererElement()}
      </Grid>
    );
  }
}

export default Led;
