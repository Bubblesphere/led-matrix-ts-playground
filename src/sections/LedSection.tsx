import * as React from 'react'
import { Grid, WithStyles, withStyles, Theme, createStyles, IconButton } from '@material-ui/core';
import Fullscreen from '@material-ui/icons/Fullscreen';
import { AppState } from '../App';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

import LedPlaybackControl from './led/LedPlaybackControl';
import LedInput from '../components/led/LedInput';
import LedPanel from '../components/led/LedPanel';
import LedConfiguration from './led/LedConfiguration';

const styles = StyleSheet.create({
  configuration: {
    Height: '100vh',
    overflowY: "auto"
  }
});

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  fullScreen: {
    color: palette.primary.main,
    fontSize: typography.fontSize * 4
  },
  gridLedContent: {
    padding: spacing.unit * 4
  },
  gridLed: {
    background: 'rgb(240, 240, 240)'
  }
});

interface LedSectionProps extends AppState {};

const LedSection: React.SFC<LedSectionProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  const {classes, ...propsWithoutClasses} = props;
  return (
    <Grid item container direction={"row-reverse"} className={props.classes.gridLed}>
      

      <Grid item container justify="center"  direction="column" alignItems="center" md={9} className={props.classes.gridLedContent}>
        
        <Grid item container justify="flex-start">
          <LedInput 
            updateState={props.updateState}
            errors={props.errors}
            input={props.ledSettings.input} 
          />
        </Grid>

        <Grid item container justify="center">
          <Grid item container id="canvas-container">
            <LedPanel 
              width={props.ledSettings.viewportWidth} 
              height={props.height} 
              onRendererChanged={props.onRendererChanged} 
              maxHeightPixel="50vh" 
              rendererType={props.ledSettings.rendererType} 
            />
          </Grid>
        </Grid>

        <Grid item container alignItems="center" justify="space-between">
          <Grid item>
            <LedPlaybackControl 
              updateState={props.updateState}
              playbackMode={props.playbackMode} 
            />
          </Grid>

          <Grid item >
            <Link to={'/fullscreen'}>
              <IconButton>
                <Fullscreen  className={classes.fullScreen}/>
              </IconButton>
            </Link>
          </Grid>

        </Grid>

      </Grid>

      <Grid item container md={3} className={css(styles.configuration)}>
        <LedConfiguration 
          ledSettings={props.ledSettings}
          updateState={props.updateState} 
        />
      </Grid>
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(LedSection);