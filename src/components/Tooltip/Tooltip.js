import React from 'react';
import PropTypes from 'prop-types';
import "./Tooltip.css";

class Tooltip extends React.Component {
  static propTypes = {
    displayValue: PropTypes.string,
    tooltipValue: PropTypes.string
  };

  render() {
    return (
      <span title={this.props.tooltipValue}>{this.props.displayValue}</span>
    );
  }
}

export default Tooltip;
