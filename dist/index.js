'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var qs = _interopDefault(require('qs'));

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var RemoteInstance = function () {
  function RemoteInstance(options) {
    classCallCheck(this, RemoteInstance);
    var accessToken = options.accessToken,
        url = options.url,
        headers = options.headers;


    this.accessToken = accessToken;
    this.headers = headers || {};

    if (!url) {
      throw new Error('No Directus URL provided');
    }

    this.url = url;
  }

  createClass(RemoteInstance, [{
    key: '_get',
    value: function _get(endpoint) {
      var _this = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var headers = this._requestHeaders;

      return new Promise(function (resolve, reject) {
        axios.get(_this.url + endpoint, {
          params: params,
          headers: headers,
          paramsSerializer: function paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'brackets' });
          }
        }).then(function (res) {
          return resolve(res.data);
        }).catch(function (err) {
          if (err.response && err.response.data) {
            return reject(err.response.data);
          }

          return reject(err);
        });
      });
    }
  }, {
    key: '_post',
    value: function _post(endpoint) {
      var _this2 = this;

      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var headers = this._requestHeaders;

      return new Promise(function (resolve, reject) {
        axios.post(_this2.url + endpoint, data, { headers: headers }).then(function (res) {
          return resolve(res.data);
        }).catch(function (err) {
          if (err.response && err.response.data) {
            return reject(err.response.data);
          }

          return reject(err);
        });
      });
    }
  }, {
    key: '_put',
    value: function _put(endpoint) {
      var _this3 = this;

      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var headers = this._requestHeaders;

      return new Promise(function (resolve, reject) {
        axios.put(_this3.url + endpoint, data, { headers: headers }).then(function (res) {
          return resolve(res.data);
        }).catch(function (err) {
          if (err.response && err.response.data) {
            return reject(err.response.data);
          }

          return reject(err);
        });
      });
    }
  }, {
    key: '_delete',
    value: function _delete(endpoint) {
      var _this4 = this;

      var headers = this._requestHeaders;

      return new Promise(function (resolve, reject) {
        axios.delete(_this4.url + endpoint, { headers: headers }).then(function (res) {
          return resolve(res.data);
        }).catch(function (err) {
          if (err.response && err.response.data) {
            return reject(err.response.data);
          }

          return reject(err);
        });
      });
    }

    // Authentication
    // -------------------------------------------

  }, {
    key: 'authenticate',
    value: function authenticate() {
      var _this5 = this;

      var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('email');
      var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('password');

      return new Promise(function (resolve, reject) {
        _this5._post('auth/request-token', { email: email, password: password }).then(function (res) {
          if (res.success) {
            _this5.accessToken = res.data.token;
            return resolve(res);
          }
          return reject(res);
        }).catch(function (err) {
          return reject(err);
        });
      });
    }

    // Items
    // ----------------------------------------------------------------------------------

  }, {
    key: 'createItem',
    value: function createItem() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._post('tables/' + table + '/rows', data);
    }
  }, {
    key: 'getItems',
    value: function getItems() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._get('tables/' + table + '/rows', params);
    }
  }, {
    key: 'getItem',
    value: function getItem() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('id');
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this._get('tables/' + table + '/rows/' + id, params);
    }
  }, {
    key: 'updateItem',
    value: function updateItem() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('id');
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('data');

      return this._put('tables/' + table + '/rows/' + id, data);
    }
  }, {
    key: 'deleteItem',
    value: function deleteItem() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('id');

      return this._delete('tables/' + table + '/rows/' + id);
    }
  }, {
    key: 'createBulk',
    value: function createBulk() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');

      if (Array.isArray(data) === false) {
        throw new TypeError('Parameter data should be an array of objects');
      }

      return this._post('tables/' + table + '/rows/bulk', {
        rows: data
      });
    }
  }, {
    key: 'updateBulk',
    value: function updateBulk() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');

      if (Array.isArray(data) === false) {
        throw new TypeError('Parameter data should be an array of objects');
      }

      return this._put('tables/' + table + '/rows/bulk', {
        rows: data
      });
    }
  }, {
    key: 'deleteBulk',
    value: function deleteBulk() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');

      if (Array.isArray(data) === false) {
        throw new TypeError('Parameter data should be an array of objects');
      }

      return this._delete('tables/' + table + '/rows/bulk', {
        rows: data
      });
    }

    // Files
    // ----------------------------------------------------------------------------------

  }, {
    key: 'createFile',
    value: function createFile() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._post('files', data);
    }
  }, {
    key: 'getFiles',
    value: function getFiles() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._get('files', params);
    }
  }, {
    key: 'getFile',
    value: function getFile() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');

      return this._get('files/' + id);
    }
  }, {
    key: 'updateFile',
    value: function updateFile() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');

      return this._put('files/' + id, data);
    }

    // Tables
    // ----------------------------------------------------------------------------------

  }, {
    key: 'createTable',
    value: function createTable() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');

      return this._post('tables', { name: name });
    }
  }, {
    key: 'getTables',
    value: function getTables() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._get('tables', params);
    }
  }, {
    key: 'getTable',
    value: function getTable() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._get('tables/' + table, params);
    }

    // Columns
    // ----------------------------------------------------------------------------------

  }, {
    key: 'createColumn',
    value: function createColumn() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._post('tables/' + table + '/columns', data);
    }
  }, {
    key: 'getColumns',
    value: function getColumns() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._get('tables/' + table + '/columns', params);
    }
  }, {
    key: 'getColumn',
    value: function getColumn() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('column');

      return this._get('tables/' + table + '/columns/' + column);
    }
  }, {
    key: 'updateColumn',
    value: function updateColumn() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('column');
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this._put('tables/' + table + '/columns/' + column, data);
    }
  }, {
    key: 'deleteColumn',
    value: function deleteColumn() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('column');

      return this._delete('tables/' + table + '/columns/' + column);
    }

    // Groups
    // ----------------------------------------------------------------------------------

  }, {
    key: 'createGroup',
    value: function createGroup() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');

      return this._post('groups', { name: name });
    }
  }, {
    key: 'getGroups',
    value: function getGroups() {
      return this._get('groups');
    }
  }, {
    key: 'getGroup',
    value: function getGroup() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');

      return this._get('groups/' + id);
    }

    // Privileges
    // ----------------------------------------------------------------------------------

  }, {
    key: 'createPrivileges',
    value: function createPrivileges() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._post('privileges/' + id, data);
    }
  }, {
    key: 'getPrivileges',
    value: function getPrivileges() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');

      return this._get('privileges/' + id);
    }
  }, {
    key: 'getTablePrivileges',
    value: function getTablePrivileges() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
      var table = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('table');

      return this._get('privileges/' + id + '/' + table);
    }
  }, {
    key: 'updatePrivileges',
    value: function updatePrivileges() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
      var table = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('table');

      return this._get('privileges/' + id + '/' + table);
    }

    // Preferences
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getPreferences',
    value: function getPreferences() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');

      return this._get('tables/' + table + '/preferences');
    }
  }, {
    key: 'updatePreference',
    value: function updatePreference() {
      var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._update('tables/' + table + '/preferences', data);
    }

    // Messages
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getMessages',
    value: function getMessages() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._get('messages/rows', params);
    }
  }, {
    key: 'getMessage',
    value: function getMessage() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');

      return this._get('messages/rows/' + id);
    }

    // Activity
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getActivity',
    value: function getActivity() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._get('activity', params);
    }

    // Bookmarks
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getBookmarks',
    value: function getBookmarks() {
      return this._get('bookmarks');
    }
  }, {
    key: 'getUserBookmarks',
    value: function getUserBookmarks() {
      return this._get('bookmarks/self');
    }
  }, {
    key: 'getBookmark',
    value: function getBookmark() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');

      return this._get('bookmarks/' + id);
    }
  }, {
    key: 'createBookmark',
    value: function createBookmark() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('data');

      return this._post('bookmarks', data);
    }
  }, {
    key: 'deleteBookmark',
    value: function deleteBookmark() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');

      return this._delete('bookmarks/' + id);
    }

    // Settings
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getSettings',
    value: function getSettings() {
      return this._get('settings');
    }
  }, {
    key: 'getSettingsByCollection',
    value: function getSettingsByCollection() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');

      return this._get('settings/' + name);
    }
  }, {
    key: 'updateSettings',
    value: function updateSettings() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._put('settings/' + name, data);
    }

    // Users
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getUsers',
    value: function getUsers() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._get('users', params);
    }
  }, {
    key: 'getUser',
    value: function getUser() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');

      return this._get('users/' + id);
    }

    // Hash
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getHash',
    value: function getHash() {
      var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('string');
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this._post('hash', data);
    }

    // Random
    // ----------------------------------------------------------------------------------

  }, {
    key: 'getRandom',
    value: function getRandom() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this._get('random', params);
    }
  }, {
    key: '_requestHeaders',
    get: function get$$1() {
      var headers = this.headers;

      if (this.accessToken) {
        headers.Authorization = 'Bearer ' + this.accessToken;
      }

      return headers;
    }
  }]);
  return RemoteInstance;
}();

function requiredParam(name) {
  throw new Error('Missing parameter [' + name + ']');
}

var remote = RemoteInstance;

var directusSdkJavascript = {
  RemoteInstance: remote
};

module.exports = directusSdkJavascript;
