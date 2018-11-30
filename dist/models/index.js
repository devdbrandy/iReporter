'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privateProps = new WeakMap();

var User = exports.User = function () {
  function User(attributes) {
    _classCallCheck(this, User);

    User.incrementCount();
    this.id = User.count;
    this.firstname = attributes.firstname;
    this.lastname = attributes.lastname;
    this.othernames = attributes.othernames;
    this.email = attributes.email;
    this.phoneNumber = attributes.phoneNumber;
    this.registered = Date();
    this.isAdmin = false;
    privateProps.set(this, { password: attributes.password });
    this.generateUsername();
  }

  _createClass(User, [{
    key: 'generateUsername',
    value: function generateUsername() {
      this.username = this.lastname.substring(0, 5) + this.firstname.substring(0, 3) + Math.floor(Math.random() * 10);
    }
  }, {
    key: 'update',
    value: function update(data) {
      this.firstname = data.firstname || this.firstname;
      this.lastname = data.lastname || this.lastname;
      this.othernames = data.othernames || this.othernames;
      this.email = data.email || this.email;
      this.phoneNumber = data.phoneNumber || this.phoneNumber;
    }
  }, {
    key: 'adminPrivilege',
    value: function adminPrivilege(value) {
      this.isAdmin = value;
    }
  }, {
    key: 'password',
    get: function get() {
      return privateProps.get(this).password;
    }
  }], [{
    key: 'assignAdmin',
    value: function assignAdmin(user) {
      user.adminPrivilege(true);
    }
  }, {
    key: 'incrementCount',
    value: function incrementCount() {
      User.count += 1;
    }
  }]);

  return User;
}();

var Record = exports.Record = function () {
  function Record(attributes) {
    _classCallCheck(this, Record);

    Record.incrementCount();
    this.id = Record.count;
    this.creadedOn = Date();
    this.createdBy = attributes.author;
    this.type = attributes.type;
    this.location = attributes.location;
    this.comment = attributes.comment;
    this.images = attributes.images;
    this.videos = attributes.videos;
    this.status = 'draft';
  }

  _createClass(Record, [{
    key: 'update',
    value: function update(data) {
      if (this.status === 'draft') {
        this.comment = data.comment || this.comment;
        this.type = data.type || this.type;
        this.images = data.images || this.images;
        this.videos = data.videos || this.videos;
      }

      return this;
    }
  }, {
    key: 'updateLocation',
    value: function updateLocation(data) {
      if (this.status === 'draft') {
        this.location = data.location || this.location;
      }

      return this;
    }
  }], [{
    key: 'incrementCount',
    value: function incrementCount() {
      Record.count += 1;
    }
  }]);

  return Record;
}();

User.count = 0;
Record.count = 0;