import React, { Component } from "react";
import Api from './data/Api.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from './actions/workspace';
import _ from 'lodash';
import LogHelper from './helpers/LogHelper.js';

class AppSettings extends Component {
  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const connectionTypes = await Api.getConnectionTypes();
      this.props.actions.receiveConnectionTypes(connectionTypes);
    }
    catch (e) {
      LogHelper.error('Unexpected error occurred: ' + e);
      LogHelper.event('component.error', { error: e, component: 'appSettings', message: 'Unexpected error occurred' });
    }
  }

  render() {
    return (
      <div> </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const connectionTypeMapping = _.keyBy(state.connectionTypes.items.byId, 'key');
  return {
    connectionTypeMapping: connectionTypeMapping,
    connectionTypes: _.values(state.connectionTypes.items.byId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
