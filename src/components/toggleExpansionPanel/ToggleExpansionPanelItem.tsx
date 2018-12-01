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

const themeDependantStyles = ({typography, palette, spacing}: Theme) => createStyles({
  label: {
    fontSize: typography.fontSize,
    color: palette.text.primary
  },
  description: {
    fontSize: typography.fontSize / 1.15,
    color: palette.text.hint,
    paddingRight: spacing.unit
  }
});

interface ToggleExpansionPanelItemProps {
  label: string,
  children: ReactNode,
  centerLabel?: boolean,
  description?: string
}

const ToggleExpansionPanelItem: React.SFC<ToggleExpansionPanelItemProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <Grid item container>
      <Grid item xs={5} className={css(props.centerLabel ? styles.typoAlignCenter : styles.typoAlignStart)}>
        <Typography gutterBottom className={props.classes.label}>{props.label}</Typography>
        {
          props.description && 
          <Typography className={props.classes.description}>{props.description}</Typography>
        }
      </Grid>
      <Grid item xs={7}>
        <Grid item>
         {props.children}
        </Grid>
      </Grid>
    </Grid>
  );
}

ToggleExpansionPanelItem.defaultProps = {
  centerLabel: true,
  description: ''
}

export default withStyles(themeDependantStyles)(ToggleExpansionPanelItem);