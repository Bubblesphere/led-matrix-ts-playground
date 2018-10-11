import * as React from 'react';
import { Component, ReactNode } from 'react';
import TooltipSlider from '../../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import { Grid, Select, MenuItem, Switch, Typography, withStyles, WithStyles, Theme, createStyles, Input } from '@material-ui/core';
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
import { RGBColor } from 'react-color';
import InputCustom from '../../Inputs/InputCustom';
import { p } from '../../App';

interface ProfileState {

}

export interface ProfileProps {
  asciiParameters: {
    characterOff: string,
    characterOn: string,
  },
  canvaParameters: {
    colorOff: RGBColor,
    colorOn: RGBColor,
    strokeOff: RGBColor,
    strokeOn: RGBColor,
  },
  fps: number,
  increment: number,
  input: string,
  padding: {
    bottom: number,
    left: number
    right: number,
    top: number,
  },
  panelType: PanelType,
  pathToCharacters: string,
  rendererType: RendererType,
  reverse: boolean,
  size: number,
  spacing: number,
  state: LedMovementState,
  width: number,
  onChange: (value, ...keys) => void
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
                statePath={[p.led, p.panelType]}
                menuItems={panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
                onInputCaptured={this.handleChanges}
                value={this.props.panelType}
                
              />
            </ProfileFormItem>
            



          <ProfileFormItem name="Reverse">
              <SwitchCustom
                checked={this.props.reverse}
                statePath={[p.led, p.reverse]}
                id="reverse"
                onInputCaptured={this.handleChanges}
              />
            </ProfileFormItem>

            <ProfileFormItem name="Increment">
              <TooltipSlider 
                id="increment"
                statePath={[p.led, p.increment]}
                min={0} 
                max={20} 
                lastCapturedValue={this.props.increment} 
                onInputCaptured={this.handleChanges} 
              />
            </ProfileFormItem>

            <ProfileFormItem name="FPS">
              <TooltipSlider 
                id="fps"
                statePath={[p.led, p.fps]}
                min={0} 
                max={60} 
                lastCapturedValue={this.props.fps} 
                onInputCaptured={this.handleChanges} 
              />
            </ProfileFormItem>

            <ProfileFormItem name="Viewport width">
              <TooltipSlider 
                id="width"
                statePath={[p.led, p.width]}
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
                statePath={[p.led, p.rendererType]}
                menuItems={renderers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
                onInputCaptured={this.handleChanges}
                value={this.props.rendererType}
              />
            </ProfileFormItem>

            {this.props.rendererType == RendererType.ASCII ? 
              (
                <Grid item>
                  <ProfileFormItem name="Character on">
                    <InputCustom
                      id="characterOn"
                      statePath={[p.led, p.asciiParameters, p.characterOn]}
                      value={this.props.asciiParameters.characterOn}
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>

                  <ProfileFormItem name="Character off">
                    <InputCustom
                      id="characterOff"
                      statePath={[p.led, p.asciiParameters, p.characterOff]}
                      value={this.props.asciiParameters.characterOff}
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>
                </Grid>
              ) : (
                <Grid item>
                  <ProfileFormItem name="Color on">
                    <ColorPickerDialog 
                      id="colorOn"
                      statePath={[p.led, p.canvaParameters, p.colorOn]}
                      defaultValue={this.props.canvaParameters.colorOn}
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>

                  <ProfileFormItem name="Color off">
                    <ColorPickerDialog 
                      id="colorOff"
                      statePath={[p.led, p.canvaParameters, p.colorOff]}
                      defaultValue={this.props.canvaParameters.colorOff}
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>

                  <ProfileFormItem name="Stroke on">
                    <ColorPickerDialog 
                      id="strokeOn"
                      statePath={[p.led, p.canvaParameters, p.strokeOn]}
                      defaultValue={this.props.canvaParameters.strokeOn}
                      onInputCaptured={this.handleChanges}
                    />
                  </ProfileFormItem>

                  <ProfileFormItem name="Stroke off">
                    <ColorPickerDialog 
                      id="strokeOff"
                      statePath={[p.led, p.canvaParameters, p.strokeOff]}
                      defaultValue={this.props.canvaParameters.strokeOff}
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
            statePath={[p.led, p.spacing]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.spacing} 
            onInputCaptured={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Size">
          <TooltipSlider 
            id="size"
            statePath={[p.led, p.size]}
            min={1} 
            max={5} 
            lastCapturedValue={this.props.size} 
            onInputCaptured={this.handleChanges} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding" centerLabel={false}>
          <TooltipSlider 
            id="paddingTop"
            statePath={[p.led, p.padding, p.top]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.top}
            onInputCaptured={this.handleChanges}
          />
          <TooltipSlider 
            id="paddingRight"
            statePath={[p.led, p.padding, p.right]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.right}
            onInputCaptured={this.handleChanges}
          />
          <TooltipSlider 
            id="paddingBottom"
            statePath={[p.led, p.padding, p.bottom]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.bottom}
            onInputCaptured={this.handleChanges}
          />
          <TooltipSlider 
            id="paddingLeft"
            statePath={[p.led, p.padding, p.left]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.left}
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
