import _ from 'lodash';

const tables = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { byId: {}, allIds: [] }
  },
  action
) => {
  switch (action.type) {
    case 'REQUEST_TABLES':
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case 'RECEIVE_TABLES':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          byId: _.keyBy(action.tables, 'sourceTaskId'),
          allIds: _.map(action.tables, 'sourceTaskId')
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default tables
