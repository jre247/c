import React, { Component } from "react";
import Api from '../../../data/Api.js';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from '../../../actions/workspace';
import SourceCreate from './SourceCreate.js';
import LogHelper from '../../../helpers/LogHelper.js';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editableConnections: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      await this.setWorkspace();
      this.changeBreadcrumbs();
      const editableConnections = this.getEditableConnections();
      this.setState(
        {
          editableConnections: editableConnections
        }
      );
    }
    catch(e) {
      this.props.showError('destination-create', e);
    }
  }

  async setWorkspace() {
    const workspaceId = this.props.match.params.workspaceId;
    if (!this.props.workspace) {
      this.props.showSpinner();
      const workspaces = await Api.getWorkspaces(workspaceId);
      this.props.hideSpinner();
      this.props.actions.receiveWorkspaces(workspaces);
    }
  }

  getEditableConnections() {
    return _.filter(this.props.connectionTypeList, (connection) => {
      if (connection.key === 'sf-marketing-cloud') {
        return connection;
      }
    });
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
          name: 'sourceCreate',
          display: 'Create Source',
          active: true
        }
      ]
    });
  }

  render() {
    const createProps = {
      ...this.props,
      ...this.state,
      connectionTypes: this.props.connectionTypeMapping
    }

    return (
      <SourceCreate {...createProps} />
    );

  }
}

function mapStateToProps(state, ownProps) {
  var workspaceId = parseInt(ownProps.match.params.workspaceId, 10);
  const workspace = state.workspaces.items.byId[workspaceId];
  return {
    workspace: workspace,
    connectionTypeList: state.settings.items.byKey.connectionTypes.value,
    connectionTypeMapping: _.keyBy(state.settings.items.byKey.connectionTypes.value, 'key')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
