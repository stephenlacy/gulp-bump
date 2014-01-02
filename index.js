var es = require('event-stream');
var semver = require('semver');

module.exports = function(opts) {
  if(!opts) opts = {};
  if(!semver.inc('0.0.1', opts.bump)) opts.bump = false;
  // Map each file to this function
  function modifyContents(file, cb) {
    // Remember that contents is ALWAYS a buffer
    if(file.isNull()) return cb(null, file);
    if(file.isStream()) return cb(new Error('gulp-bump: streams not supported'));

    var regex = /([\'|\"]?version[\'|\"]?[ ]*:[ ]*[\'|\"]?)([\d||A-a|.|-]*)([\'|\"]?)/i;
    var data = file.contents.toString();

    data = data.replace(regex, function(match, prefix, version, suffix){
       var newVersion = semver.inc(version, opts.setVersion || opts.bump || 'patch');
       return prefix + newVersion + suffix;
    });
    file.contents = new Buffer(data);
    cb(null, file);
  }

  // Return a stream
  return es.map(modifyContents);
};
