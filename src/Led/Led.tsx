import * as React from 'react';
import { Component } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { LedMatrix, RendererType, CanvaRendererParameter, AsciiRendererParameter } from 'led-matrix-ts';
import { panelTypes, LedMovementState } from '../utils/led-map';
import { toHexString } from '../utils/Color';
import { LedState, p } from '../App';

export interface LedProps extends LedState {}

const styles = StyleSheet.create({
  ascii: {
    fontFamily: 'monospace', 
    whiteSpace: 'pre'
  },
  canvas: {
    width: '100%',
    height: '256px'
  }
});

class Led extends Component<LedProps, LedState> {
  private ledMatrixId = 'led-matrix';
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
        element: document.getElementById(this.ledMatrixId),
        rendererType: this.props.rendererType
      });
    }

    if (this.props.fps != prevProps.fps) {
      this.ledMatrix.fps = this.props.fps;
    }    
    
    if (this.props.increment != prevProps.increment) {
      this.ledMatrix.increment = this.props.increment;
    }

    if (this.props.viewportWidth != prevProps.viewportWidth) {
      this.ledMatrix.viewportWidth = this.props.viewportWidth;
    }

    if (this.props.letterSpacing != prevProps.letterSpacing) {
      this.ledMatrix.spacing = this.props.letterSpacing;
    }

    if (this.props.input != prevProps.input) {
      try {
        this.ledMatrix.input = this.props.input;
        if (this.props.error.input.isError == true) {
          this.props.onError([p.input], {
            isError: false,
            message: ''
          })
        }
      } catch(e) {
        this.props.onError([p.input], {
          isError: true,
          message: e
        })
      }
    }

    if (this.props.size != prevProps.size) {
      this.ledMatrix.size = this.props.size;
    }

    if (this.props.reverse != prevProps.reverse) {
      this.ledMatrix.reverse = this.props.reverse;
    }

    if (this.props.padding.top != prevProps.paddingTop ||
      this.props.padding.right != prevProps.paddingRight ||
      this.props.padding.bottom != prevProps.paddingBottom ||
      this.props.padding.left != prevProps.paddingLeft) {
      this.ledMatrix.padding = [this.props.padding.top, this.props.padding.right, this.props.padding.bottom, this.props.padding.left];
    }

    if (this.props.movementState != prevProps.state) {
      switch(Number(this.props.movementState) as LedMovementState) {
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

    if (this.props.rendererType == RendererType.ASCII) {
      if (this.props.asciiParameters.characterOn != prevProps.characterOn || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.props.asciiParameters.characterOn;
      }

      if (this.props.asciiParameters.characterOff != prevProps.characterOff || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.props.asciiParameters.characterOff;
      }
    } else {
      if (this.props.canvaParameters.colorOn != prevProps.colorOn || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = toHexString(this.props.canvaParameters.colorOn);
      }

      if (this.props.canvaParameters.colorOff != prevProps.colorOff || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = toHexString(this.props.canvaParameters.colorOff);
      }

      if (this.props.canvaParameters.strokeOn != prevProps.strokeOn || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = toHexString(this.props.canvaParameters.strokeOn);
      }

      if (this.props.canvaParameters.strokeOff != prevProps.strokeOff || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = toHexString(this.props.canvaParameters.strokeOff);
      }
    }
  }

  componentDidMount() {
    this.ledMatrix = new LedMatrix({
      pathCharacters: this.props.pathCharacters,
      fps: this.props.fps,
      increment: this.props.increment,
      input: this.props.input,
      panelType: this.props.panelType,
      panelWidth: this.props.viewportWidth,
      spacing: this.props.letterSpacing,
      element: document.getElementById(this.ledMatrixId),
      rendererType: this.props.rendererType,
      reverse: this.props.reverse,
      padding: [this.props.padding.top, this.props.padding.right, this.props.padding.bottom, this.props.padding.left]
    });

    if (this.props.rendererType == RendererType.ASCII) {
      (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.props.asciiParameters.characterOn;
      (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.props.asciiParameters.characterOff;
    } else {
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = toHexString(this.props.canvaParameters.colorOn);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = toHexString(this.props.canvaParameters.colorOff);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = toHexString(this.props.canvaParameters.strokeOn);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = toHexString(this.props.canvaParameters.strokeOff);
    }

    this.ledMatrix.init(this.props.size);
  }

  GetRendererElement() {
    return this.props.rendererType == RendererType.ASCII ?
      <div id={this.ledMatrixId} className={css(styles.ascii)} /> :
      <canvas id={this.ledMatrixId} className={css(styles.canvas)}/>
  }

  render() {
    return (
      <Grid item container>
        <Grid item xs={12}>
          {this.GetRendererElement()}
        </Grid>
      </Grid>
    );
  }
}

export default Led;
