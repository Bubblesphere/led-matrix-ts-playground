import * as React from 'react'
import { Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import { s, CanUpdateState, CanUpdateStateErrors, AppErrors } from '../../App';
import TextFieldCustom from '../inputs/TextField';

const themeDependantStyles = ({typography, spacing, palette}: Theme) => createStyles({
  inputRoot: {
    fontSize: typography.fontSize * 3,
    marginBottom: spacing.unit * 4,
    paddingRight: spacing.unit * 10
  }
});

interface LedInputProps extends CanUpdateState {
  input: string
  errors: AppErrors
}

const LedInput: React.SFC<LedInputProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <Grid item={true} >
        <TextFieldCustom
            id="input"
            statePath={[s.ledSettings, s.input]}
            label={props.errors.input.isError ? props.errors.input.message : "Input"}
            value={props.input}
            onInputCaptured={props.updateState}
            error={props.errors.input.isError}
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