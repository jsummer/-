var gulp = require('gulp')
//var sass = require('gulp-sass')
var webpack = require('webpack')
var config = require('./webpack.config.js')
var gutil = require('gulp-util')

var webpackHotMiddleware = require('webpack-hot-middleware')
var webpackDevMiddleware = require('webpack-dev-middleware')
var devConfig = require('./webpack.dev.config.js')
var express = require('express')
var app = express()
var mockMiddleware = require('./mock-middleware.js')

/*gulp.task('sass',function(){
	return gulp.src('src/css/*.scss')
	.pipe(sass({
		outputStyle:'compressed' //此配置使文件编译并输出压缩过的文件
	}))
	.pipe(gulp.dest('dist/static'))
})

gulp.task('js',function(){
	return gulp.src('src/js/*.js')
	.pipe(gulp.dest('dist/static'))
})

gulp.task('tpl',function(){
	return gulp.src('src/tpl/*.html')
	.pipe(gulp.dest('dist/static'))
})*/



//gulp.task('build',['sass','js','tpl'])

gulp.task('webpack',function(cb){
	return webpack(config,function(err,stats){
		if(err){
			throw new gutil.PluginError('webpack',err)
		}

		gutil.log('[webpack]',stats.toString({
			colors:true,
			chunks:false
		}))

		cb()
	})
});

gulp.task('server:init',function(){
	//测试路由
	/*app.use('/',function(req,res){
		res.send('Hello study4');
	})*/
	app.use('/api/:method',mockMiddleware)
	
	for(var key in devConfig.entry){
		var entry = devConfig.entry[key]
		entry.unshift('./client.js')
	}

	devConfig.plugins.unshift(
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	)

	var compiler = webpack(devConfig)

	var devMiddleware = webpackDevMiddleware(compiler,{
		stats:{
			colors:true,
			chunks:false
		}
	})

	var hotMiddleware = webpackHotMiddleware(compiler)

	compiler.plugin('compilation',function(compilation){
		compilation.plugin('html-webpack-plugin-after-emit',function(data,cb){
			//需要在这里通知浏览器刷新页面
			hotMiddleware.publish({action:'reload'})
			cb()
		})
	})

	app.use(devMiddleware)
	app.use(hotMiddleware)
})

gulp.task('server',['server:init'],function(){

	app.listen(8080,function(err){
		if(err){
			console.log(err);
			return
		}
	})
	console.log('Listening at http://localhost:8080');
})
gulp.task('build',['webpack']);