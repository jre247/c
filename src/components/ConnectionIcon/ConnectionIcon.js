import React from 'react';
import PropTypes from 'prop-types';
import "./ConnectionIcon.css";

class ConnectionIcon extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    types: PropTypes.object.isRequired
  };

  componentDidMount() {
    if (!this.props.types) {
      throw new Error("Connection type mapping is undefined");
    }

    if (!this.props.types[this.props.name]) {
      throw new Error(this.props.name + " does not exist in connection type mapping");
    }
  }

  render() {
    var filename = this.props.types[this.props.name].iconSrc;
    var url = "/images/icons/thumbnails/" + filename;

    return (
      <img className="connection-icon" src={url} alt="Icon" />
    );
  }
}

export default ConnectionIcon;
