var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:{
		index:['./src/js/index.js']
	},
	output:{
		path:path.resolve(__dirname,'./dist/static'),
		//publicPath: 'static/',
		filename:'[name].js'
	},
	resolve:{
		extensions:['','.js','.scss','.html']
	},
	module:{
		loaders:[
			{
				test:/\.css$/,
				loader:'style!css'
			},
			{
				test:/\.scss$/,
				loader:'style!css!sass'
			}
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			chunks:['index'],
			filename:'./index.html',  //留意这里，这里的路径是相对path配置的
			template:'./src/tpl/index.html',
			inject:true
		})
	]
}
