import React, { Component } from "react";
import Fields from '../../../../components/Fields/Index.js';
import '../../../../components/Form/Form.css';
import { Link } from "react-router-dom";
import Spinner from '../../../../components/Spinner.js';

class Redshift extends Component {
  renderCreateAction() {
    if (this.props.formLoading || this.props.formLoading) {
      return (
        <div className="col-xs-3 action spinner">
          <div>
            <Spinner display={true} />
          </div>
        </div>
      )
    }

    return (
      <div className="col-xs-3 action">
        <button type="submit" disabled={!this.props.valid} className="btn btn-primary create">
          Create Destination
        </button>
      </div>
    )
  }

  render() {
    if (this.props.showError) {
      return (
        <div className="alert-danger">
          <span> An unexpected error has occurred </span>
        </div>
      )
    }

    const fieldProps = {
      ...this.props,
      fields: this.props.fields
    };

    return (
      <div>
        <h3> Redshift </h3>
        <form onSubmit={this.props.handleSubmit}>
          <Fields {...fieldProps} />

          <div className="row actions">
            <div className="col-xs-6">
              &nbsp;
            </div>

            {this.renderCreateAction()}

            <div className="col-xs-3 action cancel">
              <Link to={`/w/${this.props.workspaceId}`}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    );

  }
}

export default Redshift;
