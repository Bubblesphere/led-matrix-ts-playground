import * as React from 'react';
import { Component } from 'react';
import TooltipSlider from '../../components/inputs/TooltipSlider';
import ToggleExpansionPanelItem from '../../components/toggleExpansionPanel/ToggleExpansionPanelItem';
import ToggleExpansionPanel from '../../components/toggleExpansionPanel/ToggleExpansionPanel';
import ToggleExpansionPanelSection from '../../components/toggleExpansionPanel/ToggleExpansionPanelSection';
import { Grid, MenuItem, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import { StyleSheet } from 'aphrodite';
import { LedMatrix, RendererType } from 'led-matrix-ts';
import { panelTypes, renderers } from '../../utils/led-map';
import SelectCustom from '../../components/inputs/Select';
import SwitchCustom from '../../components/inputs/Switch';
import ColorPickerDialog from '../../components/inputs/ColorPickerDialog';
import InputCustom from '../../components/inputs/InputCustom';
import { s, LedState } from '../../App';

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
        <ToggleExpansionPanelSection title="Panel">
          <ToggleExpansionPanelItem label="Scrolling">
            <SelectCustom
              id="panelType"
              statePath={[s.led, s.panelType]}
              menuItems={panelTypes.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
              onInputCaptured={this.props.updateState}
              value={this.props.panelType}

            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="Reverse">
            <SwitchCustom
              checked={this.props.reverse}
              statePath={[s.led, s.reverse]}
              id="reverse"
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="Increment">
            <TooltipSlider
              id="increment"
              statePath={[s.led, s.increment]}
              min={0}
              max={32}
              lastCapturedValue={this.props.increment}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="FPS">
            <TooltipSlider
              id="fps"
              statePath={[s.led, s.fps]}
              min={0}
              max={60}
              lastCapturedValue={this.props.fps}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="Viewport width">
            <TooltipSlider
              id="width"
              statePath={[s.led, s.viewportWidth]}
              min={1}
              max={200}
              lastCapturedValue={this.props.viewportWidth}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>
        </ToggleExpansionPanelSection>
        <ToggleExpansionPanelSection title="Renderer">
          <ToggleExpansionPanelItem label="Renderer">
            <SelectCustom
              id="rendererType"
              statePath={[s.led, s.rendererType]}
              menuItems={renderers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
              onInputCaptured={this.props.updateState}
              value={this.props.rendererType}
            />
          </ToggleExpansionPanelItem>

          {this.props.rendererType == RendererType.ASCII ?
            (
              <Grid item>
                <ToggleExpansionPanelItem label="Character on">
                  <InputCustom
                    id="characterOn"
                    statePath={[s.led, s.asciiParameters, s.characterOn]}
                    value={this.props.asciiParameters.characterOn}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Character off">
                  <InputCustom
                    id="characterOff"
                    statePath={[s.led, s.asciiParameters, s.characterOff]}
                    value={this.props.asciiParameters.characterOff}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>
              </Grid>
            ) : (
              <Grid item>
                <ToggleExpansionPanelItem label="Color on">
                  <ColorPickerDialog
                    id="colorOn"
                    statePath={[s.led, s.canvaParameters, s.colorOn]}
                    defaultValue={this.props.canvaParameters.colorOn}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Color off">
                  <ColorPickerDialog
                    id="colorOff"
                    statePath={[s.led, s.canvaParameters, s.colorOff]}
                    defaultValue={this.props.canvaParameters.colorOff}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Stroke on">
                  <ColorPickerDialog
                    id="strokeOn"
                    statePath={[s.led, s.canvaParameters, s.strokeOn]}
                    defaultValue={this.props.canvaParameters.strokeOn}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Stroke off">
                  <ColorPickerDialog
                    id="strokeOff"
                    statePath={[s.led, s.canvaParameters, s.strokeOff]}
                    defaultValue={this.props.canvaParameters.strokeOff}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>
              </Grid>
            )
          }
        </ToggleExpansionPanelSection>
        <ToggleExpansionPanelSection title="Board">
          <ToggleExpansionPanelItem label="Letter spacing">
            <TooltipSlider
              id="letterSpacing"
              statePath={[s.led, s.letterSpacing]}
              min={0}
              max={20}
              lastCapturedValue={this.props.letterSpacing}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="Size">
            <TooltipSlider
              id="size"
              statePath={[s.led, s.size]}
              min={1}
              max={5}
              lastCapturedValue={this.props.size}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="Padding" centerLabel={false}>
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
          </ToggleExpansionPanelItem>
        </ToggleExpansionPanelSection>
      </ToggleExpansionPanel>
    );
  }
}

export default withStyles(themeDependantStyles)(LedConfiguration);
