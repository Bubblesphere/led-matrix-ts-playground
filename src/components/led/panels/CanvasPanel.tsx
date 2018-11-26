
import * as React from 'react';
import { Component } from 'react';
import { CanvasPanels } from './canvas-panels'
import { Panel, PanelProps } from './panel';
import { StyleSheet, css } from 'aphrodite';
import { Grid, Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';

const styles = StyleSheet.create({
  characterCanvasContainer: {
    '@media (max-width: 600px)': {
      height: '80vh'
    }
  }
});

const themeDependantStyles = ({ spacing }: Theme) => createStyles({
  characterCanvasContainer: {
    margin: `0px ${spacing.unit * 2}px`
  },
});

export interface CanvasPanelShape {
  moveToNextBit(ctx: CanvasRenderingContext2D, i: any, j: any, w: any, h: any): void 
  drawBit(ctx: CanvasRenderingContext2D, i: any, j: any, w: any, h: any): void
}

interface CanvasPanelState {}

export interface CanvasPanelPropsOpt {
  colorBitOn?: string,
  colorBitOff?: string,
  colorStrokeOn?: string,
  colorStrokeOff?: string,
  CanvasPanelShape?: CanvasPanelShape
}

export interface CanvasPanelProps extends PanelProps {
  id: string,
  maxHeightPixel: string
}

class CanvasPanel extends Component<CanvasPanelProps & CanvasPanelPropsOpt & WithStyles<typeof themeDependantStyles>, CanvasPanelState> implements Panel {
  static defaultProps: CanvasPanelPropsOpt;

  constructor(props) {
    super(props);
    this.setCanvasContainerSize = this.setCanvasContainerSize.bind(this);
  }

  componentDidMount() {
    this.setCanvasContainerSize();
    this.draw();
    window.addEventListener('resize', this.setCanvasContainerSize);
  }

  componentWillMount() {
    window.removeEventListener('resize', this.setCanvasContainerSize);
  }

  componentDidUpdate(prevProps: CanvasPanelProps, prevState: CanvasPanelState) {
    if (prevProps.panelFrame && this.props.panelFrame) {
      if (!this.equal(prevProps.panelFrame, this.props.panelFrame)) {
        this.setCanvasContainerSize();
        this.draw();
      }
    }
  }

  public setCanvasContainerSize() {
    const ledElement = document.getElementById(this.props.id);
    const canvas = ledElement as HTMLCanvasElement;
    const canvasContainer = document.getElementById(this.props.id + '-container') as HTMLCanvasElement;

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

  draw(): void {
    const el = document.getElementById(this.props.id) as HTMLCanvasElement;
    const ctx = el.getContext("2d");

    if (el.width != el.clientWidth && el.clientWidth != 0) {
      el.width = el.clientWidth;
    }

    if (el.height != el.clientHeight && el.clientHeight != 0) {
      el.height = el.clientHeight;
    }

    ctx.clearRect(0, 0, el.width, el.height);
    const widthEachBit = Math.floor(el.width / this.props.panelFrame[0].length);
    const heightEachBit = Math.floor(el.height / this.props.panelFrame.length);
    ctx.lineWidth = 1;

    const renderBitsOfValue = (value: number, fillColor: string, strokeColor: string) => {
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      for(var i = 0; i < this.props.panelFrame.length; i++) {
        for(var j = 0; j < this.props.panelFrame[i].length; j++) {
          if (this.props.panelFrame[i][j] == value) {
            this.props.CanvasPanelShape.moveToNextBit(ctx, i, j, widthEachBit, heightEachBit);
            this.props.CanvasPanelShape.drawBit(ctx, i, j, widthEachBit, heightEachBit);
          }
        }
      }
      ctx.fill();
      ctx.stroke();
    }

    renderBitsOfValue(0, this.props.colorBitOff, this.props.colorStrokeOff);
    renderBitsOfValue(1, this.props.colorBitOn, this.props.colorStrokeOn);
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

  render() {
    return (
      <Grid
        item
        container
        id={this.props.id + '-container'}
        className={[this.props.classes.characterCanvasContainer, css(styles.characterCanvasContainer)].join(" ")}
        style={{ width: '100%', height: this.props.maxHeightPixel }} // need this here to draw the right size onComponentMount
        justify="center"
        alignContent="center"
        alignItems="center"
      >
        <canvas id={this.props.id}/>
      </Grid>
    );
  }
}

CanvasPanel.defaultProps = {
  colorBitOn: "#00B16A",
  colorBitOff: "#22313F",
  colorStrokeOn: "#67809F",
  colorStrokeOff: "#67809F",
  CanvasPanelShape: new CanvasPanels.Rect()
}

export default withStyles(themeDependantStyles)(CanvasPanel); 