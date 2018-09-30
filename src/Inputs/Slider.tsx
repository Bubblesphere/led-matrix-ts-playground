import * as React from 'react'
import { Slider } from '@material-ui/lab';
import { Typography, withStyles, WithStyles } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

interface SliderState {
  value?: number,
}

interface SliderPropsOpt {
  min?: number,
  max?: number,
  step?: number,
  label?: string,
}

interface SliderProps {
  min?: number,
  max?: number,
  step?: number,
  label?: string,
  id: string
}

const styles = StyleSheet.create({
  styleDragStart: {
    transition: 'left 0s, top 0.2s'
  },
  styleDragEnd: {
    transition: 'left 0.2s, top 0.2s'
  },
  styleActiveStart: {
    color: '#000',
    top: "8px"
  },
  styleActiveEnd: {
    color: '#777',
    top: 0
  }
});

class CustomSlider extends React.Component<SliderProps & WithStyles<'thumb'> & WithStyles<'root'> & WithStyles<'container'>, SliderState> {
  static defaultProps: SliderPropsOpt;

  // TODO: Auto-detect slider button's inactive offsetHeight
  sliderButtonInactiveOffsetHeight = 12;
  state = {
    value: 50,
    active: false,
    tooltipPosition: 0,
    dragging: false
  }

  constructor(props) {
    super(props);
    this.onTransitionEndCapture = this.onTransitionEndCapture.bind(this);
  }

  onChange = (event, value) => {
    this.setState((prevState) => ({ ...prevState, value: value }));
  };

  onDragStart = () => {
    this.setState((prevState) => ({ ...prevState, active: true, dragging: true }));
  }

  onDragEnd = () => {
    this.setState((prevState) => ({ ...prevState, dragging: false }));
  }

  componentDidMount() {
    this.updateTooltipPosition();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value != prevState.value) {
      this.updateTooltipPosition();
    }
  }

  updateTooltipPosition() {
    const sliderTooltip = document.getElementById('slider-tooltip');
    const slider = document.getElementById('custom-slider');

    const position = (this.state.value - this.props.min) / (this.props.max - this.props.min) * 100;
    const offsetPosition = (sliderTooltip.offsetWidth / 2) / slider.offsetWidth * 100;
    const actualPosition = position - offsetPosition;

    this.setState((prevState) => ({
      ...prevState, tooltipPosition: actualPosition
    }));
  }

  onTransitionEndCapture(e) {
    if (e.propertyName === 'height') {
      if (e.target.offsetHeight == this.sliderButtonInactiveOffsetHeight) {
        // Reached when the height of the slider button changes and the new height is the size of the it's inactive state
        this.setState((prevState) => ({ ...prevState, active: false }));
      }
    }
  }

  render() {
    const activeTooltipClass = this.state.active ? styles.styleActiveStart : styles.styleActiveEnd;
    const dragTooltipClass = this.state.dragging ? styles.styleDragStart : styles.styleDragEnd;
    return (
      <div id={this.props.id} style={{ position: 'relative', width: 400 }}>
        <span
          id="slider-tooltip"
          className={css(activeTooltipClass, dragTooltipClass)}
          style={{ fontSize: '14px', position: 'absolute', left: this.state.tooltipPosition + "%" }}
        >
          {this.state.value}
        </span>
        <Slider
          id='custom-slider'
          value={this.state.value}
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

CustomSlider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  label: "label"
}

export default withStyles({
  root: {
    padding: "48px 0px"
  },
  container: {
  },
  thumb: {
  }
})(CustomSlider);