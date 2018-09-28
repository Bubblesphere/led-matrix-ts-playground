import * as React from 'react';
import { Component } from 'react';

interface ProfileProps {
  value: string
}

class ProfileTest extends Component<ProfileProps> {

  render() {
    return (
      <div className="Profile">
        <label id="test-label">Label</label>
        <input id="test-input" type="text" value={this.props.value} />
      </div>
    );
  }
}

export default ProfileTest;
