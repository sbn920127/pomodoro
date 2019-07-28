const {src, dest, watch, series} = require('gulp');
const gulpSass = require('gulp-sass');
const gulpPostcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpDependents = require('gulp-dependents');
const gulpDebug = require('gulp-debug');
const gulpRename = require('gulp-rename');

const cssSrc  = 'src/scss';
const cssDest = 'docs/css';
const scssOption = {
    outputStyle : 'compact'
};
function defaultTask() {

}
function getFileNameFromPath(file)
{
    return file.split('/').pop();
}

function transformSlashes(string)
{
    return string.replace(/\\/g,"/");
}
function compileScss(file)
{
    let destFileName = transformSlashes(file).replace(cssSrc, '');
    let fileName = getFileNameFromPath(transformSlashes(file));
    return src(file)
        .pipe(gulpDependents())
        .pipe(gulpDebug({title: '編譯... ', showCount:false}))
        .pipe(gulpSass(scssOption).on('error', gulpSass.logError))
        .pipe(gulpPostcss([autoprefixer()]))
        .pipe(gulpRename(function(path){
            path.dirname = transformSlashes(path.dirname).replace(cssSrc, '');
            // return path;
        }))
        .pipe(gulpDebug({title:'輸出... ', showCount:false}))
        .pipe(dest(cssDest))
}
exports.default = defaultTask;

// watch(jsSrc, {ignoreInitial: false}, series(copyJs, minifyJs));
watch(cssSrc + '/**/*.scss', {ignoreInitial: false}).on('all', function(stat, file){
    compileScss(file);
});