import React from 'react';
import PropTypes from 'prop-types';

class Spinner extends React.Component {
  static propTypes = {
    display: PropTypes.bool.isRequired
  };

  render() {
    if (this.props.display) {
      return (
        <div className="text-center">
          <img src="/spinner.gif" width="90" alt="Loading..." />
        </div>
      );
    }
    return (
      <div></div>
    );
  }
}

export default Spinner;
