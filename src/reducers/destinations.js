import _ from 'lodash';

const destinations = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { byId: {}, allIds: [] }
  },
  action
) => {
  switch (action.type) {
    case 'REQUEST_DESTINATIONS':
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case 'RECEIVE_DESTINATIONS':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          byId: _.keyBy(action.destinations, 'id'),
          allIds: _.map(action.destinations, 'id')
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default destinations
