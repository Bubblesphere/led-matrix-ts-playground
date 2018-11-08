import * as React from 'react'
import { Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import Resume from '@material-ui/icons/PlayArrowRounded'
import Stop from '@material-ui/icons/StopRounded'
import Pause from '@material-ui/icons/PauseRounded';
import IconButtonCustom from '../Inputs/IconButton';
import { LedMovementState } from '../utils/led-map';
import { s, LedMovement, CanUpdateState } from '../App';

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  icons: {
    color: palette.primary.main,
    fontSize: typography.fontSize * 4
  },
});

interface DisplaySectionProps extends LedMovement, CanUpdateState {

}

const LedMovementControl: React.SFC<DisplaySectionProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <Grid item style={{alignSelf: "flex-end"}} >
        {props.movementState == LedMovementState.play || props.movementState == LedMovementState.resume ? (
            <IconButtonCustom  
                id="state" 
                statePath={[s.led, s.movementState]} 
                value={LedMovementState.pause} 
                onInputCaptured={props.updateState}
            >
                <Pause className={[props.classes.icons].join(' ')} />
            </IconButtonCustom> 
        ) : (
            <IconButtonCustom 
                id="state" 
                statePath={[s.led, s.movementState]} 
                value={LedMovementState.resume} 
                onInputCaptured={props.updateState}
            >
                <Resume className={[props.classes.icons].join(' ')} />
            </IconButtonCustom>
        )}
        <IconButtonCustom
            id="state" 
            statePath={[s.led, s.movementState]} 
            value={LedMovementState.stop} 
            onInputCaptured={props.updateState}
        >
            <Stop className={props.classes.icons} />
        </IconButtonCustom>
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(LedMovementControl);