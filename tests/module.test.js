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
      fs.exists('/tmp/.install', function(exists) {
        assert.ok(exists);
      });
      assert.end();
    });
  });
  test('it should symlink config files by default', (assert) => {
    //will symlink to ~/tmp/.def-sym
    mod.configure(function (err) {
      if (err) {
        assert.fail(err)
      }
      fs.lstat(path.join(homeDir, '/tmp/.def-sym'), function(err, stats) {
        console.log('eorrror');
        console.log(err);
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
  test('it should run install command', (assert) => {
    assert.end();
  });
  test('it should run initialize after install', (assert) => {
    assert.end();
  });
  test('it should run configure before symlinking', (assert) => {
    assert.end();
  });
  test('it should allow for filenames to be passed in scripts', (assert) => {
    assert.end();
  });
  tape.end();
});

test('it should set read configuration object', (tape) => {
  test('it should should symlink based on global config', (assert) => {
    assert.end();
  });
  test('it should symlink based on filename path override', (assert) => {
    assert.end();
  });
  test('it should symlink based on foldername symlinks field override', (assert) => {
    assert.end();
  });
  tape.end();
});

test('it should run submodules', (tape) => {
  test('it should accept submodules specified by inner folders', (assert) => {
    assert.end();
  });
  test('it should accept submodule by config', (assert) => {
    assert.end();
  });
  tape.end();
});
