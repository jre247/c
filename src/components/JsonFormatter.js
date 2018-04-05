import React from 'react';
import PropTypes from 'prop-types';
import JSONFormatter from 'json-formatter-js';
import ReactDOM from 'react-dom';

class JsonFormatter extends React.Component {
  static propTypes = {
    json: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      uniqueIdentifier: null
    };
  }

  componentDidMount() {
    const formatter = new JSONFormatter(this.props.json, 1000);
    const html = formatter.render();
    const uniqueIdentifier = this.createGuid();
    this.setState({ uniqueIdentifier: uniqueIdentifier });

    // Manually add JSON formatted element once its parent element is rendered in DOM by React
    const interval = window.setInterval(function() {
      const parentId = "json-formatter-result-" + uniqueIdentifier;
      const parent = document.getElementById(parentId);
      if (parent) {
        parent.appendChild(html);
        window.clearInterval(interval);
      }
    }, 10);
  }

  componentWillUnmount() {
    // Remove JSON formatted element that was manually added
    const parentId = "json-formatter-result-" + this.state.uniqueIdentifier;
    const parent = document.getElementById(parentId);
    parent.innerHTML = '';
  }

  createGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  render() {
    if (!this.state.uniqueIdentifier) {
      return <div> </div>;
    }

    const fullId = "json-formatter-result-" + this.state.uniqueIdentifier;
    return (
      <div>
        <div id={fullId}> </div>
      </div>
    )
  }
}

export default JsonFormatter
