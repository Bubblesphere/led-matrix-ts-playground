import { PanelFrame } from 'led-matrix-ts';
import * as React from 'react';
import { Component } from 'react';

interface Renderer {
  panelFrame: PanelFrame
}

interface CanvasRendererState {}
export interface CanvasRendererProps extends Renderer {
  colorBitOn?: string,
  colorBitOff?: string,
  colorStrokeOn?: string,
  colorStrokeOff?: string
}
class CanvasRenderer extends Component<CanvasRendererProps, CanvasRendererState> {
  state = {
    colorBitOn: "#00B16A",
    colorBitOff: "#22313F",
    colorStrokeOn: "#67809F",
    colorStrokeOff: "#67809F"
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: CanvasRendererProps, prevState: CanvasRendererState) {
    if (prevProps.panelFrame != this.props.panelFrame) {
      this.drawCanvas();
    }
  }

  drawCanvas(): void {
    const el = document.getElementById('testtest') as HTMLCanvasElement;
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
            this.moveToNextBit(ctx, i, j, widthEachBit, heightEachBit);
            this.drawBit(ctx, i, j, widthEachBit, heightEachBit);
          }
        }
      }
      ctx.fill();
      ctx.stroke();
    }

    renderBitsOfValue(0, this.props.colorBitOff, this.props.colorStrokeOff);
    renderBitsOfValue(1, this.props.colorBitOn, this.props.colorStrokeOn);
  }

  render() {
    return (
      <canvas/>
    );
  }

  abstract moveToNextBit(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
  abstract drawBit(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
}
