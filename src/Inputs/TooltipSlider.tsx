import * as React from 'react'
import { Slider } from '@material-ui/lab';
import { withStyles, WithStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

interface TooltipSliderState {}

interface TooltipSliderPropsOpt {
  min?: number,
  max?: number,
  step?: number
}

interface TooltipSliderProps {
  min?: number,
  max?: number,
  step?: number,
  removeLeftTransition?: boolean,
  id: string,
  lastCapturedValue: number,
  onChangeCapture: (property, value) => void,
  onDragStart: () => void,
  onDragEnd: (value) => void
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
  styleDragEndNoLeftTransition: {
    transition: 'left 0s, top 0.2s'
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

class TooltipSlider extends React.Component<TooltipSliderProps & WithStyles<'thumb'> & WithStyles<'root'> & WithStyles<'container'>, TooltipSliderState> {
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
    if (this.props.onDragStart) {
      this.props.onDragStart();
    }
    this.setState((prevState) => ({ ...prevState, active: true, dragging: true }));
  }

  private onDragEnd = () => {

    this.setState((prevState) => ({ ...prevState, dragging: false }));
  }

  private onTransitionEnd(e) {
    if (e.propertyName === 'height') {
      if (e.target.offsetHeight == this.sliderButtonInactiveOffsetHeight) {
        if (this.props.onDragEnd) {
          this.props.onDragEnd(this.state.value);
        }
        // Reached when the height of the slider button changes and the new height is the size of the it's inactive state
        this.props.onChangeCapture(this.props.id, this.state.value);
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
    const dragTooltipClass = this.state.dragging ? styles.styleDragStart :  (this.props.removeLeftTransition ? styles.styleDragEndNoLeftTransition : styles.styleDragEnd);

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
          id={this.props.id}
          value={this.state.value}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          aria-labelledby={this.props.id}
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

export default withStyles({
  root: {
    padding: "32px 0px"
  }
})(TooltipSlider);