import _ from 'lodash';

const workspaces = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { byId: {}, allIds: [] }
  },
  action
) => {
  switch (action.type) {
    case 'REQUEST_WORKSPACES':
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case 'RECEIVE_WORKSPACES':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          byId: _.keyBy(action.workspaces, 'id'),
          allIds: _.map(action.workspaces, 'id')
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default workspaces
