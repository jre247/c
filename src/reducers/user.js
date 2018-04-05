const user = (
  state = {
    isFetching: false,
    didInvalidate: false,
    value: null
  },
  action
) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        value: action.user,
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default user
