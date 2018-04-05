import React, { Component } from "react";
import Api from '../../data/Api.js';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from '../../actions/workspace';
import momentTz from 'moment-timezone';
import WorkspaceDetails from './WorkspaceDetails.js';
import LogHelper from '../../helpers/LogHelper.js';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      metrics: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      this.props.showSpinner();
      await this.setWorkspace();
      this.changeBreadcrumbs();
      const workspaceId = parseInt(this.props.match.params.id, 10);
      const results = await Promise.all([
        Api.getSources(workspaceId),
        Api.getDestinations(workspaceId),
        Api.getWorkspaceMetrics(workspaceId),
        Api.getConnections(workspaceId)
      ]);
      const sourcesRaw = results[0];
      this.props.actions.receiveSources(sourcesRaw);
      const destinationsRaw = results[1];
      this.props.actions.receiveDestinations(destinationsRaw);
      const metrics = results[2];
      const connections = results[3];
      this.props.actions.receiveConnections(connections);
      const user = this.props.user;
      momentTz.tz.setDefault(user.timezone || "America/New_York");
      const sources = this.buildFormattedSources(sourcesRaw, connections);
      const destinations = this.buildFormattedDestinations(destinationsRaw, connections);

      this.props.hideSpinner();
      this.setState({
        workspaceId: workspaceId,
        sourcesFiltered: _.clone(sources),
        sourcesOriginal: _.clone(sources),
        destinationsFiltered: _.clone(destinations),
        destinationsOriginal: _.clone(destinations),
        metrics: metrics,
        isLoading: false
      });
    } catch (e) {
      this.props.showError('workspace-details', e);
    }
  }

  changeBreadcrumbs() {
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
          active: true
        }
      ]
    });
  }

  async setWorkspace() {
    const workspaceId = parseInt(this.props.match.params.id, 10);
    let workspace = this.props.workspace;
    if (!workspace) {
      const workspaces = await Api.getWorkspaces(workspaceId);
      this.props.actions.receiveWorkspaces(workspaces);
    }
  }

  filterSources(searchInput) {
    this.setState({
      searchInput: searchInput,
      sourcesFiltered: this.filterIntegrationType(
        searchInput,
        this.state.sourcesOriginal,
        'inputConnectionName'
      )
    });
  }

  filterDestinations(searchInput) {
    this.setState({
      searchInput: searchInput,
      destinationsFiltered: this.filterIntegrationType(
        searchInput,
        this.state.destinationsOriginal,
        'connectionName'
      )
    });
  }

  filterIntegrationType(searchInput, collectionOriginal, connectionLookupName) {
    let itemsFiltered = [];

    if (!searchInput || searchInput.length === 0) {
      itemsFiltered = collectionOriginal;
    }

    var searchInputLowercase = searchInput.toLowerCase();

    itemsFiltered = _.filter(collectionOriginal, (item) => {
      return item.name.toLowerCase().indexOf(searchInputLowercase) !== -1 ||
        item[connectionLookupName].toLowerCase().indexOf(searchInputLowercase) !== -1;
    });

    return itemsFiltered;
  }

  buildFormattedSources(sourcesRaw, connections) {
    let sources = [];
    let self = this;
    _.each(sourcesRaw, (sourceRawItem) => {
      let source = self.buildFormattedSourceItem(sourceRawItem, connections);
      sources.push(source);
     });

     return sources;
  }

  buildFormattedSourceItem(source, connections) {
    const sourceCloned = _.clone(source);

    // Set input/output connection names
    var inputConnection = _.find(connections, {id: sourceCloned.inputConnectionId});
    sourceCloned.inputConnectionKey = inputConnection.connectionTypeKey;
    sourceCloned.inputConnectionName = inputConnection.connectionTypeName;
    var outputConnection = _.find(connections, {id: sourceCloned.outputConnectionId});
    sourceCloned.outputConnectionKey = outputConnection.connectionTypeKey;
    sourceCloned.outputConnectionName = outputConnection.connectionTypeName;

    // Set next/last run time
    const nextRunTimeUtc = sourceCloned.nextRunTime + ' z';
    const lastRunTimeUtc = sourceCloned.lastRunTime + ' z';
    sourceCloned.nextRunTimeDisplay = momentTz(nextRunTimeUtc).fromNow();
    sourceCloned.nextRunTimeValue = momentTz(nextRunTimeUtc).format('MM/DD/YYYY h:mm A');
    sourceCloned.lastRunTimeDisplay = momentTz(lastRunTimeUtc).fromNow();
    sourceCloned.lastRunTimeValue = momentTz(lastRunTimeUtc).format('MM/DD/YYYY h:mm A');

    return sourceCloned;
  }

  buildFormattedDestinations(destinationsRaw, connections) {
    let destinations = [];
    let self = this;
    _.each(destinationsRaw, (item) => {
      let destination = self.buildFormattedDestinationItem(item, connections);
      destinations.push(destination);
     });

     return destinations;
  }

  buildFormattedDestinationItem(destination, connections) {
    const destinationCloned = _.clone(destination);

    // Set input/output connection names
    var connection = _.find(connections, { connectionTypeId: destination.connectionTypeId});
    destinationCloned.connectionKey = connection.connectionTypeKey;
    destinationCloned.connectionName = connection.connectionTypeName;

    return destinationCloned;
  }

  render() {
    const workspaceDetailsProps = {
      ...this.props,
      ...this.state,
      filterSources: this.filterSources.bind(this),
      filterDestinations: this.filterDestinations.bind(this)
    }

    return (
      <WorkspaceDetails {...workspaceDetailsProps} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  var workspaceId = parseInt(ownProps.match.params.id, 10);
  const workspace = state.workspaces.items.byId[workspaceId];
  const sources = _.filter(state.sources.items.byId, { 'workspaceId': workspaceId });
  return {
    workspace: workspace,
    sources: _.values(sources),
    user: state.settings.items.byKey.user.value,
    connectionTypes: _.keyBy(state.settings.items.byKey.connectionTypes.value, 'key')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
