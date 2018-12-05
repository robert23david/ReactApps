const webpack = require('webpack');
const path = require('path');

const DashboardPlugin = require('webpack-dashboard/plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const isBuilding = process.env.BUILDING === 'true';

const nodeEnv = process.env.NODE_ENV || 'local';
const isProduction = nodeEnv === 'production';
const isDevelopment = nodeEnv === 'development';
const isStaging = nodeEnv === 'staging';

const jsSourcePath = path.join(__dirname, './src');
const indexBuildPath = path.join(__dirname, '../runtime/webpack');
const sourcePath = path.join(__dirname, './src');

// let jsBuildPath = path.join(__dirname, './');
let jsBuildPath =__dirname;
let fileName = 'myApp.js';
if (isBuilding) {
    jsBuildPath =__dirname;
    fileName = 'myApp.js';
}

console.log('build file', jsBuildPath, fileName);

// Common plugins
const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(nodeEnv),
        }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                autoprefixer({
                    browsers: [
                        'last 3 version',
                        'ie >= 10',
                    ],
                }),
            ],
            context: sourcePath,
        },
    }),
];

// Common rules
const rules = [
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
            'babel-loader',
        ],
    }
];

if (isBuilding) {

    if (isProduction) {
        // Production plugins
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                },
                output: {
                    comments: false,
                },
            }),
            new ExtractTextPlugin('style-[hash].css')
        );

        // Production rules
        rules.push(
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!postcss-loader!sass-loader',
                }),
            }
        );
    }

} else {

    // Development plugins
    plugins.push(
        new WriteFilePlugin({ log: false }),
        new webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin()
    );

    if (!isDevelopment) {
        plugins.push(
            new HtmlWebpackPlugin({
                template: path.join(sourcePath, 'index.html'),
                path: indexBuildPath,
                filename: 'index.html',
                inject: 'body',
                minify: {
                    collapseWhitespace: true
                }
            })
        );
    }

    // Development rules
    rules.push(
        {
            test: /\.(scss|css)$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader?sourceMap',
            ],
        }
    );

}

module.exports = {
    devtool: isBuilding ? false : 'source-map',
    context: jsSourcePath,
    entry: {
        js: './index.js',
    },
    output: {
        path: jsBuildPath,
        publicPath: '.',
        filename: fileName
    },
    module: {
        rules,
    },
    resolve: {
        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            jsSourcePath,
        ],
    },
    watchOptions: {
        poll: true
    },
    devServer: {
        contentBase: isBuilding ? './build' : './src',
        historyApiFallback: true,
        port: 3000,
        compress: isBuilding && isProduction,
        inline: !isBuilding,
        hot: !isBuilding,
        host: '0.0.0.0',
        disableHostCheck: true,
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m',
            },
        },
    },
};
