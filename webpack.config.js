var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtraTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry:{
		Index:'./src/js/index.js'
	},
	output:{
		path:path.resolve(__dirname,'./dist/static'),
		publicPath:'static/',
		filename:'[name].[chunkhash].js'
	},
	resolve:{
		extensions:['','.js','.scss','.html']
	},
	module:{
		loaders:[
			{
				test:/\.css$/,
				loader:ExtraTextPlugin.extract('style',['css'])
			},
			{
				test:/\.scss$/,
				loader:ExtraTextPlugin.extract('style',['css','sass'])
			}
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			chunks:['Index'],
			filename:'../index.html',  //留意这里，这里的路径是相对path配置的
			template:'./src/tpl/index.html',
			inject:true
		}),
		new ExtraTextPlugin('[name].[chunkhash].css')
	]
}