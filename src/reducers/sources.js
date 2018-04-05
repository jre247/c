import _ from 'lodash';

const sources = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { byId: {}, allIds: [] }
  },
  action
) => {
  switch (action.type) {
    case 'REQUEST_SOURCES':
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case 'RECEIVE_SOURCES':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          byId: _.keyBy(action.sources, 'id'),
          allIds: _.map(action.sources, 'id')
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default sources
