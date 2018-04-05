import React, { Component } from "react";
import Api from '../../data/Api.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from '../../actions/workspace';
import Workspaces from './Workspaces.js';
import _ from 'lodash';
import LogHelper from '../../helpers/LogHelper.js';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.props.showSpinner();
    this.props.changeBreadcrumbs({
      display: false
    });

    try {
      const results = await Api.getWorkspaces();
      this.props.actions.receiveWorkspaces(results);
      this.props.hideSpinner();
    }
    catch (e) {
      this.props.showError('workspaces', e);
    }
  }

  render() {
    const workspacesProps = {
      ...this.props,
      ...this.state
    }

    return (
      <Workspaces {...workspacesProps} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    workspaces: _.values(state.workspaces.items.byId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
