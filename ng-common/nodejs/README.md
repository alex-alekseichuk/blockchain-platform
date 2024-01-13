Here is the code to be used in nodejs env. only:

- cli/ is for building CLI tools
- server/ is for building server-side instances


It should not be used in the code for browser!

`ioc-webpack-loader.js` should be used in the `webpack.config.js`,
to remove whole `nodejs` section from the result bundle:

```
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: [{loader: path.resolve('./ioc-webpack-loader.js')}],
      }
    ]
  },
```
