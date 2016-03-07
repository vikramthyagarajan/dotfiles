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
    callback();
  }
  configure(callback) {
    callback();
  }
}

module.exports = Module;
