import * as React from 'react';
import { Component } from 'react';
import TooltipSlider from '../Inputs/TooltipSlider';
import LedConfigurationFormItem from './LedConfigurationFormItem';
import ToggleExpansionPanel from './ToggleExpansionPanel';
import ToggleExpansionPanelItem from './ToggleExpansionPanelItem';
import { Grid, MenuItem, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import { StyleSheet } from 'aphrodite';
import { LedMatrix, RendererType } from 'led-matrix-ts';
import { panelTypes, renderers } from '../utils/led-map';
import SelectCustom from '../Inputs/Select';
import SwitchCustom from '../Inputs/Switch';
import ColorPickerDialog from '../Inputs/ColorPickerDialog';
import InputCustom from '../Inputs/InputCustom';
import { s, LedState } from '../App';

interface ProfileState {
  activePanel: number
}

export interface LedConfigurationProps extends LedState { }

const styles = StyleSheet.create({
});

const themeDependantStyles = ({ spacing, palette }: Theme) => createStyles({
  title: {
    color: palette.primary.main
  },
  container: {
    margin: spacing.unit * 4
  }
});

class LedConfiguration extends Component<LedConfigurationProps & WithStyles<typeof themeDependantStyles>, ProfileState> {
  ledMatrix: LedMatrix;

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <ToggleExpansionPanel>
        <ToggleExpansionPanelItem title="Panel">
          <LedConfigurationFormItem label="Scrolling">
            <SelectCustom
              id="panelType"
              statePath={[s.led, s.panelType]}
              menuItems={panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
              onInputCaptured={this.props.updateState}
              value={this.props.panelType}

            />
          </LedConfigurationFormItem>

          <LedConfigurationFormItem label="Reverse">
            <SwitchCustom
              checked={this.props.reverse}
              statePath={[s.led, s.reverse]}
              id="reverse"
              onInputCaptured={this.props.updateState}
            />
          </LedConfigurationFormItem>

          <LedConfigurationFormItem label="Increment">
            <TooltipSlider
              id="increment"
              statePath={[s.led, s.increment]}
              min={0}
              max={20}
              lastCapturedValue={this.props.increment}
              onInputCaptured={this.props.updateState}
            />
          </LedConfigurationFormItem>

          <LedConfigurationFormItem label="FPS">
            <TooltipSlider
              id="fps"
              statePath={[s.led, s.fps]}
              min={0}
              max={60}
              lastCapturedValue={this.props.fps}
              onInputCaptured={this.props.updateState}
            />
          </LedConfigurationFormItem>

          <LedConfigurationFormItem label="Viewport width">
            <TooltipSlider
              id="width"
              statePath={[s.led, s.viewportWidth]}
              min={1}
              max={200}
              lastCapturedValue={this.props.viewportWidth}
              onInputCaptured={this.props.updateState}
            />
          </LedConfigurationFormItem>
        </ToggleExpansionPanelItem>
        <ToggleExpansionPanelItem title="Renderer">
          <LedConfigurationFormItem label="Renderer">
            <SelectCustom
              id="rendererType"
              statePath={[s.led, s.rendererType]}
              menuItems={renderers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
              onInputCaptured={this.props.updateState}
              value={this.props.rendererType}
            />
          </LedConfigurationFormItem>

          {this.props.rendererType == RendererType.ASCII ?
            (
              <Grid item>
                <LedConfigurationFormItem label="Character on">
                  <InputCustom
                    id="characterOn"
                    statePath={[s.led, s.asciiParameters, s.characterOn]}
                    value={this.props.asciiParameters.characterOn}
                    onInputCaptured={this.props.updateState}
                  />
                </LedConfigurationFormItem>

                <LedConfigurationFormItem label="Character off">
                  <InputCustom
                    id="characterOff"
                    statePath={[s.led, s.asciiParameters, s.characterOff]}
                    value={this.props.asciiParameters.characterOff}
                    onInputCaptured={this.props.updateState}
                  />
                </LedConfigurationFormItem>
              </Grid>
            ) : (
              <Grid item>
                <LedConfigurationFormItem label="Color on">
                  <ColorPickerDialog
                    id="colorOn"
                    statePath={[s.led, s.canvaParameters, s.colorOn]}
                    defaultValue={this.props.canvaParameters.colorOn}
                    onInputCaptured={this.props.updateState}
                  />
                </LedConfigurationFormItem>

                <LedConfigurationFormItem label="Color off">
                  <ColorPickerDialog
                    id="colorOff"
                    statePath={[s.led, s.canvaParameters, s.colorOff]}
                    defaultValue={this.props.canvaParameters.colorOff}
                    onInputCaptured={this.props.updateState}
                  />
                </LedConfigurationFormItem>

                <LedConfigurationFormItem label="Stroke on">
                  <ColorPickerDialog
                    id="strokeOn"
                    statePath={[s.led, s.canvaParameters, s.strokeOn]}
                    defaultValue={this.props.canvaParameters.strokeOn}
                    onInputCaptured={this.props.updateState}
                  />
                </LedConfigurationFormItem>

                <LedConfigurationFormItem label="Stroke off">
                  <ColorPickerDialog
                    id="strokeOff"
                    statePath={[s.led, s.canvaParameters, s.strokeOff]}
                    defaultValue={this.props.canvaParameters.strokeOff}
                    onInputCaptured={this.props.updateState}
                  />
                </LedConfigurationFormItem>
              </Grid>
            )
          }
        </ToggleExpansionPanelItem>
        <ToggleExpansionPanelItem title="Board">
          <LedConfigurationFormItem label="Letter spacing">
            <TooltipSlider
              id="letterSpacing"
              statePath={[s.led, s.letterSpacing]}
              min={0}
              max={20}
              lastCapturedValue={this.props.letterSpacing}
              onInputCaptured={this.props.updateState}
            />
          </LedConfigurationFormItem>

          <LedConfigurationFormItem label="Size">
            <TooltipSlider
              id="size"
              statePath={[s.led, s.size]}
              min={1}
              max={5}
              lastCapturedValue={this.props.size}
              onInputCaptured={this.props.updateState}
            />
          </LedConfigurationFormItem>

          <LedConfigurationFormItem label="Padding" centerLabel={false}>
            <TooltipSlider
              id="paddingTop"
              statePath={[s.led, s.padding, s.top]}
              min={0}
              max={20}
              lastCapturedValue={this.props.padding.top}
              onInputCaptured={this.props.updateState}
            />
            <TooltipSlider
              id="paddingRight"
              statePath={[s.led, s.padding, s.right]}
              min={0}
              max={20}
              lastCapturedValue={this.props.padding.right}
              onInputCaptured={this.props.updateState}
            />
            <TooltipSlider
              id="paddingBottom"
              statePath={[s.led, s.padding, s.bottom]}
              min={0}
              max={20}
              lastCapturedValue={this.props.padding.bottom}
              onInputCaptured={this.props.updateState}
            />
            <TooltipSlider
              id="paddingLeft"
              statePath={[s.led, s.padding, s.left]}
              min={0}
              max={20}
              lastCapturedValue={this.props.padding.left}
              onInputCaptured={this.props.updateState}
            />
          </LedConfigurationFormItem>
        </ToggleExpansionPanelItem>
      </ToggleExpansionPanel>
    );
  }
}

export default withStyles(themeDependantStyles)(LedConfiguration);
