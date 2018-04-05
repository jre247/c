import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Routes from "./Routes";
import "./App.css";
import SettingHelper from "./helpers/SettingHelper.js";
import Api from './data/Api.js';
import UserHelper from "./helpers/UserHelper.js";
import Breadcrumbs from './components/Breadcrumbs.js';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import consoleApp from './reducers'
import Spinner from './components/Spinner.js';
import Error from './components/Error/Error.js';
import LogHelper from './helpers/LogHelper.js';
import Startup from './Startup';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import { Button, Layout, Drawer, Navigation } from 'react-mdl';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      missingEnvVariables: [],
      error: { visible: false }
    };
  }

  async componentDidMount() {
    try {
      var self = this;

      let store = createStore(consoleApp)

      const settings = await SettingHelper.initialize();
      const googleClientId = settings.googleClientId;
      const apiUrl = settings.apiUrl;
      LogHelper.event('settings.get', { settings: settings });

      let missingEnvVariables = [];
      if (!apiUrl) {
        LogHelper.error('API_URL environment variable is not set.');
        missingEnvVariables.push('API_URL');
      }
      if (!googleClientId) {
        LogHelper.error('GOOGLE_CLIENT_ID environment variable is not set.');
        missingEnvVariables.push('GOOGLE_CLIENT_ID');
      }
      this.setState({ appLoading: true, missingEnvVariables: missingEnvVariables });

      await UserHelper.setUser();
      const isUserLoggedIn = UserHelper.userIsLoggedIn();
      if (isUserLoggedIn) {
        this.userHasAuthenticated(true);
      }

      self.setState({
        settings: settings,
        store: store,
        user: UserHelper.getUser(),
        appLoading: false
      });
    }
    catch(e) {
      LogHelper.error('App start error has occurred', { error: e });
      LogHelper.event('app.start.error', { error: e });
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  redirectToLogin() {
    this.setState({
      error: Object.assign({}, this.state.error, {
        visible: false
      })
    });

    this.userHasAuthenticated(false);
  }

  async logout(event) {
    await Api.logout();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  changeBreadcrumbs(breadcrumbs) {
    this.setState({
      breadcrumbs: breadcrumbs
    });
  }

  showSpinner() {
    this.setState({
      showSpinner: true
    });
  }

  hideSpinner() {
    this.setState({
      showSpinner: false
    });
  }

  renderSpinner() {
    if (this.state.appLoading || this.state.showSpinner) {
      return (
        <div className="app-spinner">
          <Spinner display={true} />
        </div>
      )
    }

    return (
      <div></div>
    )
  }

  renderDrawer() {
    if (!this.state.isAuthenticated) {
      return (
        <Drawer title="Flight Deck">
          <nav className="mdl-navigation"> </nav>
        </Drawer>
      )
    }

    return (
      <Drawer title="Flight Deck">
       <nav className="mdl-navigation">
          <Link className="mdl-navigation__link" to="/events">Events</Link>
          <ul>
            <li >
              <Link className="mdl-navigation__link sub-nav" to="/events/explore">Explore</Link>
            </li>
            <li>
              <Link className="mdl-navigation__link sub-nav" to="/events/funnels">Funnels</Link>
            </li>
            <li>
              <Link className="mdl-navigation__link sub-nav" to="/events/segments">Segments</Link>
            </li>
            <li>
              <Link className="mdl-navigation__link sub-nav" to="/events/users">Users</Link>
            </li>
            <li>
              <Link className="mdl-navigation__link sub-nav" to="/events/sync">Sync to SQL</Link>
            </li>
          </ul>
          <Link className="mdl-navigation__link"  to="/sources">Sources</Link>
          <Link className="mdl-navigation__link"  to="/pipelines">Pipelines</Link>
          <Link className="mdl-navigation__link"  to="/predictions">Predictions</Link>
          <Link className="mdl-navigation__link"  to="/warehouses">Warehouses</Link>
        </nav>
      </Drawer>
    )
  }

  showError(module, error) {
    this.setState({
      error: {
        ...error,
        module: module,
        visible: true
      }
    });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      changeBreadcrumbs: this.changeBreadcrumbs.bind(this),
      user: this.state.user,
      settings: this.state.settings,
      showSpinner: this.showSpinner.bind(this),
      hideSpinner: this.hideSpinner.bind(this),
      showError: this.showError.bind(this),
      redirectToLogin: this.redirectToLogin.bind(this)
    };

    if (this.state.error.visible) {
      const errorProps = {
        ...childProps,
        module: this.state.error.module,
        error: this.state.error
      }
      return (
        <Error {...errorProps} />
      )
    }

    if (!this.state.settings || this.state.missingEnvVariables.length > 0) {
      return (
        <div className="alert-danger missing-env-variables">
          <strong>The following environment variables are not defined:</strong>

          {this.state.missingEnvVariables.map(function(item) {
              return (
                <div> {item} </div>
              )
            }
          )}
        </div>
      );
    }

    const breadcrumbProps = {
      ...this.props,
      breadcrumbs: this.state.breadcrumbs,
      display: this.state.isAuthenticated
    }

    return (
      !this.state.isAuthenticating &&
      <Provider store={this.state.store}>
        <Startup {...childProps}>
          <div className="App">
            <Layout fixedHeader fixedDrawer>
              <header className="mdl-layout__header">
                <div className="mdl-layout-icon"></div>
                <div className="mdl-layout__header-row">
                  <Link to="/">
                      <button className="mdl-button mdl-js-button mdl-button-accent">
                        Flight Deck
                      </button>
                  </Link>

                  <div className="mdl-layout-spacer"></div>
                  <nav className="mdl-navigation">
                    {this.state.isAuthenticated
                      ? <button className="mdl-button mdl-js-button mdl-button-accent"onClick={this.logout.bind(this)}>
                          Logout
                        </button>
                      : [
                          // <RouteNavItem key={1} href="/signup">
                          //   Signup
                          // </RouteNavItem>,
                        ]}
                  </nav>
                </div>
              </header>

              {this.renderDrawer()}

              <main className="mdl-layout__content">
                <Breadcrumbs {...breadcrumbProps} />

                {this.renderSpinner()}

                <Routes childProps={childProps} />
              </main>
            </Layout>
          </div>
        </Startup>
      </Provider>
    );
  }
}

export default withRouter(App);
