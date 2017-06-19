module.exports = function() {
    var src ='./src/';
    var app = src + 'app/';
    appAssets = app + 'assets/';
    var dist = './dist/'

    var config={

        /**
         * File paths
         */
        alljs:[
            app + '**/*.ts',
            app + 'common/**/*.ts',
            app + 'products/**/*.ts'
        ],
        src: src,
        app: app,
        appAssets: appAssets,
        js:[
            app + '**/*.js',
            '!' + app + '**/*.map.js',
            '!' + app + '**/*.spec.js'
        ],
        html:[
            app + '**/*.html',
        ],
        index: src + 'index.html',
        
        dist: dist,
        distApp: dist + 'app/',

        /**
         * Bower and NPM locations
         */
        bower:{
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../../'
        }
    };

    config.getWiredepDefaultOptions = function (){
        var options={
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
    };
    return config;
};