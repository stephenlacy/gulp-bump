var gutil = require('gulp-util');
var through = require('through2');
var semver = require('semver');

//test if a type is a valid semver type
var isValidType = function(type) {
	return semver.inc('0.0.1', type);
};

//test if a version is a valid semver version
var isValidVersion = function(version, type) {
	return semver.valid(version);
};

var setDefaultOptions = function(opts) {
	opts = opts || {};
	//set defaults
	opts.key = opts.key || 'version';
	opts.indent = opts.indent || 2;
	//default type bump is patch
	if (!opts.type || !isValidType(opts.type)) {
		opts.type = 'patch';
	}
	//if passed specific version - validate it
	if (opts.version && !isValidVersion(opts.version, opts.type)) {
		gutil.log('invalid version used as option', opts.version);
		opts.version = null;
	}
	return opts;
};

module.exports = function(opts) {
	//set task options
	opts = setDefaultOptions(opts);
	var key = opts.key;
	var version = opts.version;
	var indent = opts.indent;
	var type = opts.type;

	return through.obj(function(file, enc, cb) {
		//pass through empty file
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-bump', 'Streaming not supported'));
			return cb();
		}

		var json;
		try {
			json = JSON.parse(file.contents.toString());
		} catch (e) {
			this.emit('error', new gutil.PluginError('gulp-bump', 'Problem parsing JSON file ' + file.path));
			return cb();
		}

		//just set a version to the key
		if (version) {
			if (!json[key]) {
				//log to user that key didn't exist before
				gutil.log('Creating key', gutil.colors.red(key), 'with version:', version);
			}
			//set version to key
			json[key] = version;
		} else if (semver.valid(json[key])) {
			//increment the key with type
			json[key] = semver.inc(json[key], type);
		} else {
			this.emit('error', new gutil.PluginError('gulp-bump', 'Detected invalid semver ' + key + ' in file ' + file.path));
			return cb();
		}

		//rebuild file contents
		file.contents = new Buffer(JSON.stringify(json, null, indent) + '\n');
		//log new version
		gutil.log('Bumped ' + gutil.colors.underline(key) + ' to: ' + gutil.colors.cyan(json[key]));
		this.push(file);
		return cb();
	});
};
