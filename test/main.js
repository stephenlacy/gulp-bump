var fs = require('fs');
var gulp = require('gulp');
var es = require('event-stream');
var should = require('should');
var bump = require('../');


require('mocha');

describe('gulp-bump', function() {
  it('should bump minor', function(done) {
    gulp.task('bump', function(){
      gulp.src('test/package.json')
      .pipe(bump())
      .pipe(es.map(function(file){
        String(file.contents.toString()).should.equal(fs.readFileSync('test/expected/default.json').toString());
        done();
      }));
    });
    gulp.run('bump');
  });

  it('should bump major if options.bump = major', function(done) {
    gulp.task('bump', function(){
      var options = {
        bump: 'major'
      };
      gulp.src('test/package.json')
      .pipe(bump(options))
      .pipe(es.map(function(file){
        String(file.contents.toString()).should.equal(fs.readFileSync('test/expected/major.json').toString());
        done();
      }));
    });
    gulp.run('bump');
  });

  it('should bump minor if options.bump = minor', function(done) {
    gulp.task('bump', function(){
      var options = {
        bump: 'minor'
      };
      gulp.src('test/package.json')
      .pipe(bump(options))
      .pipe(es.map(function(file){
        String(file.contents.toString()).should.equal(fs.readFileSync('test/expected/minor.json').toString());
        done();
      }));
    });
    gulp.run('bump');
  });
  it('should ignore and pass "patch" if options.bump is not Semantic', function(done) {
    gulp.task('bump', function(){
      var options = {
        bump: 'invalid'
      };
      gulp.src('test/package.json')
      .pipe(bump(options))
      .pipe(es.map(function(file){
        String(file.contents.toString()).should.equal(fs.readFileSync('test/expected/default.json').toString());
        done();
      }));
    });
    gulp.run('bump');
  });




});
