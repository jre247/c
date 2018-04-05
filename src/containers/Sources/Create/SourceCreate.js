import React, { Component } from "react";
import ConnectionIcon from '../../../components/ConnectionIcon/ConnectionIcon.js';
import "./SourceCreate.css";
import SalesforceMarketingCloud from './Salesforce/MarketingCloud/Index.js';
import { Link } from "react-router-dom";

class SourceCreate extends Component {
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
      name: connection.key,
      types: this.props.connectionTypes
    }
    return (
      <div className="col-xs-4"
        connection-key={connection.key}
        key={connection.id}
        onClick={this.onConnectionSelected.bind(this)}
      >
        <ConnectionIcon {...connectionProps} />
      </div>
    )
  }

  onConnectionSelected(event) {
    const connectionKey = event.currentTarget.getAttribute("connection-key");
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
        <div id="source-create">
          <div className="row">
            {this.props.editableConnections.map(connection => this.renderConnection(connection))}
          </div>

          <div className="row action-buttons">
            <Link to={`/w/${workspaceId}`}>
              Cancel
            </Link>
          </div>
        </div>
      );
    }

    const connectionProps = {
      ...this.props,
      cancel: this.goBack.bind(this),
      onFormSubmit: this.goBack.bind(this)
    }
    if (this.state.connection === "sf-marketing-cloud") {
      return (
        <div id="source-create">
          <SalesforceMarketingCloud {...connectionProps} />
        </div>
      );
    }

    throw new Error('Unhandled connection: ' + this.state.connection);
  }
}

export default SourceCreate;
