import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Form from './Form'

class Index extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func,
        validation: PropTypes.shape({
          active: PropTypes.bool,
          text: PropTypes.string,
          required: PropTypes.bool,
          onValidated: PropTypes.func
        })
      }).isRequired
    ).isRequired,
    actions: PropTypes.shape({
      submit: PropTypes.shape({
        active: PropTypes.bool,
        text: PropTypes.string,
        onClick: PropTypes.func
      }),
      cancel: PropTypes.shape({
        active: PropTypes.bool,
        text: PropTypes.string,
        onClick: PropTypes.func
      })
    })
  };

  constructor(props) {
    super(props);

    this.state = {
      valid: false
    };
  }


  render() {
    const formProps = {
      ...this.props
    };

    return (
      <Form {...formProps} />
    )
  }
}

export default Index;
