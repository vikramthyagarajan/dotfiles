'use strict'
var _ = require('lodash');
var Util = require('./util.js');
var path = require('path');

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
  install(callback) {
    // if there is no directoryPath specified, then an sh file link cant be given. run the commands immediately
    if (!this.directoryPath) {
      return Util.runCommands(this.config.install, callback);
    }
    if (this.config.install) {
      // first get the files in directory
      Util.readFolder(this.directoryPath, (err, files) => {
        if(err)
          return callback(err);
        // check if path passed in config matches a filename
        if (_.find(files, {type: 'file', name: this.config.install})) {
          // run the file
          Util.runFile(path.join(this.directoryPath, this.config.install), callback);
        }
        else {
          // otherwise, run the commands
          Util.runCommands(this.config.install, callback);
        }
      });
    }
    else callback();
  }
  configure(callback) {
    if (!this.directoryPath) {
      return callback();
    }
    var configFolder = path.join(this.directoryPath, 'config');
    var globaTargetPath = this.config['config']['global']['path'];
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
        console.log('hehehehehe');
        console.log(path.join(configFolder, filename).toString());
        console.log(targetPath);
        Util.symlinkFile(path.join(configFolder, filename).toString(), path.join(targetPath, filename).toString(), callback);
      });
    });
  }
  bootstrap(callback) {
    callback('not implemented');
  }
}

module.exports = Module;
