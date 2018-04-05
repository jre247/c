import React, { Component } from "react";
import "./SourceDetails.css";
import Tooltip from '../../../components/Tooltip/Tooltip.js';
import Tables from "./Tables.js";
import Number from '../../../components/Utility/Number.js';

class SourceDetails extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <div></div>
      )
    }

    return (
      <div id="source-details">
        <div className="details">
          <div className="row">
            <div className="col-xs-2 column column-label">
              <label>Last Run: </label>
            </div>
            <div className="col-xs-4 column">
              <Tooltip displayValue={this.props.details.lastRunTimeDisplay}
                tooltipValue={this.props.details.lastRunTimeValue} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 column column-label">
              <label>Next Run: </label>
            </div>
            <div className="col-xs-4 column">
              <Tooltip displayValue={this.props.details.nextRunTimeDisplay}
                tooltipValue={this.props.details.nextRunTimeValue} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 column column-label">
              <label>Rows: </label>
            </div>
            <div className="col-xs-4 column">
              <Number value={this.props.details.rows} />
            </div>
          </div>
        </div>

        <Tables {...this.props} />

      </div>
    );

  }
}

export default SourceDetails;
