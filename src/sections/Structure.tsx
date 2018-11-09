import * as React from 'react';
import { Component } from 'react';
import { Grid, WithStyles, createStyles, withStyles, Theme  } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType } from 'led-matrix-ts';
import { LedMovementState } from '../utils/led-map';
import { RGBColor } from 'react-color';
import LedSection from './LedSection';
import AlphabetSection from './AlphabetSection';
import Menu from './Menu';
import LedPanel from '../components/led/LedPanel';
import { Character } from 'led-matrix-ts';
import { AppState } from '../App';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';

interface StrutureProps extends AppState { }
interface StructureState {}

const themeDependantStyles = ({palette}: Theme) => createStyles({
  app: {
    margin: 0,
    flexFlow: "column",
    height: '100vh',
    width: '100%'
  },
  menu: {
    flex: '0 1 80px',
    background: palette.grey["800"],
    color: palette.getContrastText(palette.grey["800"]),
  },
  fullScreen: {
    background: palette.grey["900"]
  }
});

class Structure extends Component<StrutureProps & WithStyles<typeof themeDependantStyles>, StructureState> {

  constructor(props) {
    super(props);
    this.renderLed = this.renderLed.bind(this);
    this.renderAlphabet = this.renderAlphabet.bind(this);
    this.renderFullscreen = this.renderFullscreen.bind(this);
    this.renderNotFullscreen = this.renderNotFullscreen.bind(this);
  }

  onRouteChange() {
  }

  renderLed() {
    return (
      <LedSection {...this.props.led} />
    );
  }

  renderAlphabet() {
    return (
      <AlphabetSection 
        updateState={this.props.led.updateState} 
        loadedCharacters={this.props.led.loadedCharacters} 
        errorPendingCharacter={this.props.led.error.pendingCharacter}
        errorPendingEditCharacter={this.props.led.error.pendingEditCharacter}
        errorPendingDeleteCharacter={this.props.led.error.pendingDeleteCharacter}
        pendingCharacter={this.props.led.pendingCharacter != null}
        canvasParameters={this.props.led.canvaParameters}
      />
    );
  }

  renderMenu() {
    return (
      <Menu />
    )
  }

  renderFullscreen() {
    return (
      <Grid 
        item 
        container 
        direction="column" 
        className={[this.props.classes.app, this.props.classes.fullScreen].join(' ')} 
        alignItems="center" 
        justify="center" 
        alignContent="center"
        id="canvas-container"
      >
        <LedPanel width={this.props.led.viewportWidth} height={this.props.led.height}  maxHeightPixel="100vh" rendererType={this.props.led.rendererType} />
      </Grid>
    );
  }

  renderNotFullscreen() {
    return (
      <Grid item container direction="column" className={this.props.classes.app}>
        <Grid container item xs={12} className={this.props.classes.menu}>
          <Route path="/" render={this.renderMenu} />
        </Grid>
        <Grid container item xs={12}>
          <Route exact path="/" render={this.renderLed} />
          <Route exact path="/alphabet" render={this.renderAlphabet} />
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Grid container>
        <Switch>
          <Route exact path="/fullscreen" render={this.renderFullscreen} />
          <Route path="/" render={this.renderNotFullscreen} />
        </Switch>
      </Grid>
    );
  }
}

export default withStyles(themeDependantStyles)(Structure);