import React, { Component } from "react";
import "./DestinationDetails.css";
import Tooltip from '../../../components/Tooltip/Tooltip.js';
import Number from '../../../components/Utility/Number.js';

class DestinationDetails extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <div></div>
      )
    }

    return (
      <div id="destination-details">
        Under Construction
      </div>
    );

  }
}

export default DestinationDetails;
