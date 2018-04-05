import React, { Component } from "react";
import ConnectionIcon from '../../../components/ConnectionIcon/ConnectionIcon.js';
import "./DestinationCreate.css";
import Redshift from './Redshift/Index.js';
import { Link } from "react-router-dom";

class DestinationCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connection: null
    };
  }

  goBack() {
    const workspaceId = this.props.match.params.workspaceId;
    const url = '/w/' + workspaceId;
    this.props.history.push(url);
  }

  renderConnection(connection) {
    const connectionProps = {
      types: this.props.connectionTypes,
      name: connection.key
    }
    return (
      <div className="col-xs-4"
        attr-connection-key={connection.key}
        key={connection.id}
        onClick={this.onConnectionSelected.bind(this)}
      >
        <ConnectionIcon {...connectionProps} />
      </div>
    )
  }

  onConnectionSelected(event) {
    const connectionKey = event.currentTarget.getAttribute("attr-connection-key");
    this.setState({
      connection: connectionKey
    })
  }

  render() {
    if (this.props.editableConnections.length === 0) {
      return (
        <div></div>
      )
    }

    const workspaceId = this.props.match.params.workspaceId;
    if (!this.state.connection) {
      return (
        <div id="destination-create">
          <div className="row">
            {this.props.editableConnections.map(connection => this.renderConnection(connection))}
          </div>

          <div className="row action-buttons">
            <div className="col-xs-6">
              <Link to={`/w/${workspaceId}`}>
                Cancel
              </Link>
            </div>
          </div>

        </div>
      );
    }

    const connectionProps = {
      ...this.props,
      cancel: this.goBack.bind(this),
      onFormSubmit: this.goBack.bind(this)
    }
    if (this.state.connection === 'redshift') {
      return (
        <div id="destination-create">
          <Redshift {...connectionProps} />
        </div>
      );
    }

    throw new Error('Unhandled connection: ' + this.state.connection);
  }
}

export default DestinationCreate;
