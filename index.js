var gutil = require('gulp-util');
var through = require('through2');
var semver = require('semver');

var setDefaultOptions = function(opts) {
  opts = opts || {};
  opts.key = opts.key || 'version';
  opts.indent = opts.indent || 2;
  // default type bump is patch
  if (!opts.type || !semver.inc('0.0.1', opts.type)) {
    opts.type = 'patch';
  }
  // if passed specific version - validate it
  if (opts.version && !semver.valid(opts.version, opts.type)) {
    gutil.log('invalid version used as option', gutil.colors.red(opts.version));
    opts.version = null;
  }
  return opts;
};

module.exports = function(opts) {
  // set task options
  opts = setDefaultOptions(opts);
  var key = opts.key;
  var version = opts.version;
  var indent = opts.indent;
  var type = opts.type;

  var json;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-bump', 'Streaming not supported'));
      return cb();
    }
    
    try {
      json = JSON.parse(file.contents.toString());
    } catch (e) {
      this.emit('error', new gutil.PluginError('gulp-bump', 'Problem parsing JSON file ' + file.path));
      return cb();
    }

    // just set a version to the key
    if (version) {
      if (!json[key]) {
        // log to user that key didn't exist before
        gutil.log('Creating key', gutil.colors.red(key), 'with version:', gutil.colors.cyan(version));
      }
      json[key] = version;
    }
    else if (semver.valid(json[key])) {
    // increment the key with type
      json[key] = semver.inc(json[key], type);
    }
    else {
      this.emit('error', new gutil.PluginError('gulp-bump', 'Detected invalid semver ' + key + ' in file ' + file.path));
      return cb();
    }

    file.contents = new Buffer(JSON.stringify(json, null, indent) + '\n');
    
    gutil.log('Bumped ' + gutil.colors.magenta(key) + ' to: ' + gutil.colors.cyan(json[key]));
    this.push(file);
    return cb();
  });
};
