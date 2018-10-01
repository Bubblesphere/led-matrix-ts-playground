import * as React from 'react';
import './App.css';
import { Component } from 'react';
import Profile from './Profile/Profile';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

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
  value: string
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
    value: "test"
  }
  /*state = {
    profile: {
      fps: 30,
      increment: 1,
      input: "test",
      padding: [0],
      panelType: PanelType.SideScrollingPanel,
      panelWidth: 80,
      pathCharacters: "",
      renderer: new AsciiRenderer({
        characterBitOff: ' ',
        characterBitOn: 'X',
        element: document.getElementById('led-matrix')
      }),
      reverse: false,
      spacing: 2
    }
  };*/

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Grid container={true} spacing={24} className="App" >
          <Grid item={true} xs={1} className={css(appStyles.menu)}>
            <p>Menu</p>
          </Grid>
          <Profile/>
          <Grid item={true} xs={8} className={css(appStyles.main)}>
            <p>main</p>
          </Grid>
        </Grid>
    );
  }
}

export default App;
