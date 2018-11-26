import * as React from 'react';
import { Component } from 'react';
import { Grid, WithStyles, createStyles, withStyles, Theme  } from '@material-ui/core';
import LedSection from './LedSection';
import AlphabetSection from './AlphabetSection';
import MenuSection from './MenuSection';
import LedPlayer from '../components/led/LedPlayer';
import { AppState } from '../App';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';
import CanvasPanel from '../components/led/panels/CanvasPanel';
import AsciiPanel from '../components/led/panels/AsciiPanel';
import { CanvasPanels } from '../components/led/panels/canvas-panels';
import { PanelTypes } from '../components/led/panels/panel';

import { toHexString } from '../utils/color';

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
  fullScreenMode: {
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
    const {classes, ...otherProps} = this.props;
    return (
      <LedSection {...otherProps} />
    );
  }

  renderAlphabet() {
    return (
      <AlphabetSection 
        updateState={this.props.updateState} 
        loadedCharacters={this.props.ledSettings.loadedCharacters} 
        errorPendingCharacter={this.props.errors.pendingCharacter}
        errorPendingEditCharacter={this.props.errors.pendingEditCharacter}
        errorPendingDeleteCharacter={this.props.errors.pendingDeleteCharacter}
        pendingCharacter={this.props.pendingCharacter != null}
        canvasParameters={this.props.ledSettings.canvaParameters}
      />
    );
  }

  renderMenu() {
    return (
      <MenuSection />
    )
  }

  generatePanel() {
      switch (+this.props.ledSettings.panelType) {
        case PanelTypes.Ascii:
          return (
            <AsciiPanel
              characterBitOn={this.props.ledSettings.asciiParameters.characterOn}
              characterBitOff={this.props.ledSettings.asciiParameters.characterOff}
              panelFrame={null}
            />
          )
        case PanelTypes.CanvasSquare:
          return (
            <CanvasPanel
              colorBitOn={toHexString(this.props.ledSettings.canvaParameters.colorOn)}
              colorBitOff={toHexString(this.props.ledSettings.canvaParameters.colorOff)}
              colorStrokeOn={toHexString(this.props.ledSettings.canvaParameters.strokeOn)}
              colorStrokeOff={toHexString(this.props.ledSettings.canvaParameters.strokeOff)}
              CanvasPanelShape={new CanvasPanels.Rect()}
              id='panel-player'
              maxHeightPixel='100vh'
              panelFrame={null}
            />
          )
        case PanelTypes.CanvasCircle:
        return (
          <CanvasPanel 
            colorBitOn={toHexString(this.props.ledSettings.canvaParameters.colorOn)}
            colorBitOff={toHexString(this.props.ledSettings.canvaParameters.colorOff)}
            colorStrokeOn={toHexString(this.props.ledSettings.canvaParameters.strokeOn)}
            colorStrokeOff={toHexString(this.props.ledSettings.canvaParameters.strokeOff)}
            CanvasPanelShape={new CanvasPanels.Ellipse()}
            id='panel-player'
            maxHeightPixel='100vh'
            panelFrame={null}
          />
        )
      }
  }

  renderFullscreen() {
    return (
      <Grid 
        item 
        container 
        direction="column" 
        className={[this.props.classes.app, this.props.classes.fullScreenMode].join(' ')} 
        alignItems="center" 
        justify="center" 
        alignContent="center"
        id="canvas-container"
      >
        <LedPlayer
          fps={this.props.ledSettings.fps}
          playbackMode={this.props.playbackMode}
          sequence={this.props.sequence}
        >
          {this.generatePanel()}
        </LedPlayer>
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