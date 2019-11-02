// var path = require('path');

module.exports = config => {
  config.target = 'electron-renderer';
  // config.resolve =  {
  //   alias: {
  //     '@lib': path.resolve(__dirname, 'src/Lib/'),
  //     '@vendor': path.resolve(__dirname, 'src/Vendor/'),
  //     '@containers': path.resolve(__dirname, 'src/Containers/'),
  //     '@components': path.resolve(__dirname, 'src/Components/')
  //   }
  // }
  return config;
}

