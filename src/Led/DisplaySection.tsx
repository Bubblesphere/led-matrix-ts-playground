import * as React from 'react'
import { Grid, withStyles, WithStyles, FormControl, Theme, createStyles, IconButton } from '@material-ui/core';
import Led, {LedProps} from './LedMatrix/Led';
import { StyleSheet, css } from 'aphrodite';

import Rewind from '@material-ui/icons/FastRewindRounded';
import Resume from '@material-ui/icons/PlayArrowRounded'
import Stop from '@material-ui/icons/StopRounded'
import Pause from '@material-ui/icons/PauseRounded';

import IconButtonCustom from '../Inputs/IconButton';
import TextFieldCustom from '../Inputs/TextField';
import { LedMovementState } from './LedMatrix/led-map';

const styles = StyleSheet.create({
    display: {
        background: 'rgb(242,242,242)'
    }
});

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  inputRoot: {
    fontSize: typography.fontSize * 3,
    marginBottom: spacing.unit * 4,
    paddingRight: spacing.unit * 10
  },
  icons: {
    color: palette.primary.main,
    fontSize: typography.fontSize * 4
  },
  controlsPadding: {
    paddingLeft: spacing.unit * 10,
    paddingRight: spacing.unit * 10,
    paddingBottom: spacing.unit * 5,
    paddingTop: spacing.unit * 5,
  }
});

interface DisplaySectionProps {
    led: LedProps,
};

const DisplaySection: React.SFC<DisplaySectionProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
      <Grid container={true} justify={"center"}  direction="column" alignItems={"center"} item={true} xs={9} className={css(styles.display)}>
        <Grid item={true} container={true} justify="flex-start">
          <Grid item={true} className={props.classes.controlsPadding}>
            <TextFieldCustom
                id="input"
                label="Input"
                value={props.led.input}
                onInputCaptured={props.led.onChange}
                InputProps={{
                  classes: {
                    root: props.classes.inputRoot, 
                  },
                }}
            />
          </Grid>
        </Grid>
        
        <Grid item container justify="center">
          <Led {...props.led} />
        </Grid>

        <Grid item={true} container={true} alignItems={"center"} justify="flex-end">
          <Grid item style={{alignSelf: "flex-end"}} className={props.classes.controlsPadding} >
          {props.led.state == LedMovementState.play || props.led.state == LedMovementState.resume ? (
                <IconButtonCustom  id="state" value={LedMovementState.pause} onInputCaptured={props.led.onChange}>
                  <Pause className={[props.classes.icons].join(' ')} />
                </IconButtonCustom> 
            ) : (
                <IconButtonCustom  id="state" value={LedMovementState.resume} onInputCaptured={props.led.onChange}>
                  <Resume className={[props.classes.icons].join(' ')} />
                </IconButtonCustom>
            )}
            <IconButtonCustom  id="state" value={LedMovementState.stop} onInputCaptured={props.led.onChange}>
              <Stop className={props.classes.icons} />
            </IconButtonCustom>
          </Grid>

        </Grid>

      </Grid>
  )
}

export default withStyles(themeDependantStyles)(DisplaySection);