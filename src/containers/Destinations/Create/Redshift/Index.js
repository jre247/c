import React, { Component } from "react";
import _ from 'lodash';
import Api from '../../../../data/Api.js';
import LogHelper from '../../../../helpers/LogHelper.js';
import Redshift from './Redshift.js';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      valid: false,
      showError: false,
      formLoading: false
    };
  }

  componentDidMount() {
    const self = this;
    const fields = [
      {
        name: 'name',
        type: 'string',
        placeholder: 'Name',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'host',
        type: 'string',
        placeholder: 'Host',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'port',
        type: 'number',
        placeholder: 'Port',
        value: 5439,
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: false
        }
      },
      {
        name: 'database',
        type: 'string',
        placeholder: 'Database',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'username',
        type: 'string',
        placeholder: 'Username',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'password',
        type: 'string',
        placeholder: 'Password',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      }
    ];

    this.setState({
      fields: fields,
      workspaceId: parseInt(this.props.match.params.workspaceId, 10)
    });
  }

  onChange(data) {
    this.setState({
      valid: data.fields.valid
    })
  }

  async handleSubmit(event) {
    event.preventDefault();
    const fieldMapping = _.keyBy(this.state.fields, 'name');
    const data = {
      type: 'redshift',
      name: fieldMapping.name.value,
      body: {
        database: fieldMapping.database.value,
        host: fieldMapping.host.value,
        username: fieldMapping.username.value,
        password: fieldMapping.password.value,
        port: fieldMapping.port.value
      }
    }
    try {
      this.setState({ formLoading: true });
      await Api.createDestination(data, this.state.workspaceId);
      this.setState({ formLoading: false });
      this.props.onFormSubmit();
    }
    catch(e) {
      LogHelper.error('Error submitting Redshift Destination form to API', { error: e });
      event.preventDefault();
      this.props.showError('redshift-destination-create', e);
      // this.setState(
      //   {
      //     showError: true,
      //     formLoading: false
      //   }
      // );
    }

    event.preventDefault();
  }

  render() {
    const redshiftProps = {
      ...this.props,
      ...this.state,
      handleSubmit: this.handleSubmit.bind(this),
      onChange: this.onChange.bind(this)
    };

    return (
      <Redshift {...redshiftProps} />
    );

  }
}

export default Index;
