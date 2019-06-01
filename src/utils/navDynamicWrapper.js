import React, { createElement } from 'react';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

const routerDataCache = { text: '未用' };

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach((model) => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../${__modulename}/models/${model}`).default);
    }
  });
  if (component.toString().indexOf('.then(') < 0) {
    return (props) => {
      if (!routerDataCache) {
        // routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        // routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

export default dynamicWrapper;
