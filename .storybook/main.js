const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          test: /\.stories\.tsx?$/,
          include: [path.resolve(__dirname, '../src')] // You can specify directories
        },
        loaderOptions: {
          parser: 'typescript'
        }
      }
    },
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register'
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader')
        }
      ]
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  }
};
