var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    spriter = require('gulp-css-spriter'),
    browserSync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    concat = require('gulp-concat'),
    // svgSprite  =  require('gulp-svg-sprite'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    path = require('path');


// html处理
gulp.task('html', function() {
    var htmlDrc = './src/*.html',
        htmlSrc = './src/';
    gulp.src(htmlDrc)
        .pipe(gulp.dest(htmlSrc));
});

//img处理
gulp.task('img', function() {
    var imgDrc = './drc/img/**',
        imgSrc = './src/img';
    gulp.src(imgDrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgSrc));
});

//css处理
gulp.task('less', function() {
    var cssDrc = './drc/less/*.less',
        cssSrc = './drc/css/';
    gulp.src(cssDrc)
        // .pipe(less({
        //     paths: [path.join(__dirname, 'less', 'includes')]
        // }))
        .pipe(less())
        .pipe(gulp.dest(cssSrc));

});
gulp.task('css', function() {
    gulp.src('./drc/css/*.css')
        .pipe(concat('common.css'))
        // .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/css'));
});

//js处理
gulp.task('js', function() {
    var jsDrc = './drc/js/*.js';
    jsSrc = 'src/js';
    gulp.src(jsDrc)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsSrc));
});

//雪碧图处理
gulp.task('spriter', function() {
    var timestamp = +newDate();
    //需要自动合并雪碧图的样式文件
    return gulp.src('./drc/image/**')
        //生成的spriter的位置
        .pipe(spriter({
            'spriteSheet': './drc/image/sprite' + timestamp + '.png',
            //生成样式文件图片引用地址的路径
            //如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': './drc/image/sprite' + timestamp + '.png'
        }))
        .pipe(gulp.dest('./drc/spriter'));
});

//雪碧图转为svg
gulp.task('svg',function() {
    return gulp.src('./drc/image/**')
    .pipe(svgSprite())
    .pipe(gulp.dest('.drc/img'));

});

gulp.task('svgstore', function () {
    return gulp
        .src('./drc/image/**')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            };
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('.drc/img'));
});



// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./src/css', './src/js', './src/img', './src/*.html'], { read: false })
        .pipe(clean());
});

//默认运行程序
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'less', 'img', 'js','css' );
});

// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        files: "./src/**",
        server: {
            baseDir: "src/" //index.html在哪里
        }
    });
});


//配置 HTML 模块化处理  引导时这么写 “@@include('templates/footer.html')”

gulp.task('include', function() {
    gulp.src('./drc/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./src'));

});


//监听任务，运行语句 gulp watch

gulp.task('watch', ['browser-sync'], function() {
    gulp.start('include', 'less', 'html', 'img', 'js', 'css');

    //监听html
    gulp.watch('./drc/*.html', function() {
        gulp.run('include');
        gulp.run('html');
    });

    //监听less
    gulp.watch('./drc/less/*.less', function() {
        gulp.run('less');
        gulp.run('css');
    });

    //监听css
    gulp.watch('./src/css/*.css', function() {
        gulp.run('css');
    });


    //监听js
    gulp.watch('./drc/js/*.js', function() {
        gulp.run('js');
    });

    //监听img
    gulp.watch('./drc/img/**', function() {
        gulp.run('img');
    });

});