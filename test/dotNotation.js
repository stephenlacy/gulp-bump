'use strict';

var gutil = require('gulp-util');
var should = require('should');
var bump = require('..');

require('mocha');

  describe('gulp-bump: dot notation', function() {
    var dotObject = {
      subversion: {
        version:'1.2.3'
      }
    };

    it('should bump dot notation', function (done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: 'test/fixtures/package.json',
        contents: new Buffer(JSON.stringify(dotObject, null, 2))
      });
      var bumpS = bump({key: 'subversion.version'});

      bumpS.once('data', function(newFile) {
        var json = JSON.parse(String(newFile.contents));
        json.subversion.version.should.equal('1.2.4');
        done();
      });
      bumpS.write(fakeFile);
    });

    it('should bump dot notation with type', function (done) {
      var fakeFile = new gutil.File({
        base: 'test/',
        cwd: 'test/',
        path: 'test/fixtures/package.json',
        contents: new Buffer(JSON.stringify(dotObject, null, 2))
      });
      var bumpS = bump({
        key: 'subversion.version',
        type: 'minor'
      });

      bumpS.once('data', function(newFile) {
        var json = JSON.parse(String(newFile.contents));
        json.subversion.version.should.equal('1.3.0');
        done();
      });
      bumpS.write(fakeFile);
    });

  });
