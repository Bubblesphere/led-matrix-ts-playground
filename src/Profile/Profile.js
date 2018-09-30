import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

class Profile extends Component {
  state = {
    panel: 0,
    renderer: 1
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className="Profile">
        <h1>Profile 1</h1>
        <input type="checkbox" value="Autosave" />
        <hr/>

        
        <FormControl>
          <InputLabel htmlFor="panel">Panel</InputLabel>
          <Select
            value={this.state.panel}
            onChange={this.handleChange}
            inputProps={{
              name: 'panel',
              id: 'panel',
            }}
          >
            <MenuItem value={0}>Horizontal</MenuItem>
            <MenuItem value={1}>Vertical</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="renderer">Renderer</InputLabel>
          <Select
            value={this.state.renderer}
            onChange={this.handleChange}
            inputProps={{
              name: 'renderer',
              id: 'renderer',
            }}
          >
            <MenuItem value={0}>ASCII</MenuItem>
            <MenuItem value={1}>Canvas (Square)</MenuItem>
            <MenuItem value={2}>Canvas (Circle)</MenuItem>
          </Select>
        </FormControl>

        
        <Button variant="contained" color="primary">
      Hello World
    </Button>

        <TextField
          id="spacing"
          label="Spacing"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
      </div>
    );
  }
}

export default Profile;
