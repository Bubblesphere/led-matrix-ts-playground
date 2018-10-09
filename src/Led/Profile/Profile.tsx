import * as React from 'react';
import { Component, ReactNode } from 'react';
import TooltipSlider from '../../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import { Grid, Select, MenuItem, Switch, Typography, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, LedMatrix, RendererType } from 'led-matrix-ts';
import { panelTypes, renderers, LedMovementState } from '../LedMatrix/led-map';
import SelectCustom from '../../Inputs/Select';
import SwitchCustom from '../../Inputs/Switch';
import TextFieldCustom from '../../Inputs/TextField';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ColorPickerDialog from '../../Inputs/ColorPickerDialog';

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

const themeDependantStyles = ({spacing, palette}: Theme) => createStyles({
  title: {
    color: palette.primary.main
  },
  container: {
    margin: spacing.unit * 4
  }
});

class Profile extends Component<ProfileProps & WithStyles<typeof themeDependantStyles>, ProfileState> {
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
      <Grid 
        item 
        container 
        direction={"column"} 
        spacing={16}
        classes={{
          container: this.props.classes.container
        }}
        wrap="nowrap"
      >
      <ExpansionPanel style={{background: '#fafafa'}} defaultExpanded={true}> 
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant={"headline"} classes={{root: this.props.classes.title}}>Panel</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

          <Grid 
            item 
            container 
            direction={"column"} 
            spacing={16}
          >
            <ProfileFormItem name="Scrolling">
              <SelectCustom
                id="panelType"
                menuItems={panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
                onInputCaptured={this.handleChanges}
                value={this.props.panelType}
                
              />
            </ProfileFormItem>
            



          <ProfileFormItem name="Reverse">
              <SwitchCustom
                checked={this.props.reverse}
                id="reverse"
                onInputCaptured={this.handleChanges}
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

            <ProfileFormItem name="Viewport width">
              <TooltipSlider 
                id="width"
                min={1} 
                max={200} 
                lastCapturedValue={this.props.width} 
                onInputCaptured={this.handleChanges} 
              />
            </ProfileFormItem>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>


      <ExpansionPanel style={{background: '#fafafa'}}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant={"headline"} classes={{root: this.props.classes.title}}>Renderer</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid 
            item 
            container 
            direction={"column"} 
            spacing={16}
          >
            <ProfileFormItem name="Renderer">
              <SelectCustom
                id="rendererType"
                menuItems={renderers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
                onInputCaptured={this.handleChanges}
                value={this.props.rendererType}
              />
            </ProfileFormItem>

            {this.props.rendererType == RendererType.ASCII ? 
              (
                <Grid item>
                  <ProfileFormItem name="Character on">
                    <h1>t</h1>
                  </ProfileFormItem>

                  <ProfileFormItem name="Character off">
                  <h1>t</h1>
                  </ProfileFormItem>
                </Grid>
              ) : (
                <Grid item>
                  <ProfileFormItem name="Color on">
                    <ColorPickerDialog 
                      id="colorOn"
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>

                  <ProfileFormItem name="Color off">
                    <ColorPickerDialog 
                      id="colorOff"
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>

                  <ProfileFormItem name="Stroke on">
                    <ColorPickerDialog 
                      id="strokeOn"
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>

                  <ProfileFormItem name="Stroke off">
                    <ColorPickerDialog 
                      id="strokeOff"
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>
                </Grid>
              )
            }
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>


      <ExpansionPanel style={{background: '#fafafa'}}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant={"headline"} classes={{root: this.props.classes.title}}>Board</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

          <Grid 
            item 
            container 
            direction={"column"} 
            spacing={16}
          >

        <ProfileFormItem name="Letter spacing">
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

        <ProfileFormItem name="Padding" centerLabel={false}>
          <TooltipSlider 
            id="paddingTop"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingTop}
            onInputCaptured={this.handleChanges}
          />
          <TooltipSlider 
            id="paddingRight"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingRight}
            onInputCaptured={this.handleChanges}
          />
          <TooltipSlider 
            id="paddingBottom"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingBottom}
            onInputCaptured={this.handleChanges}
          />
          <TooltipSlider 
            id="paddingLeft"
            min={0} 
            max={20} 
            lastCapturedValue={this.props.paddingLeft}
            onInputCaptured={this.handleChanges}
          />
        </ProfileFormItem>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>





      </Grid>
    );
  }
}

export default withStyles(themeDependantStyles)(Profile);
