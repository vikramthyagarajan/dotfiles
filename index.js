var _ = require('lodash');

var Util = require('./lib/util.js');
var Module = require('./lib/module.js');

var command = process.argv[2];
var moduleName = process.argv[3];
var directory = process.argv[4]? process.argv[4]:'.';

if (!command) {
  return console.error('please enter the command to run');
}
if (!moduleName) {
  return console.error('please enter the name of the module');
}

// checks whether the folder exists in dotfiles

Util.readFolder(directory, function(err, files) {
  if (err) {
    return console.error(err);
  }
  var foundFile = _.find(files, {name: moduleName});
  if (!foundFile) {
    var allModules = _.map(files, 'name');
    return console.error('module does not exist in the dotfiles. Available modules are ', allModules);
  }
  else {
    // reading the module.json file of the module if exists
    Util.readModuleFile(foundFile.name + '/module.json', function(err, moduleConfig) {
      console.log('reading module file ', foundFile + '/module.json');
      var mod = new Module(moduleConfig, directory + '/' + moduleName);
      if (command == 'install') {
        mod.install(function(err){
          if (err) {
            return console.error('error while installing module', err);
          }
          console.log('installation of module done successfully');
        });
      }
      else if(command == 'configure') {
        mod.configure(function(err){
          if (err) {
            return console.error('error while configuring module', err);
          }
          console.log('configuration of module done successfully');
        });
      }
      else if(command == 'bootstrap') {
        mod.bootstrap(function(err){
          if (err) {
            return console.error('error while bootstrapping module', err);
          }
          console.log('bootstrapping of module done successfully');
        });
      }
      else {
        return console.error('invalid command. Only bootstrap, install and configure allowed');
      }
    });
  }
});
