import * as React from 'react';
import { Component } from 'react';
import TooltipSlider from '../../Inputs/TooltipSlider';
import ProfileFormItem from './ProfileFormItem';
import ProfileSection from './ProfileSection';
import { Grid, MenuItem, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import { StyleSheet } from 'aphrodite';
import { LedMatrix, RendererType } from 'led-matrix-ts';
import { panelTypes, renderers } from '../../utils/led-map';
import SelectCustom from '../../Inputs/Select';
import SwitchCustom from '../../Inputs/Switch';
import ColorPickerDialog from '../../Inputs/ColorPickerDialog';
import InputCustom from '../../Inputs/InputCustom';
import { p, LedState } from '../../App';

interface ProfileState {

}

export interface ProfileProps extends LedState {}

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

      <ProfileSection label="Panel">
        <ProfileFormItem name="Scrolling">
          <SelectCustom
            id="panelType"
            statePath={[p.led, p.panelType]}
            menuItems={panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
            onInputCaptured={this.props.onChange}
            value={this.props.panelType}
            
          />
        </ProfileFormItem>
            
        <ProfileFormItem name="Reverse">
          <SwitchCustom
            checked={this.props.reverse}
            statePath={[p.led, p.reverse]}
            id="reverse"
            onInputCaptured={this.props.onChange}
          />
        </ProfileFormItem>

        <ProfileFormItem name="Increment">
          <TooltipSlider 
            id="increment"
            statePath={[p.led, p.increment]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.increment} 
            onInputCaptured={this.props.onChange} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="FPS">
          <TooltipSlider 
            id="fps"
            statePath={[p.led, p.fps]}
            min={0} 
            max={60} 
            lastCapturedValue={this.props.fps} 
            onInputCaptured={this.props.onChange} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Viewport width">
          <TooltipSlider 
            id="width"
            statePath={[p.led, p.viewportWidth]}
            min={1} 
            max={200} 
            lastCapturedValue={this.props.viewportWidth} 
            onInputCaptured={this.props.onChange} 
          />
        </ProfileFormItem>
      </ProfileSection>

      <ProfileSection label="Renderer">
        <ProfileFormItem name="Renderer">
          <SelectCustom
            id="rendererType"
            statePath={[p.led, p.rendererType]}
            menuItems={renderers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
            onInputCaptured={this.props.onChange}
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
                onInputCaptured={this.props.onChange}
              />
            </ProfileFormItem>

            <ProfileFormItem name="Character off">
              <InputCustom
                id="characterOff"
                statePath={[p.led, p.asciiParameters, p.characterOff]}
                value={this.props.asciiParameters.characterOff}
                onInputCaptured={this.props.onChange}
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
                onInputCaptured={this.props.onChange}
              />
            </ProfileFormItem>

            <ProfileFormItem name="Color off">
              <ColorPickerDialog 
                id="colorOff"
                statePath={[p.led, p.canvaParameters, p.colorOff]}
                defaultValue={this.props.canvaParameters.colorOff}
                onInputCaptured={this.props.onChange}
              />
            </ProfileFormItem>

            <ProfileFormItem name="Stroke on">
              <ColorPickerDialog 
                id="strokeOn"
                statePath={[p.led, p.canvaParameters, p.strokeOn]}
                defaultValue={this.props.canvaParameters.strokeOn}
                onInputCaptured={this.props.onChange}
              />
            </ProfileFormItem>

            <ProfileFormItem name="Stroke off">
              <ColorPickerDialog 
                id="strokeOff"
                statePath={[p.led, p.canvaParameters, p.strokeOff]}
                defaultValue={this.props.canvaParameters.strokeOff}
                onInputCaptured={this.props.onChange}
              />
            </ProfileFormItem>
          </Grid>
          )
        }
      </ProfileSection>

      <ProfileSection label="Board">
        <ProfileFormItem name="Letter spacing">
          <TooltipSlider 
            id="letterSpacing"
            statePath={[p.led, p.letterSpacing]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.letterSpacing} 
            onInputCaptured={this.props.onChange} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Size">
          <TooltipSlider 
            id="size"
            statePath={[p.led, p.size]}
            min={1} 
            max={5} 
            lastCapturedValue={this.props.size} 
            onInputCaptured={this.props.onChange} 
          />
        </ProfileFormItem>

        <ProfileFormItem name="Padding" centerLabel={false}>
          <TooltipSlider 
            id="paddingTop"
            statePath={[p.led, p.padding, p.top]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.top}
            onInputCaptured={this.props.onChange}
          />
          <TooltipSlider 
            id="paddingRight"
            statePath={[p.led, p.padding, p.right]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.right}
            onInputCaptured={this.props.onChange}
          />
          <TooltipSlider 
            id="paddingBottom"
            statePath={[p.led, p.padding, p.bottom]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.bottom}
            onInputCaptured={this.props.onChange}
          />
          <TooltipSlider 
            id="paddingLeft"
            statePath={[p.led, p.padding, p.left]}
            min={0} 
            max={20} 
            lastCapturedValue={this.props.padding.left}
            onInputCaptured={this.props.onChange}
          />
        </ProfileFormItem>
      </ProfileSection>

      </Grid>
    );
  }
}

export default withStyles(themeDependantStyles)(Profile);
