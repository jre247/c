import React, { Component } from "react";
import Grid from '../../../components/Grid/Grid.js';
import momentTz from 'moment-timezone';

export default class Tables extends Component {
  getGridConfig() {
    const gridConfig = {
      columns: this.getGridConfigColumns(),
      rows: this.getGridConfigRows()
    };

    return gridConfig;
  }

  getGridConfigColumns() {
    return [
      { type: 'text', display: 'Table', name: 'table', width: 6, customClasses: 'text-left' },
      { type: 'number', display: 'Rows', name: 'rows', width: 1 },
      { type: 'text', display: 'Last Run', name: 'lastRun', width: 2 },
      { type: 'text', display: 'Next Run', name: 'nextRun', width: 2 }
    ];
  }

  getGridConfigRows() {
    var workspaceId = this.props.match.params.workspaceId;
    var sourceId = this.props.match.params.sourceId;
    let rows = [];

    for (let t = 0; t < this.props.tables.length; t++) {
      const table = this.props.tables[t];

      let nextRunTimeDisplay;
      let nextRunTimeValue;
      let lastRunTimeDisplay;
      let lastRunTimeValue;

      if (table.nextRunTime) {
        const nextRunTimeUtc = table.nextRunTime + ' z';
        nextRunTimeDisplay = momentTz(nextRunTimeUtc).fromNow();
        nextRunTimeValue = momentTz(nextRunTimeUtc).format('MM/DD/YYYY h:mm A');
      }

      if (table.lastRunTime) {
        const lastRunTimeUtc = table.lastRunTime + ' z';
        lastRunTimeDisplay = momentTz(lastRunTimeUtc).fromNow();
        lastRunTimeValue = momentTz(lastRunTimeUtc).format('MM/DD/YYYY h:mm A');
      }

      var row = {
        id: t,
        link: `/w/${workspaceId}/sources/${sourceId}/tables/${table.sourceTaskId}`,
        columns: [{
          name: 'table',
          value: table.sinkTask.schema + "." + table.sinkTask.table
        },
        {
          name: 'rows',
          value: table.rows
        },
        {
          name: 'lastRun',
          value: table.lastRunTime,
          tooltip: {
            display: lastRunTimeDisplay,
            value: lastRunTimeValue
          }
        },
        {
          name: 'nextRun',
          value: table.nextRunTime,
          tooltip: {
            display: nextRunTimeDisplay,
            value: nextRunTimeValue
          }
        }]
      };

      rows.push(row);
    }

    return rows;
  }

  render() {
    const gridProps = {
      ...this.props,
      data: this.getGridConfig()
    }

    return (
      <div>
        <Grid {...gridProps} />
      </div>
    );
  }
}
