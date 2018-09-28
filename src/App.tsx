import * as React from 'react';
import './App.css';
import ProfileTest from './Profile/ProfileTest';
import { Component } from 'react';

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
        <div className="App">
          <ProfileTest value={this.state.value}/>
        </div>
    );
  }
}

export default App;
