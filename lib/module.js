'use strict'
var _ = require('lodash');
var Util = require('./util.js');
var path = require('path');
var async = require('async');
var fs = require('fs');

var defaults = {
  install: 'install.sh',
  config: {
    global: {
      path: process.env.HOME
    }
  }
};
class Module {
  constructor(config, directory) {
    this.config = _.merge(defaults, config);
    this.directoryPath = directory;
  }
  _scriptHelper(directoryPath, command, callback) {
    if (!directoryPath) {
      return Util.runCommands(command, callback);
    }
    else {
      Util.readFolder(directoryPath, (err, files) => {
        if(err)
          return callback(err);
        // check if path passed in config matches a filename
        if (_.find(files, {type: 'file', name: command})) {
          // run the file
          Util.runFile(path.join(directoryPath, command), callback);
        }
        else {
          // otherwise, run the commands
          Util.runCommands(command, callback);
        }
      });
    }
  }
  _hasFolder(directoryPath, folderName, callback) {
    Util.readFolder(this.directoryPath, function(err, files) {
      if (err) {
        return callback(err);
      }
      var file = _.find(files, {name: folderName});
      return callback(null, file);
    });
  }
  install(callback) {
    // if there is no directoryPath specified, then an sh file link cant be given. run the commands immediately
    if (this.config.install) {
      // first get the files in directory
      this._scriptHelper(this.directoryPath, this.config.install, callback);
    }
    else callback();
  }
  configure(callback) {
    if (!this.directoryPath) {
      return callback();
    }
    var configFolder = path.join(this.directoryPath, 'config');
    var globaTargetPath = this.config['config']['global']['path'];
    this._hasFolder(this.directoryPath, 'config', (err, exists) => {
      if (err || !exists) {
        return callback(err);
      }
      Util.readFolder(configFolder, (err, files) => {
        if (err) {
          return callback(err);
        }
        _.map(files, (fileObj) => {
          // read everything in that folder
          // check if a field override exists for the folder
          var filename = fileObj.name;
          var targetPath = globaTargetPath;
          var configValue = this.config['config'][filename];
          if (configValue) {
            // parse it and override the default option
            targetPath = configValue['path'];
          }
          // symlink it
          Util.symlinkFile(path.join(configFolder, filename).toString(), path.join(targetPath, filename).toString(), callback);
        });
      });
    });
  }
  bootstrap(callback) {
    async.series([this.install.bind(this),
      (innerCallback) => {
        if (this.config.initialize) {
          this._scriptHelper(this.directoryPath, this.config.initialize, innerCallback);
        }
        else innerCallback();
      },
      this.configure.bind(this),
      (innerCallback) => {
        if (this.config.configure) {
          this._scriptHelper(this.directoryPath, this.config.configure, innerCallback);
        }
        else innerCallback();
      }], callback);
  }
}

module.exports = Module;
