import * as React from 'react'
import { Component } from 'react';
import { Grid, withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';

export interface ToggleExpansionPanelState {
  expanded: number
}

export interface ToggleExpansionPanelPropsOpt {
  expanded: number
  onChange: (number) => void
}

export interface ToggleExpansionPanelProps extends ToggleExpansionPanelPropsOpt {
}

const themeDependantStyles = ({spacing}: Theme) => createStyles({
  container: {
    margin: spacing.unit * 4
  }
});


class ToggleExpansionPanel extends Component<ToggleExpansionPanelProps & WithStyles<typeof themeDependantStyles>, ToggleExpansionPanelState> {
  state = {
    expanded: 0
  };

  static defaultProps: ToggleExpansionPanelPropsOpt;

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.expanded != this.props.expanded) {
      this.setState((prevState) => ({
        ...prevState,
        expanded: this.props.expanded
      }));
    }
  }

  render() {
    const childrenWithProps = React.Children.toArray(this.props.children).map((child, index) => (
      React.cloneElement(child as React.ReactElement<any>, { 
        expanded: this.props.expanded == -1 ? this.state.expanded == index : this.props.expanded == index, 
        index: index, 
        handleExpanded: this.props.expanded == -1 ? this.handleExpanded : this.props.onChange})
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

ToggleExpansionPanel.defaultProps = {
  expanded: -1,
  onChange: () => {}
}


export default withStyles(themeDependantStyles)(ToggleExpansionPanel);