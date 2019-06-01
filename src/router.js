import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import cloneDeep from 'lodash/cloneDeep';
import { getNavData } from './common/nav';
import { getPlainNode } from './utils/util';

import styles from './global.less';


function getRouteData(navData, path) {
  if (
    !navData.some(item => item.layout === path) ||
    !navData.filter(item => item.layout === path)[0].children
  ) {
    return null;
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0]);
  const nodeList = getPlainNode(route.children);
  return nodeList;
}

function getLayout(navData, path) {
  if (
    !navData.some(item => item.layout === path) ||
    !navData.filter(item => item.layout === path)[0].children
  ) {
    return null;
  }
  const route = navData.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

function RouterConfig({ history, app }) {
  const navData = getNavData(app);
  const BasicLayout = getLayout(navData, 'BasicLayout').component;
  const SingalLayout = getLayout(navData, 'SingalLayout').component;

  const passProps = {
    app,
    navData,
    getRouteData: path => {
      return getRouteData(navData, path);
    },
  };

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/view" render={props => <BasicLayout {...props} {...passProps} />} />

          <Route path="/" render={props => <SingalLayout {...props} {...passProps} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
