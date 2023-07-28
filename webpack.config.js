const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

let config = {
    entry: { main: './main.js' },
    output: {
        path: path.resolve(__dirname, 'bundles'),
        filename: '[name].[contenthash].bundle.js',
        clean: true
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].bundle.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "imgs"
                    }
                }
            },
            // {
            //     test: /\.scss$/,
            //     use: [
            //         // Creates `style` nodes from JS strings
            //         "style-loader", // Inject styles into dOM
            //         // Translates CSS into CommonJS
            //         "css-loader", // Turn css into comomonJs
            //         // Compiles Sass to CSS
            //         "sass-loader", // Turn scss into css
            //     ],
            // },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, //3. Extract css into files
                    "css-loader", //2. Turns css into commonjs
                    "sass-loader" //1. Turns sass into css
                ]
            }
        ],
    },
};

module.exports = (env, argv) => {
    config.mode = argv.mode;
    if (config.mode === 'development') {
        return merge(config, {
            devtool: 'source-map',
            plugins: [
                new HtmlWebpackPlugin({
                    template: 'src/index.html'
                })
            ]
        });
    }
    return config;
};