const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

// Helper function to resolve file extensions
const resolveExtension = (modulePath) => {
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];
  for (const extension of extensions) {
    const filePath = modulePath + extension;
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
};

module.exports = {
  entry: './src/index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: function(modulePath) {
          // Exclude all node_modules except specific packages
          if (/node_modules/.test(modulePath)) {
            // Include these packages for babel processing
            const includeModules = [
              'react-native',
              '@react-native',
              '@react-navigation',
              'react-native-web'
            ];

            // But exclude these specific problematic modules
            const excludeSpecificModules = [
              'react-native-safe-area-context/lib/module/specs',
              '@react-native/codegen'
            ];

            // Check if the module should be excluded
            for (const excludeModule of excludeSpecificModules) {
              if (modulePath.includes(excludeModule)) {
                return true;
              }
            }

            // Check if the module should be included
            for (const includeModule of includeModules) {
              if (modulePath.includes(includeModule)) {
                return false;
              }
            }

            // Exclude all other node_modules
            return true;
          }

          // Include all non-node_modules files
          return false;
        },
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, 'babel.config.web.js')
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.web.js', '.js', '.web.tsx', '.tsx', '.web.ts', '.ts', '.web.jsx', '.jsx'],
    alias: {
      'react-native$': 'react-native-web',
      // Add aliases for problematic modules
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/utils/AsyncStorageWeb'),
      'react-native-web/dist/exports/AsyncStorage': path.resolve(__dirname, 'src/utils/AsyncStorageWeb'),
      '@react-navigation/native-stack': '@react-navigation/stack',
      'react-native-safe-area-context': path.resolve(__dirname, 'src/components/SafeAreaProviderWeb'),
      'react-native-safe-area-context/lib/module/specs/NativeSafeAreaProvider': path.resolve(__dirname, 'src/components/SafeAreaProviderWeb'),
      'react-native-safe-area-context/lib/module/specs/NativeSafeAreaView': path.resolve(__dirname, 'src/components/SafeAreaProviderWeb'),
    },
    fallback: {
      // Provide fallbacks for Node.js core modules
      'fs': false,
      'path': require.resolve('path-browserify'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
    }),
    // Add resolver plugin to handle missing extensions
    new webpack.NormalModuleReplacementPlugin(
      /\.\/([^.]+)$/,
      (resource) => {
        if (resource.context.includes('node_modules')) {
          const resolvedPath = resolveExtension(path.resolve(resource.context, resource.request));
          if (resolvedPath) {
            resource.request = resolvedPath;
          }
        }
      }
    ),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3001,
    hot: true,
  },
};
