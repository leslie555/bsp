import dynamicWrapper from '../utils/navDynamicWrapper';
// nav data
export default app => [
  {
    name: 'demo3',
    icon: 'right-circle-o',
    path: 'demo3',
    component: dynamicWrapper(app, ['demo', 'common'], () => import('./routes/Demo')),
  },
  {
    name: 'demo4',
    icon: 'right-circle-o',
    path: 'demo4',
    children: [
      {
        name: 'demo5',
        icon: 'right-circle-o',
        path: 'demo5',
        component: dynamicWrapper(app, ['demo', 'common'], () => import('./routes/Demo')),
      },
      {
        name: 'demo6',
        icon: 'right-circle-o',
        path: 'demo6',
        component: dynamicWrapper(app, ['demo', 'common'], () => import('./routes/Demo')),
      },
    ],
  },
  /* {
    name: '布控管理',
    icon: 'right-circle-o',
    path: 'blackmgr',
    component: dynamicWrapper(app, ['demo', 'common'], () => import('../routes/Demo')),
  },
  {
    name: '稽查报警',
    icon: 'right-circle-o',
    path: 'alert',
    component: dynamicWrapper(app, ['demo', 'common'], () => import('../routes/Demo')),
  }, */
];
