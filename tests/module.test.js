var test = require('tape');
var module = require('../lib/module.js');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var Module = require('../lib/module.js');

test('it should test module defaults', (tape) => {
  var testFolder = "tests/module-tests/defaults/";
  var mod = new Module({}, testFolder);
  var homeDir = process.env.HOME;
  test('it should run install.sh by default', (assert) => {
    //install.sh will create /tmp/.install file
    mod.install(function(err) {
      if (err) {
        assert.fail(err);
      }
      else {
        fs.exists('/tmp/.install', function(exists) {
          assert.ok(exists);
        });
      }
      assert.end();
    });
  });
  test('it should symlink config files by default', (assert) => {
    //will symlink to ~/tmp/.def-sym
    mod.configure(function (err) {
      if (err) {
        assert.fail(err)
        return assert.end();
      }
      fs.lstat(path.join(homeDir, '/tmp/.def-sym'), function(err, stats) {
        if (err || !stats) {
          assert.fail(err);
        }
        if (stats) {
          assert.ok(stats.isSymbolicLink(), 'creates symbolic link');
          fs.unlinkSync('/tmp/.def-sym');
        }
        assert.end();
      });
    });
  });
  tape.end();
});

test('it should call scripts at correct time in lifecycle', (tape) => {
  var testFolder = "tests/module-tests/lifecycle";
  test('it should run install, init and configure in correct sequence', (assert) => {
    var mod = new Module({
      install: 'echo "first" > /tmp/dotfiles/lifecycle.txt',
      initialize: 'echo "second" > /tmp/dotfiles/lifecycle.txt',
      configure: 'echo "third" > /tmp/dotfiles/lifecycle.txt'
    }, null);
    mod.run(function (err) {
      if (err) {
        assert.fail(err);
        return assert.end();
      }
      fs.readFile('/tmp/dotfiles/lifecycle.txt', 'utf8', function(err, fileContents) {
        if (err) {
          assert.fail(err);
        }
        else if(fileContents) {
          // removing the first and last \n
          fileContents = fileContents.replace(/^\n/, "");
          fileContents = fileContents.replace(/\n$/, "");
          var words = fileContents.split('\n');
          assert.equals(words.indexOf("first"), 0);
          assert.equals(words.indexOf("second"), 1);
          assert.equals(words.indexOf("third"), 2);
        }
        assert.end();
      });
    });
  });
  test('it should allow for filenames to be passed in scripts', (assert) => {
    var mod = new Module({
      install: 'install-new.sh'
    }, path.join(testFolder, 'filescript'));
    mod.run(function (err) {
      if (err) {
        assert.fail(err);
        return assert.end();
      }
      var isExists = fs.existsSync('/tmp/dotfiles/filescript.txt');
      assert.ok(isExists);
      if (isExists) {
        fs.unlinkSync('/tmp/dotfiles/filescript.txt');
      }
      assert.end();
    });
  });
  tape.end();
});

test('it should set read configuration object', (tape) => {
  var testFolder = "tests/module-tests/configuration"
  test('it should should symlink based on global config', (assert) => {
    var mod = new Module({
      "config": {
        "global": {
          "path": "/tmp/dotfiles/"
        }
      }
    }, path.join(testFolder, 'global-test'));
    mod.configure(function (err) {
      if (err) {
        assert.fail(err);
      }
      else {
        assert.ok(fs.existsSync('/tmp/dotfiles/temp.txt'));
        fs.unlinkSync('/tmp/dotfiles/temp.txt');
      }
      assert.end();
    });
  });
  test('it should symlink based on filename path override', (assert) => {
    var mod = new Module({
      "config": {
        "temp2.txt": {
          "global": {
            "path": '/tmp/dotfiles/'
          }
        }
      }
    }, path.join(testFolder, 'filename-test'));
    mod.configure(function (err) {
      if (err) {
        assert.fail(err);
      }
      else {
        assert.ok(fs.existsSync('/tmp/dotfiles/temp2.txt'));
        fs.unlinkSync('/tmp/dotfiles/temp2.txt');
      }
      assert.end();
    });
  });
  test('it should symlink based on foldername symlinks field override', (assert) => {
    var mod = new Module({
      "config": {
        "testfol": {
          "symlinks": {
            "temp3.txt": "/tmp/dotfiles/tmp3",
            "temp4.txt": "/tmp/dotfiles/tmp4"
          }
        }
      }
    }, path.join(testFolder, 'foldername-test'));
    mod.configure(function (err) {
      if (err) {
        assert.fail(err);
      }
      else {
        assert.ok(fs.existsSync('/tmp/dotfiles/tmp3'));
        assert.ok(fs.existsSync('/tmp/dotfiles/tmp4'));
        fs.unlinkSync('/tmp/dotfiles/tmp3');
        fs.unlinkSync('/tmp/dotfiles/tmp4');
      }
      assert.end();
    });
  });
  tape.end();
});

test('it should run submodules', (tape) => {
  var testFolder = "tests/module-tests/sub-modules";
  test('it should accept submodules specified by inner folders', (assert) => {
    // the inner submodule creates a folder in /tmp/dotfiles/sub1.txt
    var mod = new Module({}, path.join(testFolder, 'folders'));
    mod.install(function (err) {
      if (err) {
        assert.fail(err);
        return assert.end();
      }
      var isExists = fs.existsSync('/tmp/dotfiles/sub1.txt');
      assert.ok(isExists);
      if (isExists) {
        fs.unlinkSync('/tmp/dotfiles/sub1.txt');
      }
      assert.end();
    });
  });
  test('it should accept submodule by config', (assert) => {
    // the inner submodule creates a folder in /tmp/dotfiles/sub2.txt
    var mod = new Module({
      submodules: [{
        install: 'touch /tmp/dotfiles/sub2.txt'
      }]
    }, null);
    mod.install(function (err) {
      if (err) {
        assert.fail(err);
        return assert.end();
      }
      var isExists = fs.existsSync('/tmp/dotfiles/sub2.txt');
      assert.ok(isExists);
      if (isExists) {
        fs.unlinkSync('/tmp/dotfiles/sub2.txt');
      }
      assert.end();
    });
  });
  tape.end();
});
