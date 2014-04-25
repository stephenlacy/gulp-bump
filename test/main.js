var fs = require('fs');
var gutil = require('gulp-util');
var should = require('should');
var bump = require('../index');

require('mocha');

describe('Test success cases in gulp-bump', function() {
	it('should bump patch version and key=version by default', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1" }')
		});
		var bumpS = bump();
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('0.0.2');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});
	it('should bump minor version', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1" }')
		});
		var bumpS = bump({
			type: 'minor'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('0.1.0');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should bump major version', function(done) {
		var file = "test/fixtures/package.json";
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1" }')
		});
		var bumpS = bump({
			type: 'major'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('1.0.0');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should bump patch version as default and a key=appversion', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "appversion": "0.0.1" }')
		});
		var bumpS = bump({
			key: 'appversion'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).appversion.should.equal('0.0.2');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should ignore invalid type and use type=patch', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1" }')
		});
		var bumpS = bump({
			type: 'invalidType'
		});

		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('0.0.2');
			return done();
		});

		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should set the correct version when supplied', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1" }')
		});
		var bumpS = bump({
			version: '0.0.2'
		});

		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('0.0.2');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should set the correct version when supplied even if key did not exist', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{}')
		});
		var bumpS = bump({
			version: '0.0.2'
		});

		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('0.0.2');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should bump major version', function(done) {
		var file = "test/fixtures/package.json";
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1-0"}')
		});
		var bumpS = bump({
			type: 'prerelease'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('0.0.1-1');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});
});

describe('Test failure cases cases in gulp-bump', function() {
	it('should fail when not detect a valid semver version', function(done) {
		var file = 'some-dir/dummyfile.js';
		var fakeFile = new gutil.File({
			path: file,
			contents: new Buffer('{ "version": "0.A.1" }')
		});
		var bumpS = bump();
		bumpS.on('error', function(e) {
			should.exist(e);
			e.name.should.equal('Error');
			e.message.should.containEql('Detected invalid semver version in file ' + file);
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should fail when not detect a valid semver version and wrong key', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1" }')
		});
		var bumpS = bump({
			key: 'appversion'
		});
		bumpS.on('error', function(e) {
			should.exist(e);
			e.name.should.equal('Error');
			e.message.should.containEql('Detected invalid semver appversion in file');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should fail when supplied with an invalid JSON', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ invalid json oh no!!!}')
		});
		var bumpS = bump();
		bumpS.on('error', function(e) {
			should.exist(e);
			e.name.should.equal('Error');
			e.message.should.containEql('Problem parsing JSON file');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});

	it('should fallback to defaults when supplied with invalid semver version', function(done) {
		var fakeFile = new gutil.File({
			contents: new Buffer('{ "version": "0.0.1" }')
		});
		var bumpS = bump({
			version: '0.A.2'
		});

		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			JSON.parse(newFile.contents.toString()).version.should.equal('0.0.2');
			return done();
		});
		bumpS.write(fakeFile);
		bumpS.end();
	});
});

describe('Test old cases in gulp-bump', function() {
	it('should bump minor by default', function(done) {
		var fakeFile = new gutil.File({
			base: "test/",
			cwd: "test/",
			path: "test/fixtures/package.json",
			contents: fs.readFileSync('test/fixtures/package.json')
		});
		var bumpS = bump();
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/default.json', 'utf8'));
			done();
		});
		bumpS.write(fakeFile);
	});

	it('should bump major if options.bump = major', function(done) {
		var fakeFile = new gutil.File({
			base: "test/",
			cwd: "test/",
			path: "test/fixtures/package.json",
			contents: fs.readFileSync('test/fixtures/package.json')
		});
		var bumpS = bump({
			type: 'major'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/major.json', 'utf8'));
			done();
		});
		bumpS.write(fakeFile);
	});

	it('should bump minor if options.bump = minor', function(done) {
		var fakeFile = new gutil.File({
			base: "test/",
			cwd: "test/",
			path: "test/fixtures/package.json",
			contents: fs.readFileSync('test/fixtures/package.json')
		});
		var bumpS = bump({
			type: 'minor'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/minor.json', 'utf8'));
			done();
		});
		bumpS.write(fakeFile);
	});

	it('should ignore and pass "patch" if options.bump is not Semantic', function(done) {
		var fakeFile = new gutil.File({
			base: "test/",
			cwd: "test/",
			path: "test/fixtures/package.json",
			contents: fs.readFileSync('test/fixtures/package.json')
		});
		var bumpS = bump({
			type: 'invalid'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/default.json', 'utf8'));
			done();
		});
		bumpS.write(fakeFile);
	});

	it('should set version to value specified by options.version', function(done) {
		var fakeFile = new gutil.File({
			base: "test/",
			cwd: "test/",
			path: "test/fixtures/package.json",
			contents: fs.readFileSync('test/fixtures/package.json')
		});
		var bumpS = bump({
			version: '1.0.0'
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/version.json', 'utf8'));
			done();
		});
		bumpS.write(fakeFile);
	});

	it('should set the key to a custom version', function(done) {
		var fakeFile = new gutil.File({
			base: "test/",
			cwd: "test/",
			path: "test/fixtures/key.json",
			contents: fs.readFileSync('test/fixtures/key.json')
		});
		var bumpS = bump({
			key: "appversion"
		});
		bumpS.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/key.json', 'utf8'));
			done();
		});
		bumpS.write(fakeFile);
	});
});
