import * as React from 'react'
import { withStyles, WithStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import TooltipSlider from './TooltipSlider';

interface TimelineState {

}

interface TimelinePropsOpt {
  min?: number,
  max?: number,
  step?: number
}

interface TimelineProps {
  min?: number,
  max?: number,
  step?: number,
  removeLeftTransition?: boolean,
  id: string,
  lastCapturedValue: number,
  onChangeCapture: (property, value) => void
}

const styles = StyleSheet.create({
  styleDragEndNoLeftTransition: {
    transition: 'left 0s, top 0.2s'
  }
});

class Timeline extends React.Component<TimelineProps & WithStyles<'thumb'> & WithStyles<'root'> & WithStyles<'container'>, TimelineState> {
  state = {
    active: false, 
    value: this.props.lastCapturedValue
  }

  constructor(props) {
    super(props);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
      if (this.props.lastCapturedValue != prevProps.lastCapturedValue && this.state.active == false) {
        console.log(this.props.lastCapturedValue);
        this.setState((prevState) => ({ ...prevState, value: this.props.lastCapturedValue }));
      }
  }

  onDragStart() {
    this.setState((prevState) => ({ ...prevState, active: true }));
  }

  onDragEnd(value) {
    console.log("test'")
    this.setState((prevState) => ({ ...prevState, active: false }));
    this.props.onChangeCapture(this.props.id, value);
  }

  render() {
    return (
      <TooltipSlider 
        {...this.props}
        lastCapturedValue={this.state.value}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      />
    )
  }
}

export default withStyles({
  root: {
    padding: "32px 0px"
  },
  track: {
    transitionDuration: '0s'
  },
  thumb: {
    transition: 'width 150ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,height 150ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,left 0s cubic-bezier(0.0, 0, 0.2, 1) 0ms,right 150ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,top 150ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,box-shadow 150ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;'
  }
})(Timeline);