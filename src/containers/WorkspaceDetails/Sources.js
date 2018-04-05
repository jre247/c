import React, { Component } from "react";
import Grid from '../../components/Grid/Grid.js';

export default class Sources extends Component {
  add(event) {
    event.preventDefault();
    var workspaceId = parseInt(this.props.match.params.id, 10);
    const href = "/w/" + workspaceId + '/source/create';
    this.props.history.push(href);
  }

  getGridConfig() {
    const gridConfig = {
      columns: this.getGridConfigColumns(),
      rows: this.getGridConfigRows(),
      actions: {
        search: {
          active: true,
          onChangeCallback: this.props.handleSourceSearchInputChange,
          placeholder: "Search Source"
        }
        // add: {
        //   active: true,
        //   text: 'Add Source',
        //   onClickCallback: this.add.bind(this)
        // }
      }

    };

    return gridConfig;
  }

  getGridConfigColumns() {
    return [
      { type: 'connection-icon', display: 'Source', name: 'source', width: 3, customClasses: 'text-left column-image' },
      { type: 'status', display: 'Status', name: 'status', width: 1 },
      { type: 'number', display: 'Rows', name: 'rows', width: 2 },
      { type: 'text', display: 'Last Sync', name: 'lastSync', width: 2 },
      { type: 'text', display: 'Next Sync', name: 'nextSync', width: 2 },
      { type: 'connection-icon', display: 'Destination', name: 'destination', width: 2, customClasses: 'column-image' }
    ];
  }

  getGridConfigRows() {
    let rows = [];
    for (let s = 0; s < this.props.sourcesFiltered.length; s++) {
      const source = this.props.sourcesFiltered[s];
      var workspaceId = this.props.match.params.id;

      var row = {
        id: s,
        link: `/w/${workspaceId}/sources/${source.id}`,
        columns: [{
          name: 'source',
          value: {
            connectionKey: source.inputConnectionKey,
            description: source.name,
            connectionTypes: this.props.connectionTypes
          }
        },
        {
          name: 'status',
          value: source.status
        },
        {
          name: 'rows',
          value: source.rows
        },
        {
          name: 'lastSync',
          value: source.lastRunTime,
          tooltip: {
            display: source.lastRunTimeDisplay,
            value: source.lastRunTimeValue
          }
        },
        {
          name: 'nextSync',
          value: source.nextRunTime,
          tooltip: {
            display: source.nextRunTimeDisplay,
            value: source.nextRunTimeValue
          }
        },
        {
          name: 'destination',
          value: {
            connectionKey: source.outputConnectionKey,
            connectionTypes: this.props.connectionTypes
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
