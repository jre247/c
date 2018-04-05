import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Workspaces.css";
import Grid from '../../components/Grid/Grid.js';

class Workspaces extends Component {
  getGridConfig() {
    const gridConfig = {
      title: 'Workspaces',
      rows: this.getGridConfigRows(),
      columns: [
        {
          type: 'text',
          name: 'item',
          visible: false,
          width: 12
        }
      ]
    };

    return gridConfig;
  }

  getGridConfigRows() {
    let rows = [];
    for (let s = 0; s < this.props.workspaces.length; s++) {
      const workspace = this.props.workspaces[s];

      var row = {
        id: s,
        link: `/w/${workspace.id}`,
        columns: [
        {
          name: 'item',
          value: workspace.name
        }]
      };

      rows.push(row);
    }

    return rows;
  }

  renderWorkspaces() {
    const gridProps = {
      ...this.props,
      data: this.getGridConfig()
    }

    return (
      <div id="workspaces" className="workspaces">
        <div className="row">
            <div className="col-xs-4 col-xs-offset-4">
              <Grid {...gridProps} />
            </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.renderWorkspaces()}
      </div>
    );
  }
}

export default Workspaces;
