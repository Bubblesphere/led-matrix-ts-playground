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