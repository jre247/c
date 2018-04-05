import _ from 'lodash';
import Api from '../data/Api.js';

let connectionTypes = [];
let connectionTypeMapping;
var ConnectionHelper = {
  async getConnectionTypes() {
    if (connectionTypes.length === 0) {
      await this.setConnectionTypes();
    }
    return connectionTypes;
  },

  async getConnectionTypeMapping() {
    if (connectionTypes.length === 0) {
      await this.setConnectionTypes();
    }
    return connectionTypeMapping;
  },

  async setConnectionTypes() {
    connectionTypes = await Api.getConnectionTypes();
    connectionTypeMapping = _.keyBy(connectionTypes, 'key');
  }
}

export default ConnectionHelper;
