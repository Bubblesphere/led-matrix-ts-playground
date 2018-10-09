
/*
import * as React from 'react';
import TooltipSlider from './TooltipSlider';

interface HocProps {
  // Contains the prop my HOC needs
  onInputCapture: (property: string, value: any) => void;
}

const hoc = function<P extends HocProps>(WrappedComponent: new () => React.Component<P, any>) {
  return class extends React.Component<P, any> {
      render() { 
        return (<WrappedComponent/>); 
      }
  }
}
export default hoc;

import * as React from 'react';
import { InputProps } from './Inputs';

const hoc = function<P extends InputProps>(WrappedComponent: new () => React.Component<any, any>) {
  return class extends React.Component<P, any> {
    render() { 
      return (
      <WrappedComponent 
        {...this.props}
        onChange={this.props.onInputCaptured}
      />); 
    }
  }
}

export default hoc;
*/

export interface InputProps {
  id: string,
  onInputCaptured: (property: string, value: any) => void
}