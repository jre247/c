import { combineReducers } from 'redux'
import workspaces from './workspaces'
import sources from './sources'
import destinations from './destinations'
import tables from './tables'
import history from './history'
import connections from './connections'
import user from './user'
import settings from './settings'

const app = combineReducers({
  user,
  settings,
  workspaces,
  sources,
  destinations,
  tables,
  history,
  connections,
})

export default app
