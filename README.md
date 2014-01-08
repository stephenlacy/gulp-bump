#gulp-bump
[![Build Status](https://travis-ci.org/stevelacy/gulp-bump.png?branch=master)](https://travis-ci.org/stevelacy/gulp-bump)
[![NPM version](https://badge.fury.io/js/gulp-bump.png)](http://badge.fury.io/js/gulp-bump)

## Information

<table>
<tr> 
<td>Package</td><td>gulp-bump</td>
</tr>
<tr>
<td>Description</td>
<td>Bump npm versions with Gulp (gulpjs.com)</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
<tr>
<td>Gulp Version</td>
<td>3.x</td>
</tr>
</table>

## Usage
#### Install
    npm install gulp-bump --save

## Example

```javascript
var gulp = require('gulp');
var bump = require('gulp-bump');

// Basic usage:
// Will patch the version
gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});


// Defined method of updating:
// Semantic
gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});


// Run the gulp tasks
gulp.task('default', function(){
  gulp.run('bump');
});

```
####You can view more examples in the [example folder.](https://github.com/stevelacy/gulp-bump/tree/master/examples)


## Options
### options.type
What type of version to bump to. 

    Type: `String`
    Default: `patch`
    

###Versioning Used: [Semantic](http://semver.org/)
### String, lowercase

  - MAJOR ("major") version when you make incompatible API changes
  - MINOR ("minor") version when you add functionality in a backwards-compatible manner
  - PATCH ("patch") version when you make backwards-compatible bug fixes.

### Version example

    major: 1.0.0
    minor: 0.1.0
    patch: 0.0.2



## LICENSE

(MIT License)

Copyright (c) 2014 Steve Lacy <me@slacy.me> slacy.me

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
