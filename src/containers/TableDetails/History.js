import React, { Component } from "react";
import Grid from '../../components/Grid/Grid.js';
import momentTz from 'moment-timezone';
import DateHelper from '../../helpers/DateHelper.js';

export default class History extends Component {
  onPreviousCallback() {
    let offset = (this.props.offset - this.props.limit);
    if (offset < 0) {
      offset = 0;
    }
    this.props.refreshData(offset);
  }

  onNextCallback() {
    const offset = (this.props.offset + this.props.limit);
    this.props.refreshData(offset);
  }

  getGridConfig() {
    const gridConfig = {
      title: 'History',
      actions: {
        paging: {
          active: true,
          type: 'server',
          onPreviousCallback: this.onPreviousCallback.bind(this),
          onNextCallback: this.onNextCallback.bind(this),
          limit: this.props.limit,
          offset: this.props.offset
        }
      },
      columns: this.getGridConfigColumns(),
      rows: this.getGridConfigRows()
    };

    return gridConfig;
  }

  getGridConfigColumns() {
    return [
      { type: 'text', display: 'Slice', name: 'slice', width: 4, customClasses: 'text-left' },
      { type: 'text', display: 'Duration', name: 'duration', width: 4 },
      { type: 'number', display: 'Rows', name: 'rows', width: 4 },
    ];
  }

  getGridConfigRows() {
    let rows = [];

    for (let t = 0; t < this.props.history.length; t++) {
      const history = this.props.history[t];

      // Set next/last run time
      //const runTimeUtc = history.startTime + ' z';
      const sliceValue = momentTz(history.sliceStart).format('MM/DD/YYYY');


      const durationFormatted = DateHelper.convertSecondsToTimestamp(history.duration);

      var row = {
        id: t,
        link: `#`,
        slice: sliceValue,
        columns: [{
          name: 'slice',
          value: sliceValue
        },
        {
          name: 'duration',
          value: durationFormatted
        },
        {
          name: 'rows',
          value: history.rows || 0
        }]
      };

      rows.push(row);
    }

    let sorted = rows.sort((a,b) => new Date(b.slice) - new Date(a.slice));

    return sorted
  }

  render() {
    const gridProps = {
      ...this.props,
      onPreviousCallback: this.onPreviousCallback.bind(this),
      onNextCallback: this.onNextCallback.bind(this),
      data: this.getGridConfig()
    }

    return (
      <div>
        <Grid {...gridProps} />
      </div>
    );
  }
}
