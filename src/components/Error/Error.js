import React from 'react';
import PropTypes from 'prop-types';
import "./Error.css";
import LogHelper from '../../helpers/LogHelper.js';

class Error extends React.Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    module: PropTypes.string.isRequired
  };

  componentDidMount() {
    if (this.props.error.status === 400 || this.props.error.status === 401 || this.props.error.status === 403) {
      this.props.redirectToLogin();
    }

    LogHelper.error('Unexpected error occurred: ' + this.props.error.message);
    LogHelper.event('component.error', { error: this.props.error, component: this.props.module, message: 'Unexpected error occurred' });
  }

  render() {
    return (
      <div className="alert-danger">
        <span> An unexpected error has occurred </span>
      </div>
    )
  }
}

export default Error;
