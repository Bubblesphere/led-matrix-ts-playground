import * as React from 'react';
import './App.css';
import { Component } from 'react';
import Profile from './Profile/Profile';
import Led from './LedMatrix/Led';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType, Renderer } from 'led-matrix-ts';
import { LedMovementState } from './LedMatrix/enum-mapper';

/*const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Rubik',
      'sans-serif'
    ].join(','),
    fontSize: 18,
  },
});
*/
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
  menu: {
    background: '#444'
  },
  profiles: {
    background: '#eee'
  },
  main: {
    background: '#ddd'
  },
  centeredVertical: {
    alignSelf: 'center'
  }
});

class App extends Component<AppProps, AppState> {
  state = {
    panelType: PanelType.SideScrollingPanel,
    rendererType: RendererType.CanvasSquare,
    increment: 1,
    fps: 60,
    width: 80,
    spacing: 2,
    input: 'Deric',
    size: 1,
    state: LedMovementState.play
    reverse: false,
    paddingTop: 1,
    paddingRight: 1,
    paddingBottom: 1,
    paddingLeft: 1
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
        <Grid container={true} spacing={24} className="App" >
          <Grid item={true} xs={1} className={css(appStyles.menu)}>
            <p>Menu</p>
          </Grid>
          <Profile {...this.state} onChange={this.handleChanges}/>
          <Led 
            {...this.state} 
            onChange={this.handleChanges} 
            padding={[this.state.paddingTop, this.state.paddingRight, this.state.paddingBottom, this.state.paddingLeft]} 
          />
        </Grid>
    );
  }
}

export default App;
