import * as React from 'react';
import { Component } from 'react';
import ConfigurationSection from './Led/ConfigurationSection';
import DisplaySection from './Led/DisplaySection';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType } from 'led-matrix-ts';
import { LedMovementState } from './Led/LedMatrix/led-map';
import Menu from './Menu/Menu';
import { RGBColor } from 'react-color';

interface AppProps {

}

interface AppState {
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
  colorOn: RGBColor,
  colorOff: RGBColor,
  strokeOn: RGBColor,
  strokeOff: RGBColor,
  characterOn: string,
  characterOff: string
}

const appStyles = StyleSheet.create({
  app: {
    margin: 0,
    minHeight: '100vh',
    width: '100%'
  },
  centeredVertical: {
    alignSelf: 'center'
  },
});

class App extends Component<AppProps, AppState> {
  state = {
    panelType: PanelType.SideScrollingPanel,
    rendererType: RendererType.CanvasSquare,
    increment: 1,
    fps: 25,
    width: 50,
    spacing: 1,
    input: 'Test',
    size: 1,
    state: LedMovementState.play,
    reverse: false,
    paddingTop: 1,
    paddingRight: 15,
    paddingBottom: 1,
    paddingLeft: 1,
    colorOn: { r: 39, g: 174, b: 96, a: 1} as RGBColor,
    colorOff: { r: 44, g: 62, b: 80, a: 1} as RGBColor,
    strokeOn: { r: 46, g: 204, b: 113, a: 1} as RGBColor,
    strokeOff:{ r: 52, g: 73, b: 94, a: 1} as RGBColor,
    characterOn: 'X',
    characterOff: ' '
  }

  constructor(props) {
    super(props);
    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChanges(property, value) {
    this.setState((prevState) => ({ ...prevState, [property]: value }));
  }

  render() {
    return (
        <Grid container={true} spacing={24} className={css(appStyles.app)}>
          <ConfigurationSection profile={{onChange: this.handleChanges, ...this.state}}/>
          <DisplaySection led={{onChange: this.handleChanges, ...this.state}} />
        </Grid>
    );
  }
}

export default App;
