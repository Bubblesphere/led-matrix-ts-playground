import * as React from 'react';
import { Component } from 'react';
import { Grid, Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import { LedState as AppState, s } from '../App';
import { StyleSheet, css } from 'aphrodite';
import { RendererType } from 'led-matrix-ts';

export interface LedState {
}

export interface LedProps {
  width: number,
  height: number,
  maxHeightPixel: string,
  rendererType: RendererType,
  onRendererElementChanged: () => void
}

const styles = StyleSheet.create({
  ascii: {
    fontFamily: 'monospace',
    whiteSpace: 'pre'
  },
  canvas: {
    width: '100%'
  },
  characterCanvasContainer: {
    '@media (max-width: 600px)': {
      height: '100%'
    }
  }
});

const themeDependantStyles = ({ spacing, palette }: Theme) => createStyles({
  characterCanvasContainer: {
    margin: `${spacing.unit * 4}px ${spacing.unit * 2}px`
  },
});

class Led extends Component<LedProps & WithStyles<typeof themeDependantStyles>, LedState> {
  constructor(props) {
    super(props);
    this.setCanvasContainerSize = this.setCanvasContainerSize.bind(this);
    this.setCanvasContainerBitToSize = this.setCanvasContainerBitToSize.bind(this);
  }

  public setCanvasContainerSize() {
    const canvasContainer = document.getElementById('canvas-container') as HTMLCanvasElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    // Round to lowest {buffer} to optimize window resize event
    const buffer = 100;
    const totalWidth = Math.floor(canvasContainer.offsetWidth / buffer) * buffer;
    const totalHeight = Math.floor(canvasContainer.offsetHeight / buffer) * buffer;

    const optimalWidthPerBit = totalWidth / this.props.width;
    const optimalHeightPerBit = totalHeight / this.props.height;

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
    canvas.style.width = this.props.width * size + 'px';
    canvas.style.height = this.props.height * size + 'px';
  }

  private setRendererElement() {
    if (this.props.rendererType == RendererType.ASCII) {
      return <div id="led-matrix" className={css(styles.ascii)} />
    } else {
      return <canvas id="led-matrix" className={css(styles.canvas)} />
    }
  }

  componentDidMount() {
    this.setCanvasContainerSize();
    window.addEventListener('resize', this.setCanvasContainerSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setCanvasContainerSize);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.rendererType != this.props.rendererType) {
      this.props.onRendererElementChanged();
    }
  }

  render() {
    return (
      <Grid
        item
        container
        id="canvas-container"
        className={[this.props.classes.characterCanvasContainer, css(styles.characterCanvasContainer)].join(" ")}
        style={{ width: '100%', height: this.props.maxHeightPixel }} // need this here to draw the right size onComponentMount
        justify="center"
        alignContent="center"
        alignItems="center"
      >
        {this.setRendererElement()}
      </Grid>
    );
  }
}

export default withStyles(themeDependantStyles)(Led);
