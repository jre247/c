import React, { Component } from "react";
import _ from 'lodash';
import Api from '../../../../../data/Api.js';
import LogHelper from '../../../../../helpers/LogHelper.js';
import SalesforceMarketingCloud from './SalesforceMarketingCloud.js';

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
        name: 'clientId',
        type: 'string',
        placeholder: 'Client Id',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'clientSecret',
        type: 'string',
        placeholder: 'Client Secret',
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
        placeholder: 'Marketing Cloud Username',
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
        placeholder: 'Marketing Cloud Password',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'ftpHost',
        type: 'string',
        placeholder: 'FTP Host',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'ftpPort',
        type: 'string',
        placeholder: 'FTP Port',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'ftpUsername',
        type: 'string',
        placeholder: 'FTP Username',
        onChange: (data) => {
          self.onChange(data);
        },
        validation: {
          active: true,
          required: true
        }
      },
      {
        name: 'ftpPassword',
        type: 'string',
        placeholder: 'FTP Password',
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
      type: 'sf-marketing-cloud',
      name: fieldMapping.name.value,
      body: {
        connection: {
          clientId: fieldMapping.clientId.value,
          clientSecret: fieldMapping.clientSecret.value,
          username: fieldMapping.username.value,
          password: fieldMapping.password.value
        },
        ftp: {
          host: fieldMapping.ftpHost.value,
          port: fieldMapping.ftpPort.value,
          username: fieldMapping.ftpUsername.value,
          password: fieldMapping.ftpPassword.value
        }
      }
    }
    try {
      this.setState({ formLoading: true });
      await Api.createSource(data, this.state.workspaceId);
      this.setState({ formLoading: false });
      this.props.onFormSubmit();
    }
    catch(e) {
      event.preventDefault();
      LogHelper.error('Error submitting Salesforce Marketing Cloud Source form to API', { error: e });
      this.props.showError('salesforce-marketing-cloud', e);
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
    const sfmcProps = {
      ...this.props,
      ...this.state,
      handleSubmit: this.handleSubmit.bind(this),
      onChange: this.onChange.bind(this)
    };

    return (
      <SalesforceMarketingCloud {...sfmcProps} />
    );

  }
}

export default Index;
