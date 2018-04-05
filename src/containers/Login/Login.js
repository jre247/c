import React, { Component } from "react";
import "./Login.css";
import Api from '../../data/Api.js';
import SettingHelper from '../../helpers/SettingHelper.js';
import LogHelper from '../../helpers/LogHelper.js';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  signInWithGoogle() {
     const params = {
       client_id: SettingHelper.get('google-client-id'),
       cookie_policy: 'single_host_origin',
       login_hint: null,
       hosted_domain: null,
       fetch_basic_profile: true,
       discoveryDocs: null,
       ux_mode: 'popup',
       redirect_uri: null,
       scope: 'profile email'
     };

     const options = {
       prompt: ''
     }

     var self = this;
     window.gapi.load('auth2', () => {
       if (!window.gapi.auth2.getAuthInstance()) {
         window.gapi.auth2.init(params).then(
           res => {
             const currentUser = res.currentUser.get();
             if (!currentUser) {
               throw new Error('Current user is undefined after google login');
             }
           },
           err => self.onFailure(err)
         )
       }

       const auth2 = window.gapi.auth2.getAuthInstance();
       auth2.signIn(options).then(res => this.onSignInWithGoogle(res), err => self.onFailure(err));
     });

   }

   onFailure(error) {
     LogHelper.event('login.error', { error: error, type: 'google' });
   }

   onSignInWithGoogle(googleUser) {
    this.props.showSpinner();
    this.setState({ isLoading: true });

    if (!googleUser.getAuthResponse) {
      return;
    }

    var token = googleUser.getAuthResponse().id_token;
    if (!token) {
      return;
    }

    var self = this;
    Api.loginWithGoogle(token).then((data) => {
      LogHelper.event('login.success', { data: data, type: 'google' });
      this.props.hideSpinner();
      self.props.userHasAuthenticated(true);
      // var split = window.location.href.split('?redirect-url='); // TODO: use react to get query params!
      // if (split.length === 2) {
      //   var redirectUrlDecoded = decodeURIComponent(split[1]);
      //   this.props.history.push(redirectUrlDecoded);
      // }
      // else {
      //   this.props.history.push("/");
      // }

    }, (error) => {
        LogHelper.event('login.error', { error: error, type: 'google' });
    }).catch(error => {
        LogHelper.event('login.error', { error: error, type: 'google' });
    });
  }

  login(email, password) {
    // const userPool = new CognitoUserPool({
    //   UserPoolId: config.cognito.USER_POOL_ID,
    //   ClientId: config.cognito.APP_CLIENT_ID
    // });
    // const user = new CognitoUser({ Username: email, Pool: userPool });
    // const authenticationData = { Username: email, Password: password };
    // const authenticationDetails = new AuthenticationDetails(authenticationData);
    //
    // return new Promise((resolve, reject) =>
    //   user.authenticateUser(authenticationDetails, {
    //     onSuccess: result => resolve(),
    //     onFailure: err => reject(err)
    //   })
    // );
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.login(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      LogHelper.error('Login error has occurred', { error: e });
      LogHelper.event('login.error', { error: e });
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div></div>
      )
    }

    return (
      <div id="login" className="Login">
        <div className="container">
          <div className="formGroup">

            <button className="button google" onClick={this.signInWithGoogle.bind(this)}>
              <svg
                className="icon"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={
                    'M30 13h-4V9h-2v4h-4v2h4v4h2v-4h4m-15 2s-2-1.15-2-2c0 0-.5-1.828 1-3 ' +
                    '1.537-1.2 3-3.035 3-5 0-2.336-1.046-5-3-6h3l2.387-1H10C5.835 0 2 3.345 2 7c0 ' +
                    '3.735 2.85 6.56 7.086 6.56.295 0 .58-.006.86-.025-.273.526-.47 1.12-.47 1.735 ' +
                    '0 1.037.817 2.042 1.523 2.73H9c-5.16 0-9 2.593-9 6 0 3.355 4.87 6 10.03 6 5.882 ' +
                    '0 9.97-3 9.97-7 0-2.69-2.545-4.264-5-6zm-4-4c-2.395 0-5.587-2.857-6-6C4.587 ' +
                    '3.856 6.607.93 9 1c2.394.07 4.603 2.908 5.017 6.052C14.43 10.195 13 13 11 ' +
                    '13zm-1 15c-3.566 0-7-1.29-7-4 0-2.658 3.434-5.038 7-5 .832.01 2 0 2 0 1 0 ' +
                    '2.88.88 4 2 1 1 1 2.674 1 3 0 3-1.986 4-7 4z'
                  }
                />
              </svg>
              <span>Log in with Google</span>
            </button>
          </div>

        </div>

      </div>
    );
  }
}
