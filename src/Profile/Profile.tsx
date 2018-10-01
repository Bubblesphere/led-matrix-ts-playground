import * as React from 'react';
import { Component, ReactNode } from 'react';
import TooltipSlider from '../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import { Grid, Typography, Checkbox } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

interface ProfileState {
  increment: number
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
    increment: 1,
    fps: 60,
    width: 80,
    spacing: 2
  }

  constructor(props) {
    super(props);
    this.handleChanges = this.handleChanges.bind(this);
  }

  private handleChanges(id, value) {
    this.setState((prevState) => ({ ...prevState, [id]: value }));
  }

  render() {
    return (
      <Grid item={true} xs={3} container={true} className={css(styles.profiles)} direction={"column"}>
    
        <ProfileFormItem name="Increment">
          <TooltipSlider 
            id="increment"
            min={0} 
            max={20} 
            value={this.state.increment} 
            onChange={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="FPS">
          <TooltipSlider 
            id="fps"
            min={0} 
            max={60} 
            value={this.state.fps} 
            onChange={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Width">
          <TooltipSlider 
            id="width"
            min={1} 
            max={200} 
            value={this.state.width} 
            onChange={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Spacing">
          <TooltipSlider 
            id="spacing"
            min={0} 
            max={20} 
            value={this.state.spacing} 
            onChange={this.handleChanges} 
          />
        </ProfileFormItem>

      </Grid>
    );
  }
}

export default Profile;
