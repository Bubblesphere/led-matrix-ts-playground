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
  id: string,
  value: number,
  onChange: (event, value) => void
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

class TooltipSlider extends React.Component<TooltipSliderProps & WithStyles<'thumb'> & WithStyles<'root'> & WithStyles<'container'>, TooltipSliderState> {
  // TODO: Auto-detect slider button's inactive offsetHeight
  private sliderButtonInactiveOffsetHeight = 12;

  // Set the default state
  state = {
    active: false, // Whether the slider is transitionning from one value to another
    tooltipPosition: 0, // The left offset to move the tooltip to
    dragging: false // Whether the user is currently dragging the slider
  }
  
  static defaultProps: TooltipSliderPropsOpt;

  constructor(props) {
    super(props);
    this.onTransitionEndCapture = this.onTransitionEndCapture.bind(this);
  }

  componentDidMount() {
    this.updateTooltipPosition();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value != prevProps.value) {
      this.updateTooltipPosition();
    }
  }
  
  private onChange = (event, value) => {
    this.props.onChange(this.props.id, value);
  };

  private onDragStart = () => {
    this.setState((prevState) => ({ ...prevState, active: true, dragging: true }));
  }

  private onDragEnd = () => {
    this.setState((prevState) => ({ ...prevState, dragging: false }));
  }

  private onTransitionEndCapture(e) {
    if (e.propertyName === 'height') {
      if (e.target.offsetHeight == this.sliderButtonInactiveOffsetHeight) {
        // Reached when the height of the slider button changes and the new height is the size of the it's inactive state
        this.setState((prevState) => ({ ...prevState, active: false }));
      }
    }
  }

  private updateTooltipPosition() {
    const sliderTooltip = document.getElementById(`slider-tooltip-${this.props.id}`);
    const slider = document.getElementById(`slider-${this.props.id}`);

    // Get the position % an element should be placed if it had no width
    const basePositionPercentage = (this.props.value - this.props.min) / (this.props.max - this.props.min) * 100;
    
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

    return (
      <div 
        id={this.props.id} 
        className={css(styles.sliderContainer)}
      >
        <span
          id={`slider-tooltip-${this.props.id}`}
          className={css(activeTooltipClass, dragTooltipClass, styles.tooltip)}
          style={{ left: this.state.tooltipPosition + "%" }}
        >
          {this.props.value}
        </span>
        <Slider
          id={`slider-${this.props.id}`}
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          aria-labelledby={this.props.id}
          onChange={this.onChange}
          classes={{ ...this.props.classes }}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onTransitionEnd={this.onTransitionEndCapture}
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