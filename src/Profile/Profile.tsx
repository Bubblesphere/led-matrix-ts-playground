import * as React from 'react';
import { Component, ReactNode } from 'react';
import TooltipSlider from '../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import { Grid, Typography, Checkbox, Select, MenuItem } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix } from 'led-matrix-ts';
import { panelTypes, renderers } from '../LedMatrix/enum-mapper';


interface ProfileState {

}

interface ProfileProps {
  panel: PanelType,
  renderer: number,
  increment: number,
  fps: number,
  width: number,
  spacing: number,
  onChange: (property, value) => void
}

const styles = StyleSheet.create({
  profiles: {
    background: '#eee'
  }
});

class Profile extends Component<ProfileProps, ProfileState> {
  ledMatrix: LedMatrix;

  constructor(props) {
    super(props);
    this.handleChangesSelect = this.handleChangesSelect.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChangesSelect(event) {
    this.handleChanges(event.target.name, event.target.value);
  }

  handleChanges(property, value) {
    this.props.onChange(property, value);
  }

  render() {
    return (
      <Grid item={true} xs={3} container={true} className={css(styles.profiles)} direction={"column"}>
    
        <ProfileFormItem name="panel">
          <Select
            name="panel"
            value={this.props.panel}
            onChange={this.handleChangesSelect}
          >
            {panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
          </Select>
        </ProfileFormItem>

        <ProfileFormItem name="renderer">
          <Select
            name="renderer"
            value={this.props.renderer}
            onChange={this.handleChangesSelect}
          >
            {renderers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
          </Select>
        </ProfileFormItem>

        <ProfileFormItem name="Increment">
          <TooltipSlider 
            id="increment"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.increment} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="FPS">
          <TooltipSlider 
            id="fps"
            min={0} 
            max={60} 
            lastCapturedValue={this.props.fps} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Width">
          <TooltipSlider 
            id="width"
            min={1} 
            max={200} 
            lastCapturedValue={this.props.width} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Spacing">
          <TooltipSlider 
            id="spacing"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.spacing} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>
      </Grid>
    );
  }
}

export default Profile;
