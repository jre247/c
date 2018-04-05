import React from 'react';
import "./Fields.css";

class Fields extends React.Component {
  renderField(field) {
    const classNames = "form-group field-item" + this.getFieldValidationClass(field);
    const type = field.type.toLowerCase();

    if (type === 'string' || type === 'number') {
      return (
        <div className={classNames} key={field.name}>
          <input name={field.name} value={field.value || ''} type="text" className="form-control"
            onChange={this.props.onChange}
            placeholder={field.placeholder || ''}
          />
        </div>
      )
    }
    else {
      throw new Error('Unhandled field type found in render: ' + type);
    }
  }

  getFieldValidationClass(field) {
    let validationClass = '';
    if (field.validation) {
      if (field.validation.valid === true) {
        validationClass = ' has-success';
      }
      else if (field.validation.valid === false) {
        validationClass = ' has-error';
      }
    }
    return validationClass;
  }

  render() {
    if (this.props.fields.length === 0) {
      return (
        <div> </div>
      )
    }

    const self = this;
    return (
      <div className="fields">
        {this.props.fields.map(field =>
          { return self.renderField(field) }
        )}
      </div>
    );
  }
}

export default Fields;
