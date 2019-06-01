import dynamic from 'dva/dynamic';


// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component: () => component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'global', 'embedPage', 'chart'], import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '首页',
        icon: 'home',
        path: 'home',
        component: dynamicWrapper(app, ['user', 'chart'], import('../routes/Dashboard/Analysis')),
      },
      {
        name: '指挥调度',
        icon: 'right-square-o',
        path: 'embedPage',
        component: dynamicWrapper(app, ['user', 'embedPage', 'chart'], import('../routes/EmbedPages')),
      },

    ],
  },
];

export const getBasicLayout = app => dynamicWrapper(app, ['user', 'chart'], import('../layouts/BasicLayout'));
