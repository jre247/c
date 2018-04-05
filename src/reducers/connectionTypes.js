import _ from 'lodash';

const connections = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { hash: {}, allIds: [] }
  },
  action
) => {
  switch (action.type) {
    case 'RECEIVE_CONNECTION_TYPES':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          hash: _.keyBy(action.connectionTypes, 'key'),
          allIds: _.map(action.connectionTypes, 'id')
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default connections
