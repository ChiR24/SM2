module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }]
  ],
  // Ignore specific problematic modules
  ignore: [
    'node_modules/react-native-safe-area-context/lib/module/specs',
    'node_modules/@react-native/codegen'
  ]
};
