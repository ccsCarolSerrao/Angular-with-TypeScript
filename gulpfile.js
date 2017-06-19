var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);



gulp.task('server-dist'/*, ['clean-dist','wiredep','optimize']*/, function(){
    return gulp
        .src(config.html)      
        .pipe(gulp.dest(config.distApp)); 
});

gulp.task('optimize',function(){   
    log('Optimizing TypeScrip files');
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


gulp.task('server-dev', ['wiredep'], function(){
    var nodeOptions ={
            script: config.app + 'app.js',
            delayTime: 1,
            env: {
                'PORT': 7203,
                'NODE_ENV': 'dev'
            }
        };
});

gulp.task('wiredep'/*,['tscompiler']*/, function(cb){
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.src)); 
});


gulp.task('tscompiler', function (cb) {
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


gulp.task('clean-dist', function(){
    log('Cleanning js files ' + config.dist);
    del(config.dist);
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