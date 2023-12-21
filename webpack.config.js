const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

let config = {
  entry: { main: "./main.js" },
  output: {
    path: path.resolve(__dirname, "bundles"),
    filename: "[name].[contenthash].bundle.js",
    clean: true,
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].bundle.css",
      }),
    ],
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: (url, resourcePath, context) => {
              return path.relative(context, resourcePath);
            },
          },
        },
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
          "sass-loader", //1. Turns sass into css
        ],
      },
    ],
  },
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (config.mode === "development") {
    return merge(config, {
      devtool: "source-map",
      plugins: [
        new HtmlWebpackPlugin({
          template: "src/index.html",
        }),
        new MiniCssExtractPlugin({
          filename: "[name].bundle.css",
        }),
      ],
      devServer: {
        static: path.join(__dirname, "dist"),
        port: 3000,
        open: true,
      },
      output: {
        path: path.resolve(__dirname, "bundles"),
        filename: "[name].bundle.js",
        clean: true,
      },
    });
  }
  return config;
};
