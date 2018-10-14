import * as React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StyleSheet, css } from 'aphrodite';

export interface LedConfigurationPanelProps {
  label: string
}

const styles = StyleSheet.create({
  panel: {
    background: '#fafafa'
  }
});

const themeDependantStyles = ({spacing, palette}: Theme) => createStyles({
  title: {
    color: palette.primary.main
  }
});

const LedConfigurationPanel: React.SFC<LedConfigurationPanelProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  return (
    <ExpansionPanel className={css(styles.panel)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography 
            variant={"headline"} 
            classes={{root: props.classes.title}}
          >
            {props.label}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid 
            item 
            container 
            direction={"column"} 
            spacing={16}
          >
            {props.children}
          </Grid>
        </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(themeDependantStyles)(LedConfigurationPanel);