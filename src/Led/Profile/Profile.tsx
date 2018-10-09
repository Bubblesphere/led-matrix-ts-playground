import * as React from 'react';
import { Component, ReactNode } from 'react';
import TooltipSlider from '../../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import { Grid, Select, MenuItem, Switch, Typography } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix } from 'led-matrix-ts';
import { panelTypes, renderers, LedMovementState } from '../LedMatrix/led-map';
import SelectCustom from '../../Inputs/Select';
import SwitchCustom from '../../Inputs/Switch';
import TextFieldCustom from '../../Inputs/TextField';
import { MenuItemProps } from '@material-ui/core/MenuItem';

interface ProfileState {

}

export interface ProfileProps {
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
});

class Profile extends Component<ProfileProps, ProfileState> {
  ledMatrix: LedMatrix;

  constructor(props) {
    super(props);
    //this.handleChangesMovement = this.handleChangesMovement.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
  }

  /*
  handleChangesMovement(event) {
    this.handleChanges(event.target.name, Number(event.target.dataset.value) as LedMovementState);
  }
  */

  handleChanges(property, value) {
    this.props.onChange(property, value);
  }

  render() {

    return (
      <Grid item={true} container={true} direction={"column"}>
    
        <Typography gutterBottom={true} variant={"headline"}>Profile</Typography>

        <ProfileFormItem name="panel">
          <SelectCustom
            id="panelType"
            menuItems={panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
            onInputCaptured={this.handleChanges}
            value={this.props.panelType}
          />
        </ProfileFormItem>

        <ProfileFormItem name="renderer">
          <SelectCustom
            id="rendererType"
            menuItems={renderers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
            onInputCaptured={this.handleChanges}
            value={this.props.rendererType}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Increment">
          <TooltipSlider 
            id="increment"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.increment} 
            onInputCaptured={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="FPS">
          <TooltipSlider 
            id="fps"
            min={0} 
            max={60} 
            lastCapturedValue={this.props.fps} 
            onInputCaptured={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Width">
          <TooltipSlider 
            id="width"
            min={1} 
            max={200} 
            lastCapturedValue={this.props.width} 
            onInputCaptured={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Spacing">
          <TooltipSlider 
            id="spacing"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.spacing} 
            onInputCaptured={this.handleChanges} 
          />
        </ProfileFormItem>



        <ProfileFormItem name="Size">
          <TooltipSlider 
            id="size"
            min={1} 
            max={5} 
            lastCapturedValue={this.props.size} 
            onInputCaptured={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Reverse">
          <SwitchCustom
            checked={this.props.reverse}
            id="reverse"
            onInputCaptured={this.handleChanges}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Top">
          <TooltipSlider 
            id="paddingTop"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingTop}
            onInputCaptured={this.handleChanges}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Right">
          <TooltipSlider 
            id="paddingRight"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingRight}
            onInputCaptured={this.handleChanges}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Bottom">
          <TooltipSlider 
            id="paddingBottom"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingBottom}
            onInputCaptured={this.handleChanges}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding Left">
          <TooltipSlider 
            id="paddingLeft"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingLeft}
            onInputCaptured={this.handleChanges}
          />
        </ProfileFormItem>


      </Grid>
    );
  }
}

export default Profile;
