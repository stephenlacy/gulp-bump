var gutil = require('gulp-util');
var map = require('map-stream');
var semver = require('semver');

module.exports = function(opts) {
  if(!opts) opts = {};
  if(!semver.inc('0.0.1', opts.type)) opts.type = false;
  if(!opts.indent) opts.indent = 2;
  if(!opts.key) opts.key = 'version';

  function modifyContents(file, cb) {

    if(!opts.type){
      var type = ['major', 'minor', 'patch'].filter(function(type){
        return gutil.env[type];
      });

      if(type.length){
        opts.type = type[0];
      }
    }

    if(file.isNull()) return cb(null, file);
    if(file.isStream()) return cb(new Error('gulp-bump: streams not supported'));

    var json = JSON.parse(file.contents.toString());
    json[opts.key] = semver.valid(opts[opts.key]) || semver.inc(json[opts.key], opts.type || 'patch');
    file.contents = new Buffer(JSON.stringify(json, null, opts.indent) + '\n');
    gutil.log('Bumped to version: '+gutil.colors.cyan(json[opts.key]));
    cb(null, file);
  }


  return map(modifyContents);
};
