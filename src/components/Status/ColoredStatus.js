import React from 'react';
import PropTypes from 'prop-types';
import "./ColoredStatus.css";

class ColoredStatus extends React.Component {
  static propTypes = {
    status: PropTypes.number.isRequired
  };

  render() {
    // Success
    if (this.props.status === 1) {
      return (
        <div className="status success">
          &nbsp;
        </div>
      );
    }
    // Pending
    else if (this.props.status === 2) {
      return (
        <div className="status pending">
          &nbsp;
        </div>
      );
    }
    // Fail
    return (
      <div className="status fail">
        &nbsp;
      </div>
    );
  }
}

export default ColoredStatus;
