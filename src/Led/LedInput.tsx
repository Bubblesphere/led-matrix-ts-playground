import * as React from 'react'
import { Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import { p, LedChangeable, LedError, LedInput } from '../App';
import TextFieldCustom from '../Inputs/TextField';

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  inputRoot: {
    fontSize: typography.fontSize * 3,
    marginBottom: spacing.unit * 4,
    paddingRight: spacing.unit * 10
  },
  controlsPadding: {
    paddingLeft: spacing.unit * 10,
    paddingRight: spacing.unit * 10,
    paddingBottom: spacing.unit * 5,
  }
});

interface LedInputProps extends LedError, LedInput, LedChangeable {}

const LedInput: React.SFC<LedInputProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <Grid item={true} className={props.classes.controlsPadding}>
        <TextFieldCustom
            id="input"
            statePath={[p.led, p.input]}
            label={props.error.input.isError ? props.error.input.message : "Input"}
            value={props.input}
            onInputCaptured={props.onChange}
            error={props.error.input.isError}
            InputProps={{
              classes: {
                  root: props.classes.inputRoot, 
              },
            }}
        />
    </Grid>
  )
}

export default withStyles(themeDependantStyles)(LedInput);