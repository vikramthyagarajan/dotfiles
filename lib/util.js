var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var async = require('async');
var _ = require('lodash');

function runCommand(command, finishedCallback) {
  var args = command.split(' ');
  var app = args.shift();
  var cmd;
  console.info('+++ running command - ', command);
  var cmd = spawn(app, args);
  cmd.on('close', (code) => {
    if (code === 0) {
      console.info('+++ finished command - ', command);
      if(finishedCallback)
        finishedCallback(code);
    }
  });
  cmd.stdout.on('data', (data) => {
    console.info(data.toString());
  });
  cmd.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  cmd.on('error', (err) => {
    console.error('has exit with', err);
    console.info('+++ finished command - ', command);
    finishedCallback(err);
  });
};

/**
 * Utility function to run a set of commands, given as an inline String.
 * Runs all commands in series and prints their output and values to
 * the console. Any error stops all the further commands from running
 */
exports.runCommands = function(commands, callback) {
  console.info('starting to run series of commands', commands);
  var commandLines = commands.split(';');
  async.eachSeries(commandLines, runCommand, function(err) {
    console.info('done with run command')
    callback(err);
  })
};

/**
 * Utility function to run a bash file, given its path. Path must be relative
 * to the dotfiles directory, and not starting in a slash.
 */
exports.runFile = function(fileName, callback) {
  if (fileName[0] == '/') {
    fileName = fileName.slice(1, fileName.length);
  }
  fileName = __dirname + '/../' + fileName;
  fs.stat(fileName, function(err, stat) {
    if (err) {
      callback(err);
    }
    else if (!stat.isFile()) {
      console.error('specified path is not a file');
      callback(err);
    }
    else {
      console.info('### running file - ', fileName);
      runCommand('bash ' + fileName, callback);
    }
  })
};

/**
 * Utility function read a folder, given its path, and return the
 * type of files and folders it contains. Path must be relative
 * to the dotfiles directory, and not starting in a slash.
 */
exports.readFolder = function(filePath, callback) {
  var schema = {
    type: String, //file or folder
    name: String,
    stats: fs.Stats
  };
  if (filePath[0] == '/') {
    return callback({message: 'filePath to readFolder must be relative, not absolute'});
  }
  filePath = __dirname + '/../' + filePath;
  fs.readdir(filePath, function(err, files) {
    if (err) {
      return callback(err);
    }
    async.map(files, function(fileName, innerCallback) {
      var obj = _.clone(schema);
      obj.name = fileName;
      fs.lstat(path.join(filePath, fileName), function(err, stats) {
        if (err) {
          return innerCallback(err);
        }
        obj.stats = stats;
        var type;
        if(stats.isSocket())
          type = 'socket';
        else if(stats.isSymbolicLink())
          type = 'link';
        else if(stats.isFIFO())
          type = 'fifo';
        else if(stats.isFile())
          type = 'file';
        else if(stats.isDirectory())
          type = 'folder';
        obj.type = type;
        return innerCallback(null, obj);
      });
    }, callback);
  });
};

/**
 * Utility function symlink a file to a target. Path must be relative
 * to the dotfiles directory, and not starting in a slash.
 * Also replaces the $HOME and ~ paths into the process.env/HOME variable
 */
exports.symlinkFile = function(filePath, targetPath, callback) {
  if (filePath[0] == '/') {
    return callback({message: 'filePath to symlink must be relative, not absolute'});
  }
  filePath = __dirname + '/../' + filePath;
  targetPath = targetPath.replace('$HOME', process.env.HOME);
  targetPath = targetPath.replace('~', process.env.HOME);
  return fs.symlink(filePath, targetPath, 'file', callback);
};

/**
 * Utility function that reads the module.json file. Returns {} if it doesn't exist, and
 * the json object if it does
 */
exports.readModuleFile = function(filePath, callback) {
  if (filePath[0] == '/') {
    return callback({message: 'filePath to symlink must be relative, not absolute'});
  }
  filePath = __dirname + '/../' + filePath;
  // check if the file exists
  fs.exists(filePath, function(isExists) {
    if(isExists) {
      fs.readFile(filePath, 'utf8', function(err, contents) {
        if (err) {
          return callback(err);
        }
        callback(null, JSON.parse(contents));
      });
    }
    else {
      return callback(null, {});
    }
  });
};
