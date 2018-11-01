import * as React from 'react'
import { Component } from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StyleSheet, css } from 'aphrodite';

export interface ToggleExpansionPanelState {
  expanded: number
}

export interface ToggleExpansionPanelProps {
}

const styles = StyleSheet.create({

});

const themeDependantStyles = ({spacing, palette}: Theme) => createStyles({
  container: {
    margin: spacing.unit * 4
  }
});


class ToggleExpansionPanel extends Component<ToggleExpansionPanelProps & WithStyles<typeof themeDependantStyles>, ToggleExpansionPanelState> {
  state = {
    expanded: 0
  };
  
  constructor(props) {
    super(props);
    this.handleExpanded = this.handleExpanded.bind(this);
  }

  handleExpanded(index: number) {
    this.setState((prevState) => ({
      ...prevState,
      expanded: index
    }));
  }

  render() {
    const childrenWithProps = React.Children.toArray(this.props.children).map((child, index) => (
      React.cloneElement(child as React.ReactElement<any>, { expanded: this.state.expanded == index, index: index, handleExpanded: this.handleExpanded})
    ))
    return (
      <Grid 
        item 
        container 
        direction={"column"} 
        spacing={16}
        classes={{
          container: this.props.classes.container
        }}
        wrap="nowrap"
      >
        {
          childrenWithProps
        }
      </Grid>
    )
  }
}

export default withStyles(themeDependantStyles)(ToggleExpansionPanel);