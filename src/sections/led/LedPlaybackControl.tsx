import * as React from 'react'
import { Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import Resume from '@material-ui/icons/PlayArrowRounded'
import Stop from '@material-ui/icons/StopRounded'
import Pause from '@material-ui/icons/PauseRounded';
import IconButtonCustom from '../../components/inputs/IconButton';
import { s, CanUpdateState } from '../../App';
import { PlaybackMode } from '../../components/led/LedPlayer';

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  icons: {
    color: palette.primary.main,
    fontSize: typography.fontSize * 4
  },
});

interface LedPlaybackControlProps extends CanUpdateState {
    playbackMode: PlaybackMode
}

const LedPlaybackControl: React.SFC<LedPlaybackControlProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <Grid item style={{alignSelf: "flex-end"}} >
        {props.playbackMode == PlaybackMode.Play || props.playbackMode == PlaybackMode.Resume ? (
            <IconButtonCustom  
                id="state" 
                statePath={[s.playbackMode]} 
                value={PlaybackMode.Pause} 
                onInputCaptured={props.updateState}
            >
                <Pause className={[props.classes.icons].join(' ')} />
            </IconButtonCustom> 
        ) : (
            <IconButtonCustom 
                id="state" 
                statePath={[s.playbackMode]} 
                value={PlaybackMode.Resume} 
                onInputCaptured={props.updateState}
            >
                <Resume className={[props.classes.icons].join(' ')} />
            </IconButtonCustom>
        )}
        <IconButtonCustom
            id="state" 
            statePath={[s.playbackMode]} 
            value={PlaybackMode.Stop} 
            onInputCaptured={props.updateState}
        >
            <Stop className={props.classes.icons} />
        </IconButtonCustom>
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(LedPlaybackControl);