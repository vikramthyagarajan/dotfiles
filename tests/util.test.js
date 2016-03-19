var test = require('tape');
var util = require('../lib/util.js');
var fs = require('fs');
var _ = require('lodash');

test('it should test runCommands', (tape) => {
  test('it should create temp file', (assert) => {
    util.runCommands('touch /tmp/test',
      function(err) {
        if (err) {
          tape.fail(err);
        }
        fs.stat('/tmp/test', function(err, stat) {
          if (err) {
            tape.fail(err);
          }
          else if(stat.isFile()) {
            tape.pass();
          }
          else tape.fail('file not created');
          assert.end();
        });
      });
  });
  test('it should log command in console', (assert) => {
    util.runCommands('ls', (err) => {
      if (err) {
        assert.fail(err);
      }
      else assert.pass();
      assert.end();
    })
  });
  test('it should fail on bad command', (assert) => {
    util.runCommands('fake_crap', (err) => {
      if (err) {
        assert.pass('failed with error')
      }
      assert.end();
    });
  });
  test('it should end it all', (assert) => {
    assert.pass('done all');
    assert.end();
  });
  tape.end();
});

test('it should test runFile', (tape) => {
  test('it should run local file', (assert) => {
    util.runFile('tests/test.sh', function(err) {
      if (err) {
        assert.fail(err);
      }
      else assert.pass('file run successfully');
      assert.end();
    })
  });
  test('it should take not take incorrect path', (assert) => {
    util.runFile('tests/fake/test.sh', function(err) {
      if (err) {
        assert.pass('file failed for incorrect path');
      }
      assert.end();
    })
  });
  test('it should remove opening slash', (assert) => {
    util.runFile('/tests/test.sh', function(err) {
      if (err) {
        assert.fail(err);
      }
      assert.end();
    })
  });
  test('it should not accept a directory', (assert) => {
    util.runFile('tests/', function(err) {
      if (err) {
        assert.pass('does not accept a directory');
      }
      assert.end();
    });
  });
  test('it should not run a file outside directory', (assert) => {
    util.runFile('/etc/vim/vimrc', function(err) {
      if (err) {
        assert.pass(err);
      }
      assert.end();
    });
  });
  tape.end();
});

test('it should test readFolder', (tape) => {
  var gitFiles = ['branches', 'COMMIT_EDITMSG', 'config', 'description',
'FETCH_HEAD', 'HEAD', 'hooks', 'index', 'info', 'logs', 'objects', 'refs'];
  test('it should read all files within folder', (assert) => {
    util.readFolder('.git', function(err, files) {
      if (err) {
        assert.fail(err);
      }
      assert.equal(gitFiles.length, files.length, 'git folder length matches');
      assert.end();
    });
  });
  test('it should return correct types of file', (assert) => {
    util.readFolder('.git', function(err, files) {
      if (err) {
        assert.fail(err);
      }
      var branchFileObj = _.find(gitFiles, {name: 'branches'});
      var fetchFileObj = _.find(gitFiles, {name: 'FETCH_HEAD'});
      assert.doesNotEqual(branchFileObj, null, 'found branches folder');
      assert.doesNotEqual(fetchFileObj, null, 'found fetch file folder');
      if (branchFileObj && fetchFileObj) {
        assert.equal(branchFileObj.type, 'folder', 'branches folder type matches');
        assert.equal(fetchFileObj.type, 'file', 'fetch file type matches');
      }
      assert.end();
    });
  });
  test('it should not allow viewing of folders by absolue path', (assert) => {
    util.readFolder('/var/www', function(err) {
      assert.ok(err, 'gives error on absolute path files');
      assert.end();
    });
  });
  tape.end();
});

test('it should test symlinkFile', (tape) => {
  test('it should should symlink a file', (assert) => {
    util.symlinkFile('package.json', '/tmp/.tmp', function(err) {
      if (err) {
        assert.fail(err);
      }
      fs.lstat('/tmp/.tmp', function(err, stats) {
        if (err) {
          assert.fail(err);
        }
        assert.ok(stats.isSymbolicLink(), 'creates symbolic link');
        fs.unlinkSync('/tmp/.tmp');
        assert.end();
      });
    });
  });
  test('it should not symlink files given by absolute path', (assert) => {
    util.symlinkFile('/tmp/tmp', '/tmp/.tmp', function(err) {
      assert.ok(err, 'successfully failed on absolute path symlink');
      assert.end();
    });
  });
  tape.end();
});

test('it should test readModuleFile', (tape) => {
  var utilTestFolder = 'tests/util-tests';
  test('it should return empty object for fake path', (assert) => {
    var fakePath = utilTestFolder + '/module-fake.json';
    util.readModuleFile(fakePath, function(err, moduleConfig) {
      if (err) {
        assert.fail(err);
      }
      else {
        assert.deepEqual(moduleConfig, {});
      }
      assert.end();
    });
  });
  test('it should return the json object for correct path', (assert) => {
    var realPath = utilTestFolder + '/module.json';
    util.readModuleFile(realPath, function(err, moduleConfig) {
      if (err) {
        assert.fail(err);
      }
      else {
        assert.deepEqual(moduleConfig, {
          "install": "echo 'first'> /tmp/dotfiles/indexcycle.txt",
          "initialize": "echo 'second'> /tmp/dotfiles/indexcycle.txt",
          "configure": "echo 'third'> /tmp/dotfiles/indexcycle.txt",
        });
      }
      assert.end();
    });
  });
  tape.end();
});
