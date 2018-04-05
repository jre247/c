import SettingHelper from '../helpers/SettingHelper.js';
import LogHelper from '../helpers/LogHelper.js';

var Api = {
  loginWithGoogle(token) {
    var url = "/auth/google?token=" + token;
    return this.get(url);
  },

  logout() {
    var url = "/logout";
    return this.post(url);
  },

  getUser() {
    var url = '/api/user';
    return this.get(url, { key: 'user' });
  },

  getConnectionTypes() {
    var url = '/api/connectionTypes';
    return this.get(url, { key: 'connectionTypes' });
  },

  getWorkspaces() {
    var url = '/api/workspaces';
    return this.get(url, { key: 'workspaces' });
  },

  getWorkspace(workspaceId) {
    var url = '/api/w/' + workspaceId;
    return this.get(url, { key: 'workspace', workspaceId: workspaceId });
  },

  getWorkspaceMetrics(workspaceId) {
    var url = '/api/w/' + workspaceId + '/metrics';
    return this.get(url, { key: 'workspace.metrics', workspaceId: workspaceId });
  },

  getConnections(workspaceId) {
    var url = '/api/w/' + workspaceId + '/connections';
    return this.get(url, { key: 'workspace.connections', workspaceId: workspaceId });
  },

  getSources(workspaceId) {
    var url = '/api/w/' + workspaceId + '/sources';
    return this.get(url, { key: 'workspace.sources', workspaceId: workspaceId });
  },

  getSource(workspaceId, sourceId) {
    var url = '/api/w/' + workspaceId + '/sources/' + sourceId;
    return this.get(url, { key: 'workspace.source', workspaceId: workspaceId, sourceId: sourceId });
  },

  getSourceTables(workspaceId, sourceId) {
    var url = '/api/w/' + workspaceId + '/p/' + sourceId + '/tables';
    return this.get(url, { key: 'workspace.source.tables', workspaceId: workspaceId, sourceId: sourceId });
  },

  getTableHistory(workspaceId, sourceId, tableId, limit, offset) {
    const params = '?limit=' + (limit || 10) + '&offset=' + (offset || 0);
    var url = '/api/w/' + workspaceId + '/p/' + sourceId + '/tables/' + tableId + '/history' + params;
    return this.get(url, { key: 'workspace.sources.table.history', workspaceId: workspaceId, sourceId: sourceId, tableId: tableId, limit: limit, offset: offset });
  },

  getDestinations(workspaceId) {
    var url = '/api/w/' + workspaceId + '/destinations';
    return this.get(url, { key: 'workspace.destinations', workspaceId: workspaceId });
  },

  createDestination(body, workspaceId) {
    var url = '/api/w/' + workspaceId + '/destination/create';
    return this.post(url, body, { key: 'workspace.destination.create', workspaceId: workspaceId, type: body.type, name: body.name });
  },

  createSource(body, workspaceId) {
    var url = '/api/w/' + workspaceId + '/source/create';
    return this.post(url, body, { key: 'workspace.source.create', workspaceId: workspaceId, type: body.type, name: body.name });
  },

  get(endpoint, customParams = {}) {
    const apiUrl = SettingHelper.get('api-url');

    return new Promise((resolve, reject) => {
      var promise = fetch(apiUrl + endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      promise
        .then(response => response.json())
        .then ((data) => {
          if (data.code === 500) {
            reject(data.message);
            return;
          }
          if (data.error && data.error.length > 0) {
            reject(data.error);
            return;
          }

          if (data.code === 403 || data.code === 401 || data.code === 400) {
             reject({status: data.code });
             return;
          }

          var responseStringified = JSON.stringify(data);
          var results = JSON.parse(responseStringified).result;

          // Log success
          const logParams = Object.assign({}, { response: results }, customParams);
          LogHelper.event('api.get.success', logParams);

          resolve(results || {});
        })
        .catch(error => {
          const logParams = Object.assign({}, { error: error }, customParams);
          LogHelper.event('api.get.error', logParams);
          reject(error);
        });
    });
  },

  post(endpoint, data, customParams) {
    const apiUrl = SettingHelper.get('api-url');
    var body = {};
    if (data) {
      body = JSON.stringify(data)
    }
    return new Promise((resolve, reject) => {
      var promise = fetch(apiUrl + endpoint, {
        method: 'POST',
        body: body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      promise
        .then ((response) => {
          const logParams = Object.assign({}, { response: response }, customParams);
          LogHelper.event('api.post.success', logParams);
          resolve(response);
        })
        .catch(error => {
          const logParams = Object.assign({}, { error: error }, customParams);
          LogHelper.event('api.post.error', logParams);
          reject(error);
        });
    });
  }

}

export default Api;
