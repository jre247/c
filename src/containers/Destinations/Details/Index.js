import React, { Component } from "react";
import Api from '../../../data/Api.js';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from '../../../actions/workspace';
import momentTz from 'moment-timezone';
import DestinationDetails from './DestinationDetails.js';
import LogHelper from '../../../helpers/LogHelper.js';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      details: {}
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.props.showSpinner();
    var workspaceId = this.props.match.params.workspaceId;
    var destinationId = this.props.match.params.destinationId;
    await this.setBaseWorkspaceData();
    this.changeBreadcrumbs();
    this.props.hideSpinner();
    this.setState({ isLoading: false })
  }

  changeBreadcrumbs() {
    const workspaceId = this.props.match.params.workspaceId;
    this.props.changeBreadcrumbs({
      items: [
        {
          name: 'workspaces',
          display: 'Workspaces',
          link: '/'
        },
        {
          name: 'workspaceDetails',
          display: this.props.workspace.name,
          link: '/w/' + workspaceId
        },
        {
          name: 'destinationDetails',
          display: this.props.destination.name,
          active: true
        }
      ]
    });
  }

  async setBaseWorkspaceData() {
    var workspaceId = this.props.match.params.workspaceId;
    var destinationId = this.props.match.params.destinationId;
    if (!this.props.workspace || !this.props.destination) {
      const results = await Promise.all([
        Api.getWorkspaces(),
        Api.getDestinations(workspaceId)
      ]);
      const workspaces = results[0];
      const destinations = results[1];
      this.props.actions.receiveWorkspaces(workspaces);
      this.props.actions.receiveDestinations(destinations);
    }
  }

  render() {
    const detailsProps = {
      ...this.props,
      ...this.state
    }

    return (
      <DestinationDetails {...detailsProps} />
    );

  }
}

function mapStateToProps(state, ownProps) {
  var workspaceId = parseInt(ownProps.match.params.workspaceId, 10);
  var destinationId = parseInt(ownProps.match.params.destinationId, 10);
  const workspace = state.workspaces.items.byId[workspaceId];
  const destination = state.destinations.items.byId[destinationId];
  return {
    workspace: workspace,
    destination: destination
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
