import React, { Component } from "react";
import Grid from '../../components/Grid/Grid.js';

export default class Destinations extends Component {
  add(event) {
    event.preventDefault();
    var workspaceId = parseInt(this.props.match.params.id, 10);
    const href = "/w/" + workspaceId + '/destination/create';
    this.props.history.push(href);
  }

  getGridConfig() {
    const gridConfig = {
      columns: this.getGridConfigColumns(),
      rows: this.getGridConfigRows(),
      actions: {
        search: {
          active: true,
          onChangeCallback: this.props.handleDestinationSearchInputChange,
          placeholder: "Search Destination"
        }
        // add: {
        //   active: true,
        //   text: 'Add Destination',
        //   onClickCallback: this.add.bind(this)
        // }
      }

    };

    return gridConfig;
  }

  getGridConfigColumns() {
    return [
      { type: 'connection-icon', display: 'Destination', name: 'destination', width: 3, customClasses: 'text-left' },
      { type: 'status', display: 'Status', name: 'status', width: 3 },
      { type: 'number', display: 'Sources', name: 'sources', width: 3 },
      { type: 'number', display: 'Tables', name: 'tables', width: 3 }
    ];
  }

  getGridConfigRows() {
    let rows = [];
    for (let s = 0; s < this.props.destinationsFiltered.length; s++) {
      const destination = this.props.destinationsFiltered[s];
      var workspaceId = this.props.match.params.id;

      var row = {
        id: s,
        link: `/w/${workspaceId}/destinations/${destination.id}`,
        columns: [{
          name: 'destination',
          value: {
            connectionKey: destination.connectionKey,
            description: destination.name,
            connectionTypes: this.props.connectionTypes
          }
        },
        {
          name: 'status',
          value: destination.status
        },
        {
          name: 'sources',
          value: destination.sourceCount
        },
        {
          name: 'tables',
          value: destination.tableCount
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
