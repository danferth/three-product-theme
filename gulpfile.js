/*
  if running into depreciation issues during npm install
  $ npm outdated --depth=3
  will show affected packages to upgrade in package.json
*/


var Promise         = require('es6-promise').Promise,
    gulp            = require('gulp'),
    colors          = require('colors'),
    del             = require('del'),
    postcss         = require('gulp-postcss'),
    sass            = require('gulp-sass'),
    sasslint        = require('gulp-sass-lint'),
    autoprefixer    = require('autoprefixer'),
    replace         = require('gulp-replace'),
    rename          = require('gulp-rename'),
    cssnano         = require('cssnano'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    jshint          = require('gulp-jshint'),
    zip             = require('gulp-zip'),
    beep            = require('beepbeep'),
    themekit        = require('@shopify/themekit');
//=======options==============================================================================
var themeName   = "just3guitars",
    css_file    = "theme",
    css_src     = "_styles",
    css_dest    = "assets",
    //js locations
    js_file     = "theme",
    js_src      = "_scripts",
    js_dest     = "assets";

//=======swallow error so doesn't stop watch=================================================

var swallowError = function(error){
  console.log(error.toString());
  this.emit('end');
};

//=======help=================================================================================
function helpTask(cb){
  console.log("****************************************************************************************".bold.white.bgYellow);
  console.log("css                = lint | sass | prefix | rename | replace".cyan);
  console.log("checkjs            = jslint".yellow);
  console.log("js                 = concat | uglify".yellow);
  console.log("----------------------------------------------------------------------------------------".america);
  console.log("watch (default)    = css, checkjs, js".bold.green);
  console.log("build              = css, jsCat & jsUgly".bold.green);
  console.log("package            = all build folders and files in root copied to theme/ and ziped".bold.blue);
  console.log("clean              = deletes theme/**".bold.blue);
  console.log("****************************************************************************************".bold.white.bgYellow);
  cb();
};
exports.help = helpTask;

//=======stylesheet===========================================================================
function cssTask(){
  var processors = [autoprefixer(),cssnano];
  return gulp.src(css_src + '/' +css_file + '.scss')
  .pipe(sasslint())
  .pipe(sasslint.format())
  .pipe(sass({outputStyle: 'compressed'})).on('error', swallowError)
  .pipe(postcss(processors))
  //.pipe(rename(css_file+'.scss.liquid'))
  //.pipe(replace('"{{', '{{'))
  //.pipe(replace('}}"', '}}'))
  .pipe(gulp.dest(css_dest))
  .on('end', function(){ beep(3); });
};
exports.css = cssTask;

//=======javascript===========================================================================
//concat
function jsCatTask(){
  return gulp.src([js_src + '/lib/**/*.js', js_src + '/' + js_file + '.js'])
  .pipe(concat(js_file + '.js'))
  .pipe(gulp.dest(js_dest))
  .on('end', function(){ beep(3); });
};
exports.jsCat = jsCatTask;

//jshint
function checkjsTask (){
  return gulp.src([js_src + '/lib/**/*.js', js_src + '/' + js_file + '.js'])
  .pipe(jshint())
  .on('error', swallowError)
  .pipe(jshint.reporter('jshint-stylish'));
};
exports.checkjs = checkjsTask;

//uglify
function jsUglyTask(){
  return gulp.src(js_dest + '/' + js_file + '.js')
  .pipe(uglify())
  .pipe(rename(js_file + '.min.js'))
  .pipe(gulp.dest(js_dest));
};
exports.jsUgly = jsUglyTask;

//=======BUILD================================================================================
exports.build = gulp.parallel(cssTask,
                  gulp.series(jsCatTask, jsUglyTask));

//=======PACKAGE==============================================================================
function zipTask(){
  return gulp.src(['theme/**/*'],{dot:true})
  .pipe(zip(themeName + '.zip'))
  .pipe(gulp.dest('theme'));
};
exports.zip = zipTask;

function cleanPackageTask(cb){
  del(['theme/**/*', '!theme/' + themeName + '.zip'],{dot:true});
  cb();
};
exports.cleanPackage = cleanPackageTask;

function packageTask(){
  return gulp.src([
    '**/*',
    '!**/.git/**',
    '!**/_styles/**',
    '!**/_scripts/**',
    '!**/node_modules/**',
    '!**/theme/**',
    '!**/.gitignore',
    '!**/.sass-lint.yml',
    '!**/gulpfile.js',
    '!**/package-lock.json',
    '!**/package.json',
    '!**/README.md',
  ],{dot:true})
  .pipe(gulp.dest('theme/'));
};
exports.package = gulp.series(packageTask, zipTask, cleanPackageTask);

//=======CLEAN================================================================================
function cleanTask(cb){
  del(['theme/**', 'theme']);
  cb();
};
exports.clean = cleanTask;

//=======watch================================================================================
function watchTask(){
  gulp.watch(css_src + '/**/*.scss', cssTask);
  gulp.watch(js_src + '/**/*.js', gulp.series(checkjsTask, jsCatTask));
};
exports.watch = watchTask;
//default Task
exports.default = watchTask;
