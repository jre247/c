import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class Breadcrumbs extends React.Component {
  static propTypes = {
    breadcrumbs: PropTypes.object,
    display: PropTypes.bool
  };

  render() {
    if (!this.props.display || !this.props.breadcrumbs || (this.props.breadcrumbs && this.props.breadcrumbs.display === false)) {
      return ( <div> </div>);
    }

    if (this.props.breadcrumbs.items.length === 0) {
      return (
        <div className="row">
          <div className="col-xs-12 text-left">
            <ol className="breadcrumb hide-breadcrumbs">
              <li className="breadcrumb-item">
                &nbsp;
              </li>
            </ol>
          </div>
        </div>
      )
    }

    return (
      <div className="row">
        <div className="col-xs-12 text-left">
          <ol className="breadcrumb">
            {this.props.breadcrumbs.items.map(function(breadcrumb) {
                if (breadcrumb.active) {
                  return (<li key={breadcrumb.name} className="breadcrumb-item active">{breadcrumb.display}</li>)
                }
                else {
                  return (
                    <li key={breadcrumb.name} className="breadcrumb-item">
                      <Link to={breadcrumb.link}>{breadcrumb.display}</Link>
                    </li>
                  )
                }
              }
            )}
          </ol>
        </div>
      </div>
    )
  }
}

export default Breadcrumbs
