import * as React from 'react'
import { Slider } from '@material-ui/lab';
import { SliderProps } from '@material-ui/lab/Slider';
import { withStyles, WithStyles, createStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { InputProps } from './Inputs';

interface TooltipSliderState {}

interface TooltipSliderPropsOpt {
  min?: number,
  max?: number,
  step?: number
}

interface TooltipSliderProps extends TooltipSliderPropsOpt, InputProps, SliderProps {
  lastCapturedValue: number
}

const styles = StyleSheet.create({
  tooltip: {
    fontSize: '0.75em', 
    position: 'absolute'
  },
  sliderContainer: {
    position: 'relative'
  },
  styleDragStart: {
    // While dragging the slider, we want the tooltip to follow in real-time
    transition: 'left 0s, top 0.2s'
  },
  styleDragEnd: {
    // When clicking/tapping elsewhere than where the slider button is, we want to transition smoothly
    transition: 'left 0.2s, top 0.2s'
  },
  styleActiveStart: {
    color: '#000',
    top: "4px"
  },
  styleActiveEnd: {
    color: '#777',
    top: 0
  }
});

const themeDependantStyles = () => createStyles({
  root: {
    padding: "32px 0px"
  }
});

class TooltipSlider extends React.Component<TooltipSliderProps & WithStyles<typeof themeDependantStyles>, TooltipSliderState> {
  // TODO: Auto-detect slider button's inactive offsetHeight
  private sliderButtonInactiveOffsetHeight = 12;

  // Set the default state
  state = {
    active: false, // Whether the slider is transitionning from one value to another
    tooltipPosition: 0, // The left offset to move the tooltip to
    dragging: false, // Whether the user is currently dragging the slider
    value: this.props.lastCapturedValue // The value displayed on the slider
  }
  
  static defaultProps: TooltipSliderPropsOpt;

  constructor(props) {
    super(props);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  componentDidMount() {
    this.updateTooltipPosition();
  }

  componentDidUpdate(prevProps, prevState) {
    // If the lastCapturedValue is changed, we need to updated the slider's value
    if (this.props.lastCapturedValue != prevProps.lastCapturedValue) {
      this.setState((prevState) => ({ ...prevState, value: this.props.lastCapturedValue }));
    }

    if (this.state.value != prevState.value) {
      this.updateTooltipPosition();
    }
  }

  private onChange = (event, value) => {
    this.setState((prevState) => ({ ...prevState, value: value }));
  }

  private onDragStart = () => {
    this.setState((prevState) => ({ ...prevState, active: true, dragging: true }));
  }

  private onDragEnd = () => {
    this.setState((prevState) => ({ ...prevState, dragging: false }));
  }

  private onTransitionEnd(e) {
    if (e.propertyName === 'height') {
      if (e.target.offsetHeight == this.sliderButtonInactiveOffsetHeight) {
        // Reached when the height of the slider button changes and the new height is the size of the it's inactive state
        this.props.onInputCaptured(this.props.statePath, this.state.value);
        this.setState((prevState) => ({ ...prevState, active: false }));
      }
    }
  }

  private updateTooltipPosition() {
    const sliderTooltip = document.getElementById(`slider-tooltip-${this.props.id}`);
    const slider = document.getElementById(this.props.id);
 
    // Get the position % an element should be placed if it had no width
    const basePositionPercentage = (this.state.value - this.props.min) / (this.props.max - this.props.min) * 100;
    
    // We need to move half the width of the tooltip to the left
    const offsetPositionForTooltipPercentage = (sliderTooltip.offsetWidth / 2) / slider.offsetWidth * 100;

    const actualPosition = basePositionPercentage - offsetPositionForTooltipPercentage;

    this.setState((prevState) => ({
      ...prevState, tooltipPosition: actualPosition
    }));
  }

  render() {
    const activeTooltipClass = this.state.active ? styles.styleActiveStart : styles.styleActiveEnd;
    const dragTooltipClass = this.state.dragging ? styles.styleDragStart : styles.styleDragEnd;

    const {lastCapturedValue, statePath, onInputCaptured, ...sliderProps} = this.props;
    return (
      <div 
        id={`container-${this.props.id}`} 
        className={css(styles.sliderContainer)}
      >
        <span
          id={`slider-tooltip-${this.props.id}`}
          className={css(activeTooltipClass, dragTooltipClass, styles.tooltip)}
          style={{ left: this.state.tooltipPosition + "%" }}
        >
          {this.state.value}
        </span>
        <Slider
          {...sliderProps}
          value={this.state.value}
          onChange={this.onChange}
          classes={{ ...this.props.classes }}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onTransitionEnd={this.onTransitionEnd}
        />
      </div>
    )
  }
}

TooltipSlider.defaultProps = {
  min: 0,
  max: 100,
  step: 1
}

export default withStyles(themeDependantStyles)(TooltipSlider);