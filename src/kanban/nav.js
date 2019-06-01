import dynamicWrapper from '../utils/navDynamicWrapper';
// nav data
export default app => [
  {
    component: dynamicWrapper(app, ['user', 'global', 'embedPage', 'chart'], () =>
      import('./layouts/BasicLayout')
    ),
    name: '首页',
    path: 'kanban',
    children: [
      {
        name: '首页',
        icon: 'home',
        path: 'home',
        component: dynamicWrapper(app, ['user', 'chart', 'setting'], () =>
          import('./routes/Dashboard/Analysis')
        ),
      },
      {
        name: '指挥调度',
        icon: 'right-square-o',
        path: 'embedPage',
        component: dynamicWrapper(app, ['user', 'embedPage', 'chart'], () =>
          import('./routes/EmbedPages')
        ),
      },
    ],
  },
  {
    name: 'demo3',
    icon: 'right-circle-o',
    path: 'demo3',
    component: dynamicWrapper(app, [], () => import('./routes/Demo')),
  },
];
