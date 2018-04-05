import _ from 'lodash';

const connections = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { byId: {}, allIds: [] }
  },
  action
) => {
  switch (action.type) {
    case 'REQUEST_CONNECTIONS':
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case 'RECEIVE_CONNECTIONS':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          byId: _.keyBy(action.connections, 'id'),
          allIds: _.map(action.connections, 'id')
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default connections
