import * as React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StyleSheet, css } from 'aphrodite';

export interface ToggleExpansionPanelItemProps {
  title: string,
  expanded?: boolean,
  index?: number,
  handleExpanded?: (index: number) => void
}

const styles = StyleSheet.create({
  panel: {
    background: '#fafafa'
  }
});

const themeDependantStyles = ({palette}: Theme) => createStyles({
  title: {
    color: palette.primary.main
  }
});


const ToggleExpansionPanelItem: React.SFC<ToggleExpansionPanelItemProps & WithStyles<typeof themeDependantStyles>> = (props) => {
  const onChange = (e) => {
    // Close if already opened
    props.handleExpanded(props.expanded ? -1 : props.index);
  }

  return (
    <ExpansionPanel className={css(styles.panel)} expanded={props.expanded} data-index={props.index} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography 
          variant={"headline"} 
          classes={{root: props.classes.title}}
        >
          {props.title}
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

export default withStyles(themeDependantStyles)(ToggleExpansionPanelItem);