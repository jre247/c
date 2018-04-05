import _ from 'lodash';

const settings = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: { byKey: {}, allKeys: [] }
  },
  action
) => {
  switch (action.type) {
    case 'RECEIVE_APP_SETTINGS':
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: {
          byKey: _.keyBy(action.appSettings, 'key'),
          allKeys: _.map(action.appSettings, 'key')
        },
        lastUpdated: action.receivedAt
      });
    default:
      return state
  }
}

export default settings
