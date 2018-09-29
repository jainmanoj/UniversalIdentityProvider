// const path = require('path');

// module.exports = {
//   // the entry file for the bundle
//   entry: path.join(__dirname, '/client-views/src/app.jsx'),

//   // the bundle file we will get in the result
//   output: {
//     path: path.join(__dirname, '/client-views/dist/js'),
//     filename: 'app.js',
//   },

//   module: {

//     // apply loaders to files that meet given conditions

//     // npm install --save-dev babel-plugin-transform-es2015-destructuring
//     // npm install --save-dev babel-plugin-transform-object-rest-spread
//     rules: [{
//       test: /\.jsx?$/,
//       include: path.join(__dirname, '/client-views/src'),
//       loader: 'babel-loader',
//       query: {
//         presets: ["react", "es2015"],
//         plugins: ["transform-es2015-destructuring", "transform-object-rest-spread"]
//       }
//     }],
//   },

//   // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
//   watch: true
// };
// config/webpack/loaders/react.js
module.exports = {
  test: /\.(js|jsx)?(\.erb)?$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    presets: ['es2015', 'react', 'stage-2']
  }
};

var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

var browserConfig = {
  // entry: path.join(__dirname, '/client-views/src/app.jsx'),
  entry: [
  // Set up an ES6-ish environment
  'babel-polyfill',
  // Add your application's scripts below
  path.join(__dirname, '/client-views/src/app.jsx')
  ],
  watch: true,

  output: {
    path: path.join(__dirname, '/client-views/dist/js'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.jsx', '.json', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        include: path.join(__dirname, '/client-views/src'),
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-2'],
          plugins: [
            'transform-es2015-destructuring',
            'transform-object-rest-spread'
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'true'
    })
  ]
};

var serverConfig = {
  entry: path.join(__dirname, '/client-views/src/app.jsx'),
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, '/client-views/dist/js'),
    filename: 'serverbundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '/client-views/src'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: [
            'transform-es2015-destructuring',
            'transform-object-rest-spread'
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'false'
    })
  ]
};

module.exports = [browserConfig];
