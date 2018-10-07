import * as React from 'react';
import { Component } from 'react';
import Profile from './Profile/Profile';
import Led from './LedMatrix/Led';
import { Grid, Tooltip } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType, Renderer } from 'led-matrix-ts';
import { LedMovementState } from './LedMatrix/enum-mapper';

import GridOn from '@material-ui/icons/GridOn';
import Translate from '@material-ui/icons/Translate';

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
  app: {
    margin: 0,
    minHeight: '100vh'
  },
  menu: {
    background: '#444',
    flex: '0 0 64px',
    color: '#bbb',

  },
  centeredVertical: {
    alignSelf: 'center'
  },
  icon: {
    fontSize: 32,
    marginBottom: '16px',
    ':hover': {
      color: 'white',
      cursor: 'pointer'
    }
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
          
          <Grid container={true} item={true} justify={"center"}  className={css(appStyles.menu)}>
            <Grid item={true}>
              <Tooltip title="Led Panel" enterDelay={500} placement={'right'}>
                <GridOn  className={css(appStyles.icon)} />
              </Tooltip>
              <Tooltip title="Alphabet" enterDelay={500} placement={'right'}>
                <Translate  className={css(appStyles.icon)} />
              </Tooltip>
            </Grid>
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
