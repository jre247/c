import React from 'react';
import PropTypes from 'prop-types';
import "./Fields.css";
import _ from 'lodash';
import Fields from './Fields'

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
    ).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      fieldMapping: {}
    };
  }

  componentDidMount() {
    this.setFieldMapping(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setFieldMapping(nextProps);
  }

  setFieldMapping(props) {
    if (props.fields.length === 0) {
      return;
    }

    const fieldMapping = _.keyBy(props.fields, 'name');
    this.setState({
      fieldMapping: fieldMapping
    })
  }

  onChange(e) {
    const name = e.target.name;
    const field = this.state.fieldMapping[name];
    field.value = e.target.value;
    const fieldIsValid = this.validateField(field);

    // Check field list is valid
    let fieldListIsValid = false;
    if (fieldIsValid) {
      fieldListIsValid = this.fieldListIsValid();
    }

    if (field.onChange) {
      field.onChange({
        field: _.clone(field),
        fields: {
          valid: fieldListIsValid
        }
      });
    }
  }

  validateField(field) {
    if (!field.validation) {
      return true;
    }

    if (field.validation.active === false) {
      return true;
    }

    // Validate required check
    if (field.validation.required === true) {
      const isRequiredValid = this.validateForRequired(field);
      if (!isRequiredValid) {
        return false;
      }
    }

    // Validate field type
    const valid = this.validateFieldType(field);
    let errorMessage;
    if (valid) {
      field.validation.valid = true;
    }
    else {
      field.validation.valid = false;
      errorMessage = field.validation.text || 'Invalid field value';
      field.validation.errorMessage = errorMessage;
    }

    // Invoke callback
    if (field.validation.onValidated) {
      field.validation.onValidated({
        errorMessage: errorMessage,
        valid: valid
      });
    }

    return valid;
  }

  validateForRequired(field) {
    if (!field.value || field.value.length === 0) {
      field.validation.valid = false;
      const errorMessage = 'Field value is required';
      field.validation.errorMessage = errorMessage;
      if (field.validation.onValidated) {
      field.validation.onValidated({
          errorMessage: errorMessage,
          valid: false
        });
      }
      return false;
    }
    return true;
  }

  validateFieldType(field) {
    switch(field.type) {
      case "string":
        return this.validateFieldString(field);
      case "number":
        return this.validateFieldNumber(field);
      default:
        throw new Error('Unhandled field type found for validation: ' + field.type);
    }
  }

  validateFieldString(field) {
    return true;
  }

  validateFieldNumber(field) {
    if (isNaN(field.value)) {
      return false;
    }
    return true;
  }

  fieldListIsValid() {
    let validFieldCount = 0;

    _.each(this.props.fields, (field) => {
      if (field.validation) {
        if (!field.validation.required || field.validation.valid === true) {
          validFieldCount++;
        }
      }
      else {
        validFieldCount++;
      }
    });

    return validFieldCount === this.props.fields.length;
  }

  render() {
    const fieldProps = {
      ...this.props,
      ...this.state,
      onChange: this.onChange.bind(this)
    };

    return (
      <Fields {...fieldProps} />
    )
  }
}

export default Index;
