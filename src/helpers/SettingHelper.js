let settings = {};

var SettingHelper = {
  async initialize() {
    let env = this.getMetaElementValue('env-name');
    if (env === '%ENV_NAME%' || env === 'undefined') {
      env = "local";
    }
    if (env) {
      this.set('env-name', env);
    }
    let googleClientId = this.getMetaElementValue('google-client-id');
    if (googleClientId === '%GOOGLE_CLIENT_ID%' || googleClientId === 'undefined') {
      googleClientId = null;
    }
    if (googleClientId) {
      this.set('google-client-id', googleClientId);
    }
    let apiUrl = this.getMetaElementValue('api-url');
    if (apiUrl === '%API_URL%' || apiUrl === 'undefined') {
      apiUrl = null;
    }
    if (apiUrl) {
      this.set('api-url', apiUrl);
    }
    let logFormat = this.getMetaElementValue('log-format');
    if (logFormat === '%LOG_FORMAT%' || logFormat === 'undefined') {
      logFormat = 'json';
    }
    this.set('log-format', logFormat);

    return {
      apiUrl: this.get('api-url'),
      googleClientId: this.get('google-client-id'),
      env: this.get('env-name')
    };
  },

  getMetaElementValue(key) {
    const selector = 'meta[name=console-' + key + ']';
    var value = document.head.querySelector(selector);
    if (typeof(value) !== 'undefined' && value) {
      return value.content;
    }
    return null;
  },

  set(key, value) {
    settings[key] = value;
  },

  get(key) {
    var value = settings[key];
    if (value === 'undefined') {
      return null;
    }
    return value;
  }
}

export default SettingHelper;
