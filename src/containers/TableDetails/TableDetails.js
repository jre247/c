import React, { Component } from "react";
import "./TableDetails.css";
import Tooltip from '../../components/Tooltip/Tooltip.js';
import History from "./History.js";
import Number from '../../components/Utility/Number.js';
import JsonFormatter from '../../components/JsonFormatter.js';

class TableDetails extends Component {
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
            <div className="col-xs-2 column column-label text-left">
              <label>Schema: </label>
            </div>
            <div className="col-xs-4 column text-left">
              <span> {this.props.details.schema} </span>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 column column-label text-left">
              <label>Table: </label>
            </div>
            <div className="col-xs-4 column text-left">
              <span> {this.props.details.table} </span>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 column column-label text-left">
              <label>Last Run: </label>
            </div>
            <div className="col-xs-4 column text-left">
              <Tooltip displayValue={this.props.details.lastRunTimeDisplay}
                tooltipValue={this.props.details.lastRunTimeValue} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 column column-label text-left">
              <label>Next Run: </label>
            </div>
            <div className="col-xs-4 column text-left">
              <Tooltip displayValue={this.props.details.nextRunTimeDisplay}
                tooltipValue={this.props.details.nextRunTimeValue} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 column column-label text-left">
              <label>Rows: </label>
            </div>
            <div className="col-xs-4 column text-left">
              <Number value={this.props.details.rows} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2 column column-label text-left">
              <label>Config: </label>
            </div>
            <div className="col-xs-10 column text-left">
              <JsonFormatter json={this.props.details.json} />
            </div>
          </div>
        </div>

        <History {...this.props} />

      </div>
    );

  }
}

export default TableDetails;
