var test = require('tape');
var exec = require('child_process').exec;
var fs = require('fs');

test('it should test index file', (tape) => {
  var testFolder = "tests/module-tests/lifecycle";
  // test('it should test bootstrap function', (assert) => {
    // exec('node ../index.js bootstrap util-tests', function(err, output) {
      // fs.readFile('/tmp/dotfiles/indexcycle.txt', 'utf8', function(err, fileContents) {
        // if (err) {
          // assert.fail(err);
        // }
        // else if(fileContents) {
          // // removing the first and last \n
          // fileContents = fileContents.replace(/^\n/, "");
          // fileContents = fileContents.replace(/\n$/, "");
          // var words = fileContents.split('\n');
          // assert.equals(words.indexOf("first"), 0);
          // assert.equals(words.indexOf("second"), 1);
          // assert.equals(words.indexOf("third"), 2);
        // }
        // assert.end();
      // });
    // });
  // });
  test('it should test install function', (assert) => {
    exec('node index.js install util-tests tests/', function(err, output) {
      if (err) {
        assert.fail(err);
      }
      fs.readFile('/tmp/dotfiles/indexcycle.txt', 'utf8', function(err, fileContents) {
        if (err) {
          assert.fail(err);
        }
        else if(fileContents) {
          // removing the first and last \n
          fileContents = fileContents.replace(/^\n/, "");
          fileContents = fileContents.replace(/\n$/, "");
          var words = fileContents.split('\n');
          assert.doesNotEqual(words.indexOf("first"), -1);
        }
        assert.end();
      });
    });
  });
  test('it should test configure function', (assert) => {
    exec('node index.js configure util-tests tests/', function(err, output) {
      if (err) {
        assert.fail(err);
      }
      fs.readFile('/tmp/dotfiles/indexcycle.txt', 'utf8', function(err, fileContents) {
        if (err) {
          assert.fail(err);
        }
        else if(fileContents) {
          // removing the first and last \n
          fileContents = fileContents.replace(/^\n/, "");
          fileContents = fileContents.replace(/\n$/, "");
          var words = fileContents.split('\n');
          assert.doesNotEqual(words.indexOf("second"), -1);
        }
        assert.end();
      });
    });
  });
  tape.end();
});
