import * as React from 'react';
import { Component } from 'react';
import { Grid, Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { Renderer, PanelFrame, RendererTypes } from 'led-matrix-ts';

export interface LedState {
}

export interface LedProps {
  maxHeightPixel: string,
  renderer: Renderer,
  rendererType: RendererTypes,
  panelFrame: PanelFrame,
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

const themeDependantStyles = ({ spacing }: Theme) => createStyles({
  characterCanvasContainer: {
    margin: `0px ${spacing.unit * 2}px`
  },
});

class LedPanel extends Component<LedProps & WithStyles<typeof themeDependantStyles>, LedState> {
  constructor(props) {
    super(props);
    this.setCanvasContainerSize = this.setCanvasContainerSize.bind(this);
  }

  componentDidMount() {
    this.setCanvasContainerSize();
    this.props.renderer.render(this.props.panelFrame);
    window.addEventListener('resize', this.setCanvasContainerSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setCanvasContainerSize);
  }

  componentDidUpdate(prevProps: LedProps, prevState) {
    if (prevProps.panelFrame && this.props.panelFrame) {
      if (!this.equal(prevProps.panelFrame, this.props.panelFrame)) {
        this.setCanvasContainerSize();
        this.props.renderer.render(this.props.panelFrame);
      }
    }
    


    if (prevProps.rendererType != this.props.rendererType) {
      this.props.onRendererChanged();
    }
  }

  private equal(array1, array2) {
    if (!Array.isArray(array1) && !Array.isArray(array2)) {
        return array1 === array2;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (var i = 0, len = array1.length; i < len; i++) {
        if (!this.equal(array1[i], array2[i])) {
            return false;
        }
    }

    return true;
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

      const optimalWidthPerBit = (totalWidth == 0 ? canvasContainer.offsetWidth : totalWidth) / this.props.panelFrame[0].length;
      const optimalHeightPerBit = (totalHeight == 0 ? canvasContainer.offsetHeight : totalHeight) / this.props.panelFrame.length;

      // scale using the lowest optimal
      let sizePerBit: number;
      if (optimalWidthPerBit < optimalHeightPerBit) {
        sizePerBit = optimalWidthPerBit
      } else {
        sizePerBit = optimalHeightPerBit
      }

      canvas.style.width = this.props.panelFrame[0].length * sizePerBit + 'px';
      canvas.style.height = this.props.panelFrame.length * sizePerBit + 'px';
    }
  }

  private setRendererElement() {
    if (this.props.rendererType == RendererTypes.ASCII) {
      return <div id={this.props.renderer.parameters.elementId} className={css(styles.ascii)} />
    } else {
      return <canvas id={this.props.renderer.parameters.elementId} className={css(styles.canvas)} />
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

export default withStyles(themeDependantStyles)(LedPanel);
