var fs = require('fs');
var spawn = require('child_process').spawn;
var async = require('async');

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

exports.readFolder = function(path, callback) {
  var schema = {
    type: String, //file or folder
    name: String,
    stats: fs.Stats
  };
};
