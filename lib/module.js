'use strict'
var _ = require('lodash');

var defaults = {
  global: {
  }
};
class Module {
  constructor(config, directory) {
    this.config = _.merge(defaults, config);
    this.directoryPath = directory;
  }
  install(callback) {
    callback('not implemented');
  }
  configure(callback) {
    callback('not implemented');
  }
  run(callback) {
    callback('not implemented');
  }
}

module.exports = Module;
