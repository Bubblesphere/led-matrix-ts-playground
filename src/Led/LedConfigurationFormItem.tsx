import * as React from 'react';
import { ReactNode } from 'react';
import { Grid, Typography, withStyles, WithStyles, createStyles, Theme } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  typoAlignStart: {
    alignSelf: 'flex-start'
  },
  typoAlignCenter: {
    alignSelf: 'center'
  }
});

const themeDependantStyles = ({typography, palette}: Theme) => createStyles({
  typography: {
    fontSize: typography.fontSize,
    color: palette.text.secondary,
    letterSpacing: 1
  }
});

interface LedConfigurationFormItemProps {
  label: string,
  children: ReactNode,
  centerLabel?: boolean
}

const LedConfigurationFormItem: React.SFC<LedConfigurationFormItemProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <Grid item container>
      <Grid item xs={5} className={css(props.centerLabel ? styles.typoAlignCenter : styles.typoAlignStart)}>
        <Typography gutterBottom className={props.classes.typography}>{props.label}</Typography>
      </Grid>
      <Grid item xs={7}>
        <Grid item>
         {props.children}
        </Grid>
      </Grid>
    </Grid>
  );
}

LedConfigurationFormItem.defaultProps = {
  centerLabel: true
}

export default withStyles(themeDependantStyles)(LedConfigurationFormItem);