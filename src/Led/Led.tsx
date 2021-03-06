import * as React from 'react';
import { Component } from 'react';
import { Grid, Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { RendererType } from 'led-matrix-ts';

export interface LedState {
}

export interface LedProps {
  width: number,
  height: number,
  maxHeightPixel: string,
  rendererType: RendererType,
  onRendererChanged: () => void
}

const styles = StyleSheet.create({
  ascii: {
    fontFamily: 'monospace',
    whiteSpace: 'pre'
  },
  canvas: {
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
      this.props.onRendererChanged();
    }
    if (prevProps.width != this.props.width || prevProps.height != this.props.height) {
      this.setCanvasContainerSize();
    }
  }

  public setCanvasContainerSize() {
    const ledElement = document.getElementById('led-matrix');
    if (ledElement.nodeName == "CANVAS") {
      const canvas = ledElement as HTMLCanvasElement;
      const canvasContainer = document.getElementById('led-matrix-container') as HTMLCanvasElement;
  
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
  
      canvas.style.width = this.props.width * sizePerBit + 'px';
      canvas.style.height = this.props.height * sizePerBit + 'px';
    }
  }

  private setRendererElement() {
    if (this.props.rendererType == RendererType.ASCII) {
      return <div id="led-matrix" className={css(styles.ascii)} />
    } else {
      return <canvas id="led-matrix" className={css(styles.canvas)} />
    }
  }

  render() {
    return (
      <Grid
        item
        container
        id="led-matrix-container"
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
