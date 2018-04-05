import React, { Component } from "react";
import Api from '../../data/Api.js';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from '../../actions/workspace';
import momentTz from 'moment-timezone';
import TableDetails from './TableDetails.js';
import LogHelper from '../../helpers/LogHelper.js';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      details: {},
      limit: 10,
      offset: 0
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.props.showSpinner();
    await this.setBaseWorkspaceData();
    this.changeBreadcrumbs();
    this.setTableHistory();
  }

  changeBreadcrumbs() {
    const workspaceId = this.props.match.params.workspaceId;
    const sourceId = this.props.match.params.sourceId;
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
          link: '/w/' + workspaceId + '/sources/' + sourceId
        },
        {
          name: 'tableDetails',
          display: this.props.table.sinkTask.table,
          active: true
        }
      ]
    });
  }

  async setBaseWorkspaceData() {
    var workspaceId = this.props.match.params.workspaceId;
    var sourceId = this.props.match.params.sourceId;
    if (!this.props.workspace || !this.props.source || !this.props.table) {
      const results = await Promise.all([
        Api.getWorkspaces(workspaceId),
        Api.getSource(workspaceId, sourceId),
        Api.getSourceTables(workspaceId, sourceId)
      ]);
      const workspaces = results[0];
      const source = results[1];
      const tables = results[2];
      this.props.actions.receiveWorkspaces(workspaces);
      this.props.actions.receiveSources([source]);
      this.props.actions.receiveTables(tables);
    }
  }

  async setTableHistory(limit = 10, offset = 0) {
    var workspaceId = this.props.match.params.workspaceId;
    var sourceId = this.props.match.params.sourceId;
    var tableId = this.props.match.params.tableId;

    const table = this.props.table;

    try {
      const history = await Api.getTableHistory(workspaceId, sourceId, tableId, limit, offset);
      this.props.actions.receiveHistory(history);

      // Set Table details
      const details = {};
      const nextRunTimeUtc = table.nextRunTime + ' z';
      const lastRunTimeUtc = table.lastRunTime + ' z';
      details.nextRunTimeDisplay = momentTz(nextRunTimeUtc).fromNow();
      details.nextRunTimeValue = momentTz(nextRunTimeUtc).format('MM/DD/YYYY h:mm A');
      details.lastRunTimeDisplay = momentTz(lastRunTimeUtc).fromNow();
      details.lastRunTimeValue = momentTz(lastRunTimeUtc).format('MM/DD/YYYY h:mm A');
      details.rows = table.rows;
      details.schema = table.sinkTask.schema;
      details.table = table.sinkTask.table;
      details.json = {
        source: table.sourceTask,
        sink: table.sinkTask
      }

      this.props.hideSpinner();
      this.setState(
        {
          isLoading: false,
          details: details,
          limit: limit,
          offset: offset
        }
      );
    } catch(e) {
      this.props.showError('table-details', e);
    }
  }

  refreshData(offset) {
    this.setTableHistory(this.state.limit, offset);
  }

  render() {
    const tableDetailsProps = {
      ...this.props,
      ...this.state,
      refreshData: this.refreshData.bind(this)
    }

    return (
      <TableDetails {...tableDetailsProps} />
    );

  }
}

function mapStateToProps(state, ownProps) {
  var workspaceId = ownProps.match.params.workspaceId;
  var sourceId = ownProps.match.params.sourceId;
  var tableId = ownProps.match.params.tableId;
  const workspace = state.workspaces.items.byId[parseInt(workspaceId, 10)];
  const source = state.sources.items.byId[parseInt(sourceId, 10)];
  const table = state.tables.items.byId[parseInt(tableId, 10)];
  return {
    workspace: workspace,
    source: source,
    table,
    history: _.values(state.history.items.byId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
