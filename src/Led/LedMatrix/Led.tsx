import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix, CanvaRenderers, RendererType, Padding, CanvaRendererParameter, AsciiRenderer, AsciiRendererParameter } from 'led-matrix-ts';
import { panelTypes, LedMovementState } from './led-map';
import { RGBColor } from 'react-color';

interface LedState {

}

export interface LedProps {
  asciiParameters: {
    characterOff: string,
    characterOn: string,
  },
  canvaParameters: {
    colorOff: RGBColor,
    colorOn: RGBColor,
    strokeOff: RGBColor,
    strokeOn: RGBColor,
  },
  fps: number,
  increment: number,
  input: string,
  padding: {
    bottom: number,
    left: number
    right: number,
    top: number,
  },
  panelType: PanelType,
  pathToCharacters: string,
  rendererType: RendererType,
  reverse: boolean,
  size: number,
  spacing: number,
  state: LedMovementState,
  width: number,
  onChange: (value, keys) => void
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

    if (this.props.padding.top != prevProps.paddingTop ||
      this.props.padding.right != prevProps.paddingRight ||
      this.props.padding.bottom != prevProps.paddingBottom ||
      this.props.padding.left != prevProps.paddingLeft) {
      this.ledMatrix.padding = [this.props.padding.top, this.props.padding.right, this.props.padding.bottom, this.props.padding.left];
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

    if (this.props.rendererType == RendererType.ASCII) {
      if (this.props.asciiParameters.characterOn != prevProps.characterOn || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.props.asciiParameters.characterOn;
      }

      if (this.props.asciiParameters.characterOff != prevProps.characterOff || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.props.asciiParameters.characterOff;
      }
    } else {
      if (this.props.canvaParameters.colorOn != prevProps.colorOn || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = this.convertRGBColorToHexString(this.props.canvaParameters.colorOn);
      }

      if (this.props.canvaParameters.colorOff != prevProps.colorOff || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = this.convertRGBColorToHexString(this.props.canvaParameters.colorOff);
      }

      if (this.props.canvaParameters.strokeOn != prevProps.strokeOn || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = this.convertRGBColorToHexString(this.props.canvaParameters.strokeOn);
      }

      if (this.props.canvaParameters.strokeOff != prevProps.strokeOff || this.props.rendererType != prevProps.rendererType) {
        (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = this.convertRGBColorToHexString(this.props.canvaParameters.strokeOff);
      }
    }

  }

  private convertRGBColorToHexString(color: RGBColor) {
    return "#" +
      ("0" + color.r.toString(16)).slice(-2) +
      ("0" + color.g.toString(16)).slice(-2) +
      ("0" + color.b.toString(16)).slice(-2);
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
      padding: [this.props.padding.top, this.props.padding.right, this.props.padding.bottom, this.props.padding.left]
    });

    if (this.props.rendererType == RendererType.ASCII) {
      (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOn = this.props.asciiParameters.characterOn;
      (this.ledMatrix.renderer.parameters as any as AsciiRendererParameter).characterBitOff = this.props.asciiParameters.characterOff;
    } else {
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOn = this.convertRGBColorToHexString(this.props.canvaParameters.colorOn);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorBitOff = this.convertRGBColorToHexString(this.props.canvaParameters.colorOff);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOn = this.convertRGBColorToHexString(this.props.canvaParameters.strokeOn);
      (this.ledMatrix.renderer.parameters as any as CanvaRendererParameter).colorStrokeOff = this.convertRGBColorToHexString(this.props.canvaParameters.strokeOff);
    }

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
