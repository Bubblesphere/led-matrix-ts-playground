import * as React from 'react'
import { Grid, WithStyles, withStyles, Theme, createStyles, IconButton } from '@material-ui/core';
import Fullscreen from '@material-ui/icons/Fullscreen';
import { LedState } from '../App';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';

import LedMovementControl from './LedMovementControl';
import LedInput from './LedInput';
import Led from './Led';
import LedConfiguration from './LedConfiguration';

const styles = StyleSheet.create({
  common: {
      background: 'rgb(240, 240, 240)'
  },
  configuration: {
    maxHeight: '100vh',
    overflowY: "auto"
  }
});

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  fullScreenContainer: {
    marginRight: spacing.unit * 10,
    marginTop: spacing.unit * 5,
  },
  fullScreen: {
    color: palette.primary.main,
    fontSize: typography.fontSize * 4
  }
});

interface LedSectionProps extends LedState {};

const LedSection: React.SFC<LedSectionProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  const {classes, ...propsWithoutClasses} = props;
  return (
    <Grid item container >
      <Grid item container md={3} className={css(styles.common, styles.configuration)}>
        <LedConfiguration {...propsWithoutClasses} />
      </Grid>

      <Grid item container justify="center"  direction="column" alignItems="center" xs={9} className={css(styles.common)}>
        
        <Grid item container justify="flex-end">
          <Link to={'/fullscreen'}>
            <IconButton className={classes.fullScreenContainer}>
              <Fullscreen  className={classes.fullScreen}/>
            </IconButton>
          </Link>
        </Grid>

        <Grid item container justify="flex-start">
          <LedInput {...propsWithoutClasses} />
        </Grid>

        <Grid item container justify="center">
          <Grid item container  xs={11}>
            <Led {...propsWithoutClasses} />
          </Grid>
        </Grid>

        <Grid item container alignItems="center" justify="flex-end">
          <LedMovementControl {...propsWithoutClasses} />
        </Grid>

      </Grid>
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(LedSection);