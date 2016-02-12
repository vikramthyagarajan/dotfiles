var test = require('tape');
var util = require('../lib/util.js');
var fs = require('fs');

test('it should test runCommands', (tape) => {
  test('it should create temp file', (assert) => {
    util.runCommands('touch /tmp/dotfiles',
      function(err) {
        if (err) {
          tape.fail(err);
        }
        fs.stat('/tmp/dotfiles', function(err, stat) {
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

// test('it should test runCommands', (tape) => {
  // var test = tape.test;
  // test('it should create temp folder', (assert) => {
  // });

  // test('it should fail on incorrect commands', (assert) => {
  // });
  // tape.end();
// });
