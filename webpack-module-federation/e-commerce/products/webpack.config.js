const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  devServer: {
    port: 8081,
  }, 
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new ModuleFederationPlugin({
      // name_module
      name: 'products',
      filename: 'remoteEntry.js',
      // modules or files to expose
      exposes: {
        './ProductsIndex': './src/index'
      },
      // Share dependency
      shared: ['faker'],
    })
  ],
};