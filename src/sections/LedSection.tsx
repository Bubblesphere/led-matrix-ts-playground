import * as React from 'react'
import { Grid, WithStyles, withStyles, Theme, createStyles, IconButton } from '@material-ui/core';
import Fullscreen from '@material-ui/icons/Fullscreen';
import { LedState } from '../App';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

import LedMovementControl from './LedMovementControl';
import LedInput from '../components/led/LedInput';
import LedPanel from '../components/led/LedPanel';
import LedConfiguration from './LedConfiguration';

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

interface LedSectionProps extends LedState {};

const LedSection: React.SFC<LedSectionProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  const {classes, ...propsWithoutClasses} = props;
  return (
    <Grid item container direction={"row-reverse"} className={props.classes.gridLed}>
      

      <Grid item container justify="center"  direction="column" alignItems="center" md={9} className={props.classes.gridLedContent}>
        
        <Grid item container justify="flex-start">
          <LedInput {...propsWithoutClasses} />
        </Grid>

        <Grid item container justify="center">
          <Grid item container id="canvas-container">
            <LedPanel width={props.viewportWidth} height={props.height} onRendererChanged={props.onRendererChanged} maxHeightPixel="50vh" rendererType={props.rendererType} />
          </Grid>
        </Grid>

        <Grid item container alignItems="center" justify="space-between">
          <Grid item>
            <LedMovementControl {...propsWithoutClasses} />
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
        <LedConfiguration {...propsWithoutClasses} />
      </Grid>
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(LedSection);