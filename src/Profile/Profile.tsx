import * as React from 'react';
import { Component, ReactNode } from 'react';
import TooltipSlider from '../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import { Grid, Select, MenuItem, Switch, LinearProgress } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix } from 'led-matrix-ts';
import { panelTypes, renderers, LedMovementState } from '../LedMatrix/enum-mapper';

interface ProfileState {

}

interface ProfileProps {
  panelType: PanelType,
  rendererType: number,
  increment: number,
  fps: number,
  width: number,
  spacing: number,
  input: string,
  size: number,
  state: LedMovementState,
  reverse: boolean,
  paddingTop: number,
  paddingRight: number,
  paddingBottom: number,
  paddingLeft: number
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
    this.handleChangesCheckbox = this.handleChangesCheckbox.bind(this);
    this.handleChangesInput = this.handleChangesInput.bind(this);
    this.handleChangesMovement = this.handleChangesMovement.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChangesSelect(event) {
    this.handleChanges(event.target.name, event.target.value);
  }

  handleChangesCheckbox(event) {
    this.handleChanges(event.target.name, event.target.checked);
  }

  handleChangesMovement(event) {
    this.handleChanges(event.target.name, Number(event.target.dataset.value) as LedMovementState);
  }

  handleChangesInput(event) {
    this.handleChanges(event.target.name, event.target.value == "" ? " " : event.target.value);
  }


  handleChanges(property, value) {
    this.props.onChange(property, value);
  }

  render() {
    return (
      <Grid item={true} xs={3} container={true} className={css(styles.profiles)} direction={"column"}>
    
        <ProfileFormItem name="panel">
          <Select
            name="panelType"
            value={this.props.panelType}
            onChange={this.handleChangesSelect}
          >
            {panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
          </Select>
        </ProfileFormItem>

        <ProfileFormItem name="renderer">
          <Select
            name="rendererType"
            value={this.props.rendererType}
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

                <ProfileFormItem name="Input">
          <input
            name="input"
            type="text"
            value={this.props.input}
            onChange={this.handleChangesInput}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Size">
          <TooltipSlider 
            id="size"
            min={1} 
            max={5} 
            lastCapturedValue={this.props.size} 
            onChangeCapture={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Reverse">
          <Switch
            checked={this.props.reverse}
            name="reverse"
            onChange={this.handleChangesCheckbox}
            value="reverse"
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Top">
          <TooltipSlider 
            id="paddingTop"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingTop}
            onChangeCapture={this.handleChanges}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Right">
          <TooltipSlider 
            id="paddingRight"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingRight}
            onChangeCapture={this.handleChanges}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Bottom">
          <TooltipSlider 
            id="paddingBottom"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingBottom}
            onChangeCapture={this.handleChanges}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Left">
          <TooltipSlider 
            id="paddingLeft"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingLeft}
            onChangeCapture={this.handleChanges}
          />
        </ProfileFormItem>


      </Grid>
    );
  }
}

export default Profile;
