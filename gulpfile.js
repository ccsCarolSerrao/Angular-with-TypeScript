var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');
var runSequence =  require('run-sequence');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('build', function(cb){    
    runSequence('clean-dist','tscompiler','wiredep','optimize','get-html', 'webserver', cb);
});

gulp.task('webserver', function() {
    gulp.src(config.dist)
        .pipe($.webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: 'index.html',
            host: 'localhost',
            port: '8084',
            path: '/'
    }));
});

gulp.task('get-html', function(){
    return gulp
        .src(config.html)      
        .pipe(gulp.dest(config.distApp)); 
});

gulp.task('optimize',function(){   
    log('Optimizing files');
    return gulp
        .src(config.index)        
        .pipe($.useref({
            transformPath: function(filePath) {
                return filePath.replace('../','')
            },
            searchPath: './'
        }))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))        
        .pipe(gulp.dest(config.dist));
});

gulp.task('wiredep', function (){ 
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.src)); 
});

gulp.task('tscompiler', function () {
    log('Compalling TypeScrip files');
    return gulp
        .src(config.alljs)
        .pipe($.typescriptCompiler({
            //module: 'commonjs',
            target: 'es5',
            sourcemap: false,
            logErrors: true
        }))
        .pipe(gulp.dest(config.app));
});

gulp.task('clean-dist', function (cb){
    log('Cleanning js files ' + config.dist);
    
    var fs = require('fs');
    fs.access(config.dist, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        err ? log('no files!') : del(config.dist);
        cb();
    });
});

////////////////////////
function log (msg){
    if(typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }    
}