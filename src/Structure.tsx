import * as React from 'react';
import { Component } from 'react';
import { Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { PanelType, RendererType } from 'led-matrix-ts';
import { LedMovementState } from './utils/led-map';
import { RGBColor } from 'react-color';
import LedSection from './Led/LedSection';
import AlphabetSection from './Alphabet/AlphabetSection';
import Menu from './Menu/Menu';
import Led from './Led/Led';
import { Character } from 'led-matrix-ts';
import { AppState } from './App';
import { HashRouter as Router, Link, Route } from 'react-router-dom';

interface StrutureProps extends AppState { }
interface StructureState {}

const appStyles = StyleSheet.create({
  app: {
    margin: 0,
    flexFlow: "column",
    height: '100vh',
    width: '100%'
  },
  menu: {
    flex: '0 1 64px',
    background: '#444',
    color: '#bbb',
  },
  centeredVertical: {
    alignSelf: 'center'
  },
  fullScreen: {
    background: '#000'
  }
});

class Structure extends Component<StrutureProps, StructureState> {

  constructor(props) {
    super(props);
    this.renderLed = this.renderLed.bind(this);
    this.renderAlphabet = this.renderAlphabet.bind(this);
    this.renderFullscreen = this.renderFullscreen.bind(this);
    this.renderNotFullscreen = this.renderNotFullscreen.bind(this);
  }

  renderLed() {
    return (
      <LedSection {...this.props.led} />
    );
  }

  renderAlphabet() {
    return (
      <AlphabetSection updateState={this.props.led.updateState} loadedCharacters={this.props.led.loadedCharacters} />
    );
  }

  renderFullscreen() {
    return (
      <Grid 
        item 
        container 
        direction="column" 
        className={css(appStyles.app, appStyles.fullScreen)} 
        alignItems="center" 
        justify="center" 
        alignContent="center"
      >
        <Led {...this.props.led} />
      </Grid>
    );
  }

  renderNotFullscreen() {
    return (
      <Grid item container direction="column" className={css(appStyles.app)}>
        <Grid container item xs={12} className={css(appStyles.menu)}>
          <Menu />
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
        <Route exact path="/fullscreen" render={this.renderFullscreen} />
        <Route path="/" render={this.renderNotFullscreen} />
      </Grid>
    );
  }
}

export default Structure;