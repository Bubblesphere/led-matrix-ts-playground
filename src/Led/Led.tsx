import * as React from 'react';
import { Component } from 'react';
import { Grid } from '@material-ui/core';
import { LedState as AppState, s } from '../App';

export interface LedState {
  height: number;
}

export interface LedProps extends AppState {}


class Led extends Component<LedProps, LedState> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid item container>
        <Grid item xs={12}>
          {this.props.ledElement}
        </Grid>
      </Grid>
    );
  }
}

export default Led;
