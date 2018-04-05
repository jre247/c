import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import "./Login.css";
import Api from '../../data/Api.js';
import SettingHelper from '../../helpers/SettingHelper.js';

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
             var currentUser = res.currentUser.get();
           },
           err => self.onFailure(err)
         )
       }

       const auth2 = window.gapi.auth2.getAuthInstance();
       auth2.signIn(options).then(res => this.onSignInWithGoogle(res), err => self.onFailure(err));
     });

   }

   onFailure(err) {
     console.log("Error logging in: " + err);
   }

   onSignInWithGoogle(googleUser) {
    if (!googleUser.getAuthResponse) {
      return;
    }

    var token = googleUser.getAuthResponse().id_token;
    if (!token) {
      return;
    }

    var self = this;
    this.setState({ isLoading: true });
    Api.loginWithGoogle(token).then((data) => {
      self.setState({ isLoading: false });
      self.props.userHasAuthenticated(true);
      // var split = window.location.href.split('?redirect-url='); // TODO: use react to get query params!
      // if (split.length === 2) {
      //   var redirectUrlDecoded = decodeURIComponent(split[1]);
      //   this.props.history.push(redirectUrlDecoded);
      // }
      // else {
      //   this.props.history.push("/");
      // }

    }, (data) => {
      console.log(data);

      //self.setState({loginError: true});
    }).catch(error => {

    //  self.setState({loginError: true});
      console.log(error);
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
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div id="login" className="Login">
        <div className="container">
          // <p className="lead">
          //   Log in with your username or company email address.
          // </p>
          // <div className="formGroup">
          //   <a className="button github" href="/login/github">
          //     <svg
          //       className="icon"
          //       width="30"
          //       height="30"
          //       viewBox="0 0 30 30"
          //       xmlns="http://www.w3.org/2000/svg"
          //     >
          //       <path d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z" />
          //     </svg>
          //     <span>Log in with Github</span>
          //   </a>
          // </div>
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
        // <form onSubmit={this.handleSubmit}>
        //   <FormGroup controlId="email" bsSize="large">
        //     <ControlLabel>Email</ControlLabel>
        //     <FormControl
        //       autoFocus
        //       type="email"
        //       value={this.state.email}
        //       onChange={this.handleChange}
        //     />
        //   </FormGroup>
        //   <FormGroup controlId="password" bsSize="large">
        //     <ControlLabel>Password</ControlLabel>
        //     <FormControl
        //       value={this.state.password}
        //       onChange={this.handleChange}
        //       type="password"
        //     />
        //   </FormGroup>
        //   <LoaderButton
        //     block
        //     bsSize="large"
        //     disabled={!this.validateForm()}
        //     type="submit"
        //     isLoading={this.state.isLoading}
        //     text="Login"
        //     loadingText="Logging in…"
        //   />
        // </form>
      </div>
    );
  }
}
