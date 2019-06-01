import './polyfill';

import dva from 'dva';
// import createHistory from 'history/createBrowserHistory';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import { message } from 'antd';

const ERROR_MSG_DURATION = 3; // 3 秒
window.dvaHistory = createHistory(); // 全局history 对象
// window.document.domain = window.document.location.hostname;   // 此方法导致地图产生跨域问题
// 1. Initialize
const app = dva({
  history: window.dvaHistory,
});

// 2. Plugins
app.use(createLoading());

// app.model(require('./models/indexpage').default);

// 3. Model

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

/** *****全局变量、方法******** */
const HIATMPGOLBAL = {};

/**
 * 弹出工作台tab页
 * @param url 页面地址
 * @param tabname 标签页名称
 * @param key 标签页唯一标识，命名规则：子系统名_模块名_序号，如：scs_alert_001
 */
HIATMPGOLBAL.openWorkbenchTab = function(url, tabname, key) {
  const key1 = `call${key}`;
  if (window.parent === window.parent.parent) {
    window.parent.postMessage(
      { url, menuName: tabname, key: key1, menuId: key1, type: 'open', originalKey: key },
      '*'
    );
  } else if (window.parent.parent === window.parent.parent.parent) {
    window.parent.parent.postMessage(
      { url, menuName: tabname, key: key1, menuId: key1, type: 'open' },
      '*'
    );
  }
};
/**
 * 关闭工作台tab页
 * @param key 标签页唯一标识，命名规则：子系统名_模块名_序号，如：scs_alert_001
 */
HIATMPGOLBAL.closeWorkbenchTab = function(key) {
  if (window.parent === window.parent.parent) {
    window.parent.postMessage({ key: `call${key}`, type: 'close' }, '*');
  } else if (window.parent.parent === window.parent.parent.parent) {
    window.parent.parent.postMessage({ key: `call${key}`, type: 'close' }, '*');
  }
};

window.HIATMPGOLBAL = HIATMPGOLBAL;

export default app._store; // eslint-disable-line
