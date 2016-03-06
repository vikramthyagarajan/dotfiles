var test = require('tape');
var module = require('../lib/module.js');
var fs = require('fs');
var _ = require('lodash');

test('it should test module defaults', (tape) => {
  test('it should run install.sh by default', (assert) => {
  });
  test('it should symlink config files by default', (assert) => {
  });
  tape.end();
});

test('it should call scripts at correct time in lifecycle', (tape) => {
  test('it should run install command', (assert) => {
  });
  test('it should run initialize after install', (assert) => {
  });
  test('it should run configure before symlinking', (assert) => {
  });
  test('it should allow for filenames to be passed in scripts', (assert) => {
  });
  tape.end();
});

test('it should set read configuration object', (tape) => {
  test('it should should symlink based on global config', (assert) => {
  });
  test('it should symlink based on filename path override', (assert) => {
  });
  test('it should symlink based on foldername symlinks field override', (assert) => {
  });
  tape.end();
});

test('it should run submodules', (tape) => {
  test('it should accept submodules specified by inner folders', (assert) => {
  });
  test('it should accept submodule by config', (assert) => {
  });
  tape.end();
});
