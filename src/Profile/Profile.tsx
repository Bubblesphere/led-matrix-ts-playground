import * as React from 'react';
import { Component, ReactNode } from 'react';
import TooltipSlider from '../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import { Grid, Typography, Checkbox, Select, MenuItem } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { StyleSheet, css } from 'aphrodite';

interface ProfileState {
  panel: number,
  increment: number,
  fps: number,
  width: number,
  spacing: number
}

interface ProfileProps {
}

const styles = StyleSheet.create({
  profiles: {
    background: '#eee'
  }
});

class Profile extends Component<ProfileProps, ProfileState> {
  state = {
    panel: 0,
    increment: 1,
    fps: 60,
    width: 80,
    spacing: 2
  }

  constructor(props) {
    super(props);
    this.handleChangesSelect = this.handleChangesSelect.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChangesSelect(event) {
    this.setState((prevState) => ({ ...prevState, increment: 6 }));
    //this.handleChanges(event.target.name, event.target.value);
  }

  handleChanges(property, value) {
    console.log(`${property}: ${value}`);
    this.setState((prevState) => ({ ...prevState, [property]: value }));
  }



  render() {
    return (
      <Grid item={true} xs={3} container={true} className={css(styles.profiles)} direction={"column"}>
    
        <ProfileFormItem name="panel">

          <Select
            name="panel"
            value={this.state.panel}
            onChange={this.handleChangesSelect}
          >
            <MenuItem value={0}>Side scrolling</MenuItem>
            <MenuItem value={1}>Vertical scrolling</MenuItem>
          </Select>
        </ProfileFormItem>

        <ProfileFormItem name="Increment">
          <TooltipSlider 
            id="increment"
            min={0} 
            max={20} 
            lastCapturedValue={this.state.increment} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="FPS">
          <TooltipSlider 
            id="fps"
            min={0} 
            max={60} 
            lastCapturedValue={this.state.fps} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Width">
          <TooltipSlider 
            id="width"
            min={1} 
            max={200} 
            lastCapturedValue={this.state.width} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Spacing">
          <TooltipSlider 
            id="spacing"
            min={0} 
            max={20} 
            lastCapturedValue={this.state.spacing} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

      </Grid>
    );
  }
}

export default Profile;
