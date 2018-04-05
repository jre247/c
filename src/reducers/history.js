import _ from 'lodash';

const history = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { byId: {}, allIds: [] }
  },
  action
) => {
  switch (action.type) {
    case 'REQUEST_HISTORY':
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case 'RECEIVE_HISTORY':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          byId: _.chain(action.history).sortBy('startTime').keyBy('runId').value(),
          allIds: _.chain(action.history).sortBy('runId').map('runId').value()
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default history
