var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	less = require('gulp-less'),
	minifycss = require ('gulp-minify-css'),
	uglify = require('gulp-uglity'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	spriter = require('gulp-css-spriter'),
	browserSync = require('browser-sync').create();


// html处理
gulp.task('html',function(){
	var htmlDrc = 'drc/*.html',
		htmlSrc = 'src/*.html';
	gulp.src(htmlDrc)
		.pipe(gulp.dest(htmlSrc))
});

//img处理
gulp.task('img',function(){
	var imgDrc = 'drc/img/**',
		imgSrc = 'src/img/**';
	gulp.src(imgDrc)
	.pipe(imagemin())
	.pipe(gulp.desk(imgSrc))
})

//css处理
gulp.task('css',function(){
	var cssDrc = 'drc/css/**',
		cssSrc = 'Src/css/**';
	gulp.src(imgDrc)
		.pipe(minifycss())
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.desk(cssSrc))

})

//js处理
gulp.task('js',function(){
	var jsDrc = 'drc/js/*.js'
		jsSrc = 'Src/js/*.js';
	gulp.src(jsSrc)
		.pipe(uglify())
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.desk(jsSrc))
})

//雪碧图处理
gulp.task('spriter',function(){
	var timestamp=+newDate();
	//需要自动合并雪碧图的样式文件
	returngulp.src('./drc/image/**')
					//生成的spriter的位置
	.pipe(spriter({'spriteSheet':'./drc/image/sprite'+timestamp+'.png',
		//生成样式文件图片引用地址的路径
		//如下将生产：backgound:url(../images/sprite20324232.png)
		'pathToSpriteSheetFromCSS':'./drc/image/sprite'+timestamp+'.png'
	}))
	.pipe(gulp.desk('./src'));
})

gulp.task('clean',function(){
	gulp.src(['./src/css','./src/js','./src/img','./src/html'])
		.pipe(clean());

})

gulp.task('default',['clean'],function(){
	gulp.start('html','js','css','img');


	//监听html
	gulp,watch('./drc/*.html',function(){
		gulp.run('html');
	})

	//监听css
	gulp,watch('./drc/css/**',function(){
		gulp.run('css');
	})

	//监听js
	gulp,watch('./drc/js/*.js',function(){
		gulp.run('js');
	})

	//监听img
	gulp.watch('./drc/img/**',function(){
		gulp.run('img');
	})

})

