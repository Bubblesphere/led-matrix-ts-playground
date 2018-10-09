import * as React from 'react';
import { Component } from 'react';
import ConfigurationSection from './Led/ConfigurationSection';
import DisplaySection from './Led/DisplaySection';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType } from 'led-matrix-ts';
import { LedMovementState } from './Led/LedMatrix/led-map';
import Menu from './Menu/Menu';

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
  state: LedMovementState
  reverse: boolean
}

const appStyles = StyleSheet.create({
  app: {
    margin: 0,
    minHeight: '100vh'
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
    input: 'Welcome fellow visitor',
    size: 1,
    state: LedMovementState.play,
    reverse: false,
    paddingTop: 1,
    paddingRight: 10,
    paddingBottom: 1,
    paddingLeft: 10
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
          <Menu/>
          <ConfigurationSection profile={{onChange: this.handleChanges, ...this.state}}/>
          <DisplaySection led={{onChange: this.handleChanges, ...this.state}} />
        </Grid>
    );
  }
}

export default App;
