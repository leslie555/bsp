/**
 * 管控平台前端框架配置文件
 * 代码下载后，修改下面的sys变量完成子系统配置；测试时可修改proxy里的代理地址
 * ！！！！！！其他配置请勿改动！！！！！！
 */
import { resolve } from 'path';
const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

/**子系统标识，与src里的子系统文件夹名称保持一致*/
const sys = 'bsp';

const themeVariables1 = lessToJs(
  fs.readFileSync(path.join(__dirname, './src/themes/dark/dark.style.less'), 'utf8')
);
const themeVariables2 = lessToJs(
  fs.readFileSync(path.join(__dirname, './src/themes/light/light.style.less'), 'utf8')
);
export default {
  entry: {
    main: './src/index.js',
  },
  define: {
    __modulename: sys,
    themeVariables1: themeVariables1,
    themeVariables2: themeVariables2,
  },

  /**开发模式下的路由配置*/
  proxy: {
    '/HiatmpPro': {
      target:
      'http://4.zhuamm.com:8082',
      // 'http://192.168.2.200:8082',
      // 'http://20.2.11.41:8082',
      changeOrigin: true,
      pathRewrite: {
        // '^/HiatmpPro/': '/eolinker_os/Mock/mock?projectID=3&uri=',
      },
    }
  },
  publicPath: '/HiatmpPro/',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  alias: {
    themes: resolve(__dirname, './src/themes'),
    components: resolve(__dirname, './src/components'),
    utils: resolve(__dirname, './src/utils'),
    config: resolve(__dirname, './src/config'),
    assets: resolve(__dirname, './src/assets'),

    services: resolve(__dirname, './src/services'),
    models: resolve(__dirname, './src/models'),
    routes: resolve(__dirname, './src/routes'),
    currentModule: resolve(__dirname, `./src/${sys}`),
  },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      theme: {
        '@icon-url': "'/HiatmpPro/iconfont/iconfont'",
      },
    },
    production: {
      theme: {
        '@icon-url': "'/HiatmpPro/iconfont/iconfont'",
      },
    },
  },
  ignoreMomentLocale: true,
  html: {
    template: './src/index.ejs',
  },
  publicPath: '/HiatmpPro/',
  hash: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant-design-pro.less')
      ) {
        return localName;
      }
      const antdProPath = context.resourcePath.match(/src(.*)/)[1].replace('.less', '');
      const arr = antdProPath
        .split(`${path.sep}`)
        .map(a => a.replace(/([A-Z])/g, '-$1'))
        .map(a => a.toLowerCase());
      return `himap${arr.join('-')}-${localName}`.replace(/--/g, '-');
    },
  },
};
