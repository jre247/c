import SettingHelper from './SettingHelper';
import moment from 'moment';
import _ from 'lodash';

const LogHelper = {
  debug(message, customParams = {}) {
    const env = SettingHelper.get('env-name');
    if (env.toLowerCase() === 'prod') {
      return;
    }
    const params = { customParams: customParams, message: message, level: 'DEBUG' };
    this.writeMessage(params);
  },

  event(name, customParams = {}) {
    const env = SettingHelper.get('env-name');
    if (env.toLowerCase() === 'prod') {
      return;
    }
    const params = { name: name, level: 'EVENT' };
    const paramsConcat = Object.assign({}, params, customParams);
    this.writeMessage(paramsConcat);
  },

  error(message, customParams = {}) {
    const env = SettingHelper.get('env-name');
    if (env.toLowerCase() === 'prod') {
      return;
    }
    const params = { message: message, level: 'ERROR' };
    const paramsConcat = Object.assign({}, params, customParams);
    this.writeMessage(paramsConcat);
  },

  writeMessage(params) {
    const logFormat = SettingHelper.get('log-format');
    const ts = moment().toISOString();

    // Json
    if (logFormat.toLowerCase() === 'json') {
      const paramsConcat = Object.assign({}, params, { ts: ts });
      console.log(paramsConcat);
    }
    // Delimited
    else {
      let messageFormatted = params.message || '';
      if (typeof(message) === 'object') {
        messageFormatted = "Message value ommitted because of type 'object'";
      }
      const paramsFormatted = Object.assign({}, params, { message: messageFormatted});
      let printedMessage = params.level + ' | ' + ts + ' | ';
      paramsFormatted.level = null; // clear level
      _.each(paramsFormatted, (value, key) => {
        if (typeof(value) === 'string' && !value) {
          return;
        }
        if (!value) {
          return;
        }
        if (typeof(value) === 'object') {
          let stringifiedValue = JSON.stringify(value);
          if (stringifiedValue.length > 30) {
            stringifiedValue = stringifiedValue.substr(0, 30) + '...';
          }
          printedMessage += key + ': ' + stringifiedValue + ' | ' ;
        }
        else {
          printedMessage += key + ': ' + value + ' | ' ;
        }
      });
      console.log(printedMessage);
    }
  }
}

export default LogHelper;
