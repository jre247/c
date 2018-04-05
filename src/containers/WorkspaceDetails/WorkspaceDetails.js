import React, { Component } from "react";
import "./WorkspaceDetails.css";
import _ from 'lodash';
import BarChart from '../../components/Chart/BarChart.js';
import Sources from './Sources.js';
import Destinations from './Destinations.js';
import moment from 'moment';

class WorkspaceDetails extends Component {
  handleSourceSearchInputChange(event) {
    var searchInput = event.target.value;
    this.props.filterSources(searchInput);
  }

  handleDestinationSearchInputChange(event) {
    var searchInput = event.target.value;
    this.props.filterDestinations(searchInput);
  }

  getChartConfig() {
    var data = [];
    _.each(this.props.metrics, (metric) => {
      var dataItem = [];
      dataItem.push(moment(metric.date).format('MMM D'));
      dataItem.push(metric.count);
      data.push(dataItem);
    });

    return data;
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div></div>
      )
    }

    const gridProps = {
      ...this.props,
      handleSourceSearchInputChange: this.handleSourceSearchInputChange.bind(this),
      handleDestinationSearchInputChange: this.handleDestinationSearchInputChange.bind(this)
    }

    return (
      <div id="workspace-details">
        <div id="sources">
          <Sources {...gridProps} />
        </div>

        <div id="destinations">
          <Destinations {...gridProps} />
        </div>

        <div className="chart">
          <BarChart data={this.getChartConfig()}></BarChart>
        </div>
      </div>
    );
  }
}

export default WorkspaceDetails;
