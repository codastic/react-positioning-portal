const path = require('path');

module.exports = {
  stories: ['../src/**/*.story.tsx'],
  addons: [
    {
      name: '@storybook/addon-essentials'
    },
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
    }
  ],
  core: {
    builder: 'webpack5'
  }
};
