var map = require('map-stream');
var semver = require('semver');

module.exports = function(opts) {
  if(!opts) opts = {};
  if(!semver.inc('0.0.1', opts.type)) opts.type = false;
  // Map each file to this function
  function modifyContents(file, cb) {
    // Remember that contents is ALWAYS a buffer
    if(file.isNull()) return cb(null, file);
    if(file.isStream()) return cb(new Error('gulp-bump: streams not supported'));

    var json = JSON.parse(file.contents.toString());
    json.version = semver.valid(opts.version) || semver.inc(json.version, opts.type || 'patch');
    file.contents = new Buffer(JSON.stringify(json, null, 2) + '\n');

    cb(null, file);
  }

  // Return a stream
  return map(modifyContents);
};
