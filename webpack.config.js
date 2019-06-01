import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import MergeLessPlugin from './scripts/mergeLessPlugin';

const path = require('path');

export default (webpackConfig) => {
  // 将所有 less 合并为一个供 themePlugin使用
  const outFile = path.join(__dirname, `.${path.sep}.temp${path.sep}ant-design-pro.less`);
  const stylesDir = path.join(__dirname, `.${path.sep}src${path.sep}`);

  const mergeLessPlugin = new MergeLessPlugin({
    stylesDir,
    outFile,
  });

  const options = {
    antDir: path.join(__dirname, './node_modules/antd'),
    stylesDir,
    varFile: path.join(__dirname, './src/themes/light/light.style.less'),
    mainLessFile: outFile,
    themeVariables: [
      '@tabs-card-head-background',
      '@primary-color',
      '@text-white',
      '@text-color',
      '@text-color-secondary',
      '@commonLightColor',
      '@alertdarkfontColor',
      '@border-radius-base',
      '@border-color-base',
      '@border-color-split',
      '@body-background',
      '@background-color-light',
      '@component-background',
      '@layout-body-background',
      '@table-header-bg',
      '@tabs-card-active-color',
    ],
    indexFileName: 'index.html',
    // publicPath: '/HiatmpPro',
    generateOnce: false,
    lessUrl: './less.min.js',
  };
  const themePlugin = new AntDesignThemePlugin(options);

  // in config object
  webpackConfig.plugins.push(mergeLessPlugin);
  webpackConfig.plugins.push(themePlugin);

  return webpackConfig;
};
