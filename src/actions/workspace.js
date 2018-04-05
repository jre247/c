export const receiveUser = user => {
  return {
    type: 'RECEIVE_USER',
    user
  }
}

export const receiveAppSettings = appSettings => {
  return {
    type: 'RECEIVE_APP_SETTINGS',
    appSettings
  }
}

export const receiveEnvSettings = envSettings => {
  return {
    type: 'RECEIVE_ENV_SETTINGS',
    envSettings
  }
}

export const requestWorkspaces = () => {
  return {
    type: 'REQUEST_WORKSPACES'
  }
}

export const receiveWorkspaces = workspaces => {
  return {
    type: 'RECEIVE_WORKSPACES',
    workspaces
  }
}

export const requestSources = () => {
  return {
    type: 'REQUEST_SOURCES'
  }
}

export const receiveSources = sources => {
  return {
    type: 'RECEIVE_SOURCES',
    sources
  }
}

export const requestTables = () => {
  return {
    type: 'REQUEST_TABLES'
  }
}

export const receiveTables = tables => {
  return {
    type: 'RECEIVE_TABLES',
    tables
  }
}

export const requestHistory = () => {
  return {
    type: 'REQUEST_HISTORY'
  }
}

export const receiveHistory = history => {
  return {
    type: 'RECEIVE_HISTORY',
    history
  }
}

export const receiveDestinations = (destinations) => {
  return {
    type: 'RECEIVE_DESTINATIONS',
    destinations
  }
}

export const receiveConnections = connections => {
  return {
    type: 'RECEIVE_CONNECTIONS',
    connections
  }
}

export const receiveConnectionTypes = connectionTypes => {
  return {
    type: 'RECEIVE_CONNECTION_TYPES',
    connectionTypes
  }
}
