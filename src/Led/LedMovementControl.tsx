import * as React from 'react'
import { Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import Resume from '@material-ui/icons/PlayArrowRounded'
import Stop from '@material-ui/icons/StopRounded'
import Pause from '@material-ui/icons/PauseRounded';
import IconButtonCustom from '../Inputs/IconButton';
import { LedMovementState } from '../utils/led-map';
import { p, LedMovement, LedChangeable } from '../App';

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
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

interface DisplaySectionProps extends LedMovement, LedChangeable {

}

const LedMovementControl: React.SFC<DisplaySectionProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <Grid item style={{alignSelf: "flex-end"}} className={props.classes.controlsPadding} >
        {props.movementState == LedMovementState.play || props.movementState == LedMovementState.resume ? (
            <IconButtonCustom  
                id="state" 
                statePath={[p.led, p.movementState]} 
                value={LedMovementState.pause} 
                onInputCaptured={props.onChange}
            >
                <Pause className={[props.classes.icons].join(' ')} />
            </IconButtonCustom> 
        ) : (
            <IconButtonCustom 
                id="state" 
                statePath={[p.led, p.movementState]} 
                value={LedMovementState.resume} 
                onInputCaptured={props.onChange}
            >
                <Resume className={[props.classes.icons].join(' ')} />
            </IconButtonCustom>
        )}
        <IconButtonCustom
            id="state" 
            statePath={[p.led, p.movementState]} 
            value={LedMovementState.stop} 
            onInputCaptured={props.onChange}
        >
            <Stop className={props.classes.icons} />
        </IconButtonCustom>
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(LedMovementControl);