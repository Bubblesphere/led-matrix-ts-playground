import * as React from 'react';
import { Component } from 'react';
import { Panel, PanelProps } from './panel';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  ascii: {
    fontFamily: 'monospace',
    whiteSpace: 'pre'
  }
});

interface AsciiPanelState {
  content: string
}

export interface AsciiPanelPropsOpt {
  characterBitOn?: string,
  characterBitOff?: string,
}

export interface AsciiPanelProps extends PanelProps {}


export default class AsciiPanel extends Component<AsciiPanelProps & AsciiPanelPropsOpt, AsciiPanelState> implements Panel {
  static defaultProps: AsciiPanelPropsOpt;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps: AsciiPanelProps, prevState: AsciiPanelState) {
    if (prevProps.panelFrame != this.props.panelFrame) {
      this.draw();
    }
  }

  draw(): void {
    let output = "";
    for(var i = 0; i < this.props.panelFrame.length; i++) {
        for(var j = 0; j < this.props.panelFrame[i].length; j++) {
          output += this.props.panelFrame[i][j] == 1 ? 
            this.props.characterBitOn: 
            this.props.characterBitOff;
        }
      output += '\n';
    }
    this.setState({
      content: output
    })
  }

  render() {
    return (
      <div>
        {this.state.content}
      </div>
    )
  }
}

AsciiPanel.defaultProps = {
  characterBitOn: 'X',
  characterBitOff: ' '
}