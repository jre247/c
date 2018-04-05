import React from 'react';
import PropTypes from 'prop-types';
import "./Grid.css";
import Tooltip from '../Tooltip/Tooltip.js';
import Number from '../Utility/Number.js';
import ColoredStatus from '../Status/ColoredStatus.js';
import ConnectionIcon from '../ConnectionIcon/ConnectionIcon.js';
import _ from 'lodash';
import { Link } from "react-router-dom";
import Spinner from '../Spinner.js';
import { Switch, Textfield } from 'react-mdl';

class Grid extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      actions: PropTypes.shape({
        search: PropTypes.shape({
          active: PropTypes.bool.isRequired, // true/false
          onChangeCallback: PropTypes.func.isRequired
        }),
        add: PropTypes.shape({
          active: PropTypes.bool.isRequired, // true/false
          text: PropTypes.string.isRequired,
          onClickCallback: PropTypes.func
        }),
        paging: PropTypes.shape({
          type: PropTypes.string.isRequired, // client/server
          active: PropTypes.bool, // true/false
          onNextCallback: PropTypes.func,
          onPreviousCallback: PropTypes.func,
          limit: PropTypes.number, // defaults to 10
          offset: PropTypes.number // defaults to 0
        })
      }),
      title: PropTypes.string,
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          link: PropTypes.string.isRequired,
          customClasses: PropTypes.string,
          onClick: PropTypes.func,
          columns: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string.isRequired,
              value: PropTypes.any,
              tooltip: PropTypes.shape({
                display: PropTypes.string,
                value: PropTypes.string
              })
            }).isRequired
          )
        }).isRequired
      ),
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          display: PropTypes.string,
          name: PropTypes.string.isRequired,
          width: PropTypes.number, // options: 1-12 (map to bootstrap grid xs columns)
          customClasses: PropTypes.string,
          visiable: PropTypes.bool
        }).isRequired
      )
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      columnMapping: {},
      loading: true
    };
  }

  componentDidMount() {
    const columnMapping = {};
    let index = 0;
    _.each(this.props.data.columns, (column) => {
      column.index = index;
      columnMapping[column.name] = column;
      index++;
    });

    let offset = 0;
    if (this.props.data.actions && this.props.data.actions.paging) {
      offset = this.props.data.actions.paging.offset;
    }

    this.setState({
      columnMapping: columnMapping,
      offset: offset,
      loading: false,
      loadingAsync: false
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data.actions || !nextProps.data.actions.paging) {
      return;
    }

    let loading = true;
    const offset = nextProps.data.actions.paging.offset;
    if (this.state.offset !== offset) {
      loading = false;
    }

    this.setState({
      loadingAsync: loading,
      offset: offset
    });
  }

  renderColumn(columnLookup) {
    const column = this.state.columnMapping[columnLookup.name];
    //const classValue = "column col-xs-" + (column.width || 4) + " " + (column.customClasses || '');
    const classValue = "";
    if (column.type === 'text') {
      if (columnLookup.tooltip) {
        return (
          <td key={column.index} className="mdl-data-table__cell--non-numeric">
            <Tooltip displayValue={columnLookup.tooltip.display}
              tooltipValue={columnLookup.tooltip.value} />
          </td>
        )
      }
      else {
        return (
          <td key={column.index} className="mdl-data-table__cell--non-numeric">
            <div>{columnLookup.value} </div>
          </td>
        )
      }
    }
    else if (column.type === 'number') {
      return (
        <td key={column.index} >
          <Number value={columnLookup.value} />
        </td>
      )
    }
    else if (column.type === 'status') {
      return (
        <td className="mdl-data-table__cell--non-numeric"  key={column.index}>
          <ColoredStatus status={columnLookup.value} />
        </td>
      )
    }
    else if (column.type === 'connection-icon') {
      if (columnLookup.value.description) {
        return (
          <td className="mdl-data-table__cell--non-numeric" key={column.index}>
            <div className="integration-thumbnail">
              <ConnectionIcon name={columnLookup.value.connectionKey} types={columnLookup.value.connectionTypes} />
            </div>
            {columnLookup.value.description}
          </td>
        )
      }

      return (
        <td className={classValue} key={column.index} >
          <ConnectionIcon name={columnLookup.value.connectionKey} types={columnLookup.value.connectionTypes} />
        </td>
      )
    }
    else if (column.type === 'html') {
      return (
        <td key={column.index}>
          {columnLookup.value()}
        </td>
      )
    }
    else {
      throw new Error('Unsupported column type in Grid component: ' + column.type);
    }

  }

  renderColumnHeader(column) {
    if (column.visible === false) {
      return (
        <th> </th>
      )
    }

    //const classValue = "column col-xs-" + (column.width || 4) + " " + column.customClasses;
    return (
      <th key={column.index} className="mdl-data-table__cell--non-numeric">
        <span>{column.display} </span>
      </th>
    );
  }

  renderTitle() {
    if (!this.props.data.title) {
      return;
    }

    return (
      <tr>
        <td>
          <h4>{this.props.data.title}</h4>
        </td>
      </tr>
    )
  }

  onPagingPreviousClick() {
    this.setState({ loadingAsync: true });
    this.props.data.actions.paging.onPreviousCallback();
  }

  onPagingNextClick() {
    this.setState({ loadingAsync: true });
    this.props.data.actions.paging.onNextCallback();
  }

  onAddClick(event) {
    if (this.props.data.actions.add.onClickCallback) {
      this.props.data.actions.add.onClickCallback(event);
    }
  }

  renderAddAction() {
    if (!this.props.data.actions.add) {
      return (<div> </div>);
    }

    return (
      <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
        onClick={this.onAddClick.bind(this)}>
        <span> {this.props.data.actions.add.text}</span>
      </button>
    )
  }

  renderSearchAction() {
    if (!this.props.data.actions.search) {
      return (<div> </div>);
    }

    return (
      <form action="#" className="table-actions">
        <Textfield
          onChange={this.props.data.actions.search.onChangeCallback}
          label="Expandable Input"
          placeholder={this.props.data.actions.search.placeholder || 'Search'}
          expandable
          expandableIcon="search"
        />

      </form>
    )
  }

  renderActionsHeader() {
    if (this.props.data.actions) {
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--7-col">
            {this.renderSearchAction()}
            {this.renderAddAction()}
          </div>
        </div>
      )
    }

    return (
      <div> </div>
    )
  }

  renderPagingPrevious() {
    if (this.props.data.actions.paging.offset === 0) {
      return (
        <span> </span>
      )
    }

    return (
      <Link to={'#'} onClick={this.onPagingPreviousClick.bind(this)}>Previous</Link>
    )
  }

  renderPagingNext() {
    if (this.props.data.rows.length === 0) {
      return (
        <span> </span>
      )
    }

    if (this.props.data.actions.paging.offset > 0 && (
      this.props.data.rows.length < this.props.data.actions.paging.limit)) {
      return (
        <span> </span>
      )
    }

    return (
      <Link to={'#'} onClick={this.onPagingNextClick.bind(this)}>Next</Link>
    )
  }

  renderActionsFooter() {
    if (!this.props.data.actions || !this.props.data.actions.paging || !this.props.data.actions.paging.active) {
      return (
        <div> </div>
      )
    }

    if (!this.props.data.actions.paging.offset && (
      this.props.data.rows.length < this.props.data.actions.paging.limit)) {
      return (
        <div> </div>
      )
    }

    return (
      <div className="grid-footer-actions">
        <div className="">
          <div className="row paging">
            <div className="col-xs-6">
              &nbsp;
            </div>
            <div className="col-xs-6 text-right">
              <div className="row">
                <div className="col-xs-10">
                  {this.renderPagingPrevious()}
                </div>
                <div className="col-xs-2">
                  {this.renderPagingNext()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderAsyncSpinner() {
    if (this.state.loadingAsync) {
      return(
        <tr className="spinner-area">
          <Spinner display={true} />
        </tr>
      )

    }
  }

  renderEmptyContent() {
    if (this.props.data.rows.length === 0) {
      return (
        <tr>
          <td>
            <span> There are no rows </span>
          </td>
        </tr>
      )
    }
  }

  onRowClick = event => {
    event.preventDefault();
    const id = parseInt(event.currentTarget.getAttribute("id"), 10);
    const row = _.find(this.props.data.rows, {'id': parseInt(id, 10)});
    if (this.props.data.rows[id].onClick) {
      this.props.data.rows[id].onClick(row, event);
    }
    const href = event.currentTarget.getAttribute("row-link");
    if (href === '#') {
      return;
    }
    this.props.history.push(href);
  }

  renderRows() {
    if (this.state.loadingAsync) {
      return (
        <tr> </tr>
      )
    }

    const self = this;
    return (
      <tbody>
        {this.props.data.rows.map(row =>
          { return self.renderRow(row) }
        )}
      </tbody>
    )
  }

  renderRow(row) {
    //const classes = 'row-link' + (row.customClasses || '');

    return (
      <tr
        row-link={row.link}
        attr-key={row.id}
        onClick={this.onRowClick.bind(this)}
        key={row.id}
        id={row.id}>
            <td>
              <Switch ripple id="switch1" defaultChecked></Switch>
            </td>

            {row.columns.map(column =>
                this.renderColumn(column)
            )}
      </tr>
    )
  }

  renderColumnHeaders() {
    const hiddenColumns = _.find(this.props.data.columns, { visible: false });
    if (hiddenColumns) { // TODO: fix logic here in case there are multiple hidden columns
      return;
    }

    return (
      <thead>
        <tr>
          <th> &nbsp; </th>
          {this.props.data.columns.map(column =>
            this.renderColumnHeader(column)
          )}
        </tr>
      </thead>
    )
  }

  render() {
    if (this.state.loading) {
      return <Spinner display={true} />;
    }

    const self = this;
    return (
      <div>
        {this.renderActionsHeader()}

        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
            <table className="mdl-data-table mdl-js-data-table mdl-data-table mdl-shadow--2dp">
              {this.renderColumnHeaders()}

              <tbody>
                {this.renderAsyncSpinner()}

                {this.renderEmptyContent()}

                { !this.state.loadingAsync ? this.props.data.rows.map(row =>
                  { return self.renderRow(row) }
                ) : <tr> </tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Grid;
