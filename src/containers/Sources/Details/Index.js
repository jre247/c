import React, { Component } from "react";
import Api from '../../../data/Api.js';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from '../../../actions/workspace';
import momentTz from 'moment-timezone';
import SourceDetails from './SourceDetails.js';
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
    var sourceId = this.props.match.params.sourceId;
    await this.setBaseWorkspaceData();
    this.changeBreadcrumbs();

    try {
      const tables = await Api.getSourceTables(workspaceId, sourceId);
      this.props.actions.receiveTables(tables);
      this.props.hideSpinner();
      this.setState(
        {
          isLoading: false,
          details: this.getDetails()
        }
      );
    }
    catch(e) {
      this.props.showError('source-details', e);
    }
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
          name: 'sourceDetails',
          display: this.props.source.name,
          active: true
        }
      ]
    });
  }

  getDetails() {
    const source = this.props.source;

    // Set details
    const details = {};
    if (source.nextRunTime) {
      const nextRunTimeUtc = source.nextRunTime + ' z';
      details.nextRunTimeDisplay = momentTz(nextRunTimeUtc).fromNow();
      details.nextRunTimeValue = momentTz(nextRunTimeUtc).format('MM/DD/YYYY h:mm A');
    }
    if (source.lastRunTime) {
      const lastRunTimeUtc = source.lastRunTime + ' z';
      details.lastRunTimeDisplay = momentTz(lastRunTimeUtc).fromNow();
      details.lastRunTimeValue = momentTz(lastRunTimeUtc).format('MM/DD/YYYY h:mm A');
    }
    details.rows = source.rows;

    return details;
  }

  async setBaseWorkspaceData() {
    var workspaceId = this.props.match.params.workspaceId;
    var sourceId = this.props.match.params.sourceId;
    if (!this.props.workspace || !this.props.source) {
      const results = await Promise.all([
        Api.getWorkspaces(),
        Api.getSource(workspaceId, sourceId)
      ]);
      const workspaces = results[0];
      const source = results[1];
      this.props.actions.receiveWorkspaces(workspaces);
      this.props.actions.receiveSources([source]);
    }
  }

  render() {
    const sourceDetailsProps = {
      ...this.props,
      ...this.state
    }

    return (
      <SourceDetails {...sourceDetailsProps} />
    );

  }
}

function mapStateToProps(state, ownProps) {
  var workspaceId = parseInt(ownProps.match.params.workspaceId, 10);
  var sourceId = parseInt(ownProps.match.params.sourceId, 10);
  const workspace = state.workspaces.items.byId[workspaceId];
  const source = state.sources.items.byId[sourceId];
  return {
    workspace: workspace,
    source: source,
    tables: _.values(state.tables.items.byId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
