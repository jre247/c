import Api from './data/Api.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as workspaceActions from './actions/workspace';
import React, { Component } from "react";
import UserHelper from "./helpers/UserHelper.js";
import Spinner from './components/Spinner.js';

class Startup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      connectionTypes: null,
      user: null,
      baseSettings: null
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    const connectionTypes = await Api.getConnectionTypes();
    this.setState({
      connectionTypes: connectionTypes,
      user: this.props.user,
      baseSettings: this.props.settings
    });

    if (this.props.user && this.props.settings) {
      this.props.actions.receiveAppSettings([
        { key: 'user', value: this.props.user },
        { key: 'googleClientId', value: this.props.settings.googleClientId },
        { key: 'apiUrl', value: this.props.settings.apiUrl },
        { key: 'connectionTypes', value: connectionTypes }
      ]);
      this.setState({
        loaded: true
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.isAuthenticated) {
      return;
    }

    if (nextProps.loaded) {
      return;
    }

    let user = nextProps.user;
    let connectionTypes = this.state.connectionTypes;
    if (!user || !connectionTypes) {
      const results = await Promise.all([
        UserHelper.setUser(),
        Api.getConnectionTypes()
      ]);
      user = UserHelper.getUser();
      connectionTypes = results[1];
    }

    this.props.actions.receiveAppSettings([
      { key: 'user', value: user },
      { key: 'googleClientId', value: nextProps.settings.googleClientId },
      { key: 'apiUrl', value: nextProps.settings.apiUrl },
      { key: 'connectionTypes', value: connectionTypes }
    ]);
  }

  render() {
    if (!this.props.isAuthenticated) {
      return this.props.children;
    }

    if (!this.props.loaded) {
      return (
        <div className="app-spinner">
          <Spinner display={true} />
        </div>
      );
    }

    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {
    appSettings: state.settings.items.byKey,
    loaded: state.settings.items.allKeys.length > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workspaceActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Startup);
