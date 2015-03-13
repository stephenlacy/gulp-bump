'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var semver = require('semver');
var Dot = require('dot-object');

module.exports = function(opts) {
  // set task options
  opts = setDefaultOptions(opts);

  var content, json, ver;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-bump', 'Streaming not supported'));
    }

    json = file.contents.toString();
    try {
      content = JSON.parse(json);
    } catch (e) {
      return cb(new gutil.PluginError('gulp-bump', 'Problem parsing JSON file', {fileName: file.path, showStack: true}));
    }

    // just set a version to the key
    if (opts.version) {
      if (!content[opts.key]) {
        // log to user that key didn't exist before
        gutil.log('Creating key', gutil.colors.red(opts.key), 'with version:', gutil.colors.cyan(opts.version));
      }
      content[opts.key] = opts.version;
      ver = content[opts.key];
    }
    else if (semver.valid(content[opts.key])) {
    // increment the key with type
      content[opts.key] = semver.inc(content[opts.key], opts.type, opts.preid);
      ver = content[opts.key];
    }
    else if (opts.key.indexOf('.') > -1) {
      var dot = new Dot();
      var value = dot.pick(opts.key, content);
      ver = semver.inc(value, opts.type);
      dot.str(opts.key, ver, content);
    }
    else {
      return cb(new gutil.PluginError('gulp-bump', 'Detected invalid semver ' + opts.key, {fileName: file.path, showStack: false}));
    }
    file.contents = new Buffer(JSON.stringify(content, null, opts.indent || space(json)) + possibleNewline(json));

    gutil.log('Bumped \'' + gutil.colors.cyan(path.basename(file.path)) + '\' ' + gutil.colors.magenta(opts.key) + ' to: ' + gutil.colors.cyan(ver));
    cb(null, file);
  });
};

function setDefaultOptions(opts) {
  opts = opts || {};
  opts.key = opts.key || 'version';
  opts.indent = opts.indent || void 0;
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
}

// Preserver new line at the end of a file
function possibleNewline(json) {
  var lastChar = (json.slice(-1) === '\n') ? '\n' : '';
  return lastChar;
}

// Figured out which "space" params to be used for JSON.stringfiy.
function space(json) {
  var match = json.match(/^(?:(\t+)|( +))"/m);
  return match ? (match[1] ? '\t' : match[2].length) : '';
}
