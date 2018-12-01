import * as React from 'react';
import { Component } from 'react';
import TooltipSlider from '../../components/inputs/TooltipSlider';
import ToggleExpansionPanelItem from '../../components/toggleExpansionPanel/ToggleExpansionPanelItem';
import ToggleExpansionPanel from '../../components/toggleExpansionPanel/ToggleExpansionPanel';
import ToggleExpansionPanelSection from '../../components/toggleExpansionPanel/ToggleExpansionPanelSection';
import { Grid, MenuItem, withStyles, WithStyles, Theme, createStyles, Button } from '@material-ui/core';
import { StyleSheet } from 'aphrodite';
import { LedMatrix } from 'led-matrix-ts';
import { scrollers } from '../../utils/led-map';
import { panels, PanelTypes } from '../../components/led/panels/panel';
import SelectCustom from '../../components/inputs/Select';
import SwitchCustom from '../../components/inputs/Switch';
import ColorPickerDialog from '../../components/inputs/ColorPickerDialog';
import InputCustom from '../../components/inputs/InputCustom';
import { s, LedSettingsState, CanUpdateState } from '../../App';

import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

interface ProfileState {
  showAdvancedConfigurations: boolean
}

export interface LedConfigurationProps extends CanUpdateState {
  ledSettings: LedSettingsState
}

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

  state = {
    showAdvancedConfigurations: false,
    showAdvancedAppearance: false
  }

  constructor(props) {
    super(props);
    this.toggleAdvancedConfigurations = this.toggleAdvancedConfigurations.bind(this);
  }

  toggleAdvancedConfigurations() {
    this.setState((prevState) => ({
      ...prevState,
      showAdvancedConfigurations: !prevState.showAdvancedConfigurations
    }));
  }

  render() {

    return (
      <ToggleExpansionPanel>

        <ToggleExpansionPanelSection title="Configurations">
          <ToggleExpansionPanelItem label="Scrolling">
            <SelectCustom
              id="scrollerType"
              statePath={[s.ledSettings, s.scrollerType]}
              menuItems={scrollers.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
              onInputCaptured={this.props.updateState}
              value={this.props.ledSettings.scrollerType}

            />
          </ToggleExpansionPanelItem>


          <ToggleExpansionPanelItem label="Speed" description="in frames per second">
            <TooltipSlider
              id="fps"
              statePath={[s.ledSettings, s.fps]}
              min={0}
              max={60}
              lastCapturedValue={this.props.ledSettings.fps}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="Width">
            <TooltipSlider
              id="width"
              statePath={[s.ledSettings, s.viewportWidth]}
              min={1}
              max={200}
              lastCapturedValue={this.props.ledSettings.viewportWidth}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          <ToggleExpansionPanelItem label="Size" description={`${this.props.ledSettings.size}x original size`}>
            <TooltipSlider
              id="size"
              statePath={[s.ledSettings, s.size]}
              min={1}
              max={5}
              lastCapturedValue={this.props.ledSettings.size}
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>
          <ToggleExpansionPanelItem label="Reverse">
            <SwitchCustom
              checked={this.props.ledSettings.reverse}
              statePath={[s.ledSettings, s.reverse]}
              id="reverse"
              onInputCaptured={this.props.updateState}
            />
          </ToggleExpansionPanelItem>

          {
            this.state.showAdvancedConfigurations &&
            <React.Fragment >
              <ToggleExpansionPanelItem label="Increment">
                <TooltipSlider
                  id="increment"
                  statePath={[s.ledSettings, s.increment]}
                  min={0}
                  max={32}
                  lastCapturedValue={this.props.ledSettings.increment}
                  onInputCaptured={this.props.updateState}
                />
              </ToggleExpansionPanelItem>




              <ToggleExpansionPanelItem label="Character Spacing">
                <TooltipSlider
                  id="letterSpacing"
                  statePath={[s.ledSettings, s.letterSpacing]}
                  min={0}
                  max={20}
                  lastCapturedValue={this.props.ledSettings.letterSpacing}
                  onInputCaptured={this.props.updateState}
                />
              </ToggleExpansionPanelItem>

              <ToggleExpansionPanelItem label="Padding" description="Top, Right, Bottom, Left" centerLabel={false}>
                <TooltipSlider
                  id="paddingTop"
                  statePath={[s.ledSettings, s.padding, s.top]}
                  min={0}
                  max={20}
                  lastCapturedValue={this.props.ledSettings.padding.top}
                  onInputCaptured={this.props.updateState}
                />

                <TooltipSlider
                  id="paddingRight"
                  statePath={[s.ledSettings, s.padding, s.right]}
                  min={0}
                  max={20}
                  lastCapturedValue={this.props.ledSettings.padding.right}
                  onInputCaptured={this.props.updateState}
                />
                <TooltipSlider
                  id="paddingBottom"
                  statePath={[s.ledSettings, s.padding, s.bottom]}
                  min={0}
                  max={20}
                  lastCapturedValue={this.props.ledSettings.padding.bottom}
                  onInputCaptured={this.props.updateState}
                />

                <TooltipSlider
                  id="paddingLeft"
                  statePath={[s.ledSettings, s.padding, s.left]}
                  min={0}
                  max={20}
                  lastCapturedValue={this.props.ledSettings.padding.left}
                  onInputCaptured={this.props.updateState}
                />
              </ToggleExpansionPanelItem>
            </React.Fragment>
          }

          <Button onClick={this.toggleAdvancedConfigurations}>
            {this.state.showAdvancedConfigurations ? <ExpandLess /> : <ExpandMore />}
          </Button>

        </ToggleExpansionPanelSection>

        <ToggleExpansionPanelSection title="Appearance">
          <ToggleExpansionPanelItem label="Renderer">
            <SelectCustom
              id="rendererType"
              statePath={[s.ledSettings, s.panelType]}
              menuItems={panels.map(x => <MenuItem key={x.id} value={x.id}>{x.text}</MenuItem>)}
              onInputCaptured={this.props.updateState}
              value={this.props.ledSettings.panelType}
            />
          </ToggleExpansionPanelItem>
          {this.props.ledSettings.panelType == PanelTypes.Ascii ?
            (
              <React.Fragment>
                <ToggleExpansionPanelItem label="Character on">
                  <InputCustom
                    id="characterOn"
                    statePath={[s.ledSettings, s.asciiParameters, s.characterOn]}
                    value={this.props.ledSettings.asciiParameters.characterOn}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Character off">
                  <InputCustom
                    id="characterOff"
                    statePath={[s.ledSettings, s.asciiParameters, s.characterOff]}
                    value={this.props.ledSettings.asciiParameters.characterOff}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ToggleExpansionPanelItem label="Color on">
                  <ColorPickerDialog
                    id="colorOn"
                    statePath={[s.ledSettings, s.canvaParameters, s.colorOn]}
                    defaultValue={this.props.ledSettings.canvaParameters.colorOn}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Color off">
                  <ColorPickerDialog
                    id="colorOff"
                    statePath={[s.ledSettings, s.canvaParameters, s.colorOff]}
                    defaultValue={this.props.ledSettings.canvaParameters.colorOff}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Stroke on">
                  <ColorPickerDialog
                    id="strokeOn"
                    statePath={[s.ledSettings, s.canvaParameters, s.strokeOn]}
                    defaultValue={this.props.ledSettings.canvaParameters.strokeOn}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>

                <ToggleExpansionPanelItem label="Stroke off">
                  <ColorPickerDialog
                    id="strokeOff"
                    statePath={[s.ledSettings, s.canvaParameters, s.strokeOff]}
                    defaultValue={this.props.ledSettings.canvaParameters.strokeOff}
                    onInputCaptured={this.props.updateState}
                  />
                </ToggleExpansionPanelItem>
              </React.Fragment>
            )
          }
        </ToggleExpansionPanelSection>
      </ToggleExpansionPanel >
    );
  }
}

export default withStyles(themeDependantStyles)(LedConfiguration);
