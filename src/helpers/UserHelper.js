import Api from '../data/Api.js';

var user;
var UserHelper = {
  userIsLoggedIn() {
    if (typeof(user) === 'undefined' || !user || !user.id) {
      return false;
    }

    var cookie = this.getAuthCookie();
    if (!cookie) {
      return false;
    }

    return true;
  },

  async setUser() {
    var cookie = this.getAuthCookie();
    if (!cookie) {
      return;
    }

    try {
      user = await Api.getUser();
      if (window.analytics && typeof(window.analytics) !== 'undefined') {
        window.analytics.identify(user.email);
      }
    }
    catch(e) {
      // Suppressing exception for now so that user value will be null
    }

  },

  getAuthCookie() {
    return this.getCookie("identity-session");
  },

  getUser() {
    return user;
  },

  getCookie(name) {
    if (typeof(document) === 'undefined') {
      return null;
    }
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
}

export default UserHelper;
