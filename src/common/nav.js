/* eslint no-underscore-dangle: 0 */
/**
 * create by jingzy
 * 2018-07-02
 */
import React, { createElement } from 'react';
import { Spin } from 'antd';
import Loadable from 'react-loadable';
// import getCustomNav from 'currentModule/nav';
// wrapper of dynamic

const routerDataCache = { text: '未用' };

const modelNotExisted = (app, model) =>

  !app._models.some(({ namespace }) => {
    // console.log('model', model);
    // console.log('name', namespace);
    // console.log('app', app);
    // console.log('models', app._models);
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  // console.log('component', component);
  models.forEach((model) => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
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
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
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

/* global __modulename:true */
// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['setting'], () => import('../layouts/SingalLayout')),
    layout: 'SingalLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '视频下载',
        icon: 'right-circle-o',
        path: '/VideoDownload',
        component: dynamicWrapper(app, ['octQueryOriginal', 'common'], () => import('../routes/Oct/VideoDownload')),
      },
      {
        name: '交通原始数据查询',
        icon: 'right-circle-o',
        path: '/QueryOriginal',
        component: dynamicWrapper(app, ['octQueryOriginal', 'common'], () => import('../routes/Oct/QueryOriginal')),
      },
      {
        name: '设备接入详情',
        icon: 'right-circle-o',
        path: '/query',
        component: dynamicWrapper(app, ['query', 'common'], () => import('../routes/Oct/query')),
      },
      {
        name: '采集设备质量报告',
        icon: 'right-circle-o',
        path: '/collectionReport',
        component: dynamicWrapper(app, ['octCollectionReport', 'common'], () => import('../routes/Oct/collectionReport')),
      },
      {
        name: '涉嫌违法数据查询',
        icon: 'right-circle-o',
        path: '/BreakOriginal',
        component: dynamicWrapper(app, ['octBreakOriginal', 'common'], () => import('../routes/Oct/BreakOriginal')),
      },
      {
        name: '交通事件查询',
        icon: 'right-circle-o',
        path: '/TrafficIncident',
        component: dynamicWrapper(app, ['octTrafficIncident', 'common'], () => import('../routes/Oct/TrafficIncident')),
      },
      {
        name: '过车记录查询',
        icon: 'right-circle-o',
        path: '/CarRecord',
        component: dynamicWrapper(app, ['octCarRecord', 'common'], () => import('../routes/Oct/CarRecord')),
      },
      {
        name: '打开Monitor',
        icon: 'right-circle-o',
        path: '/openMonitor',
        component: dynamicWrapper(app, ['octopenMonitor', 'common'], () => import('../routes/Oct/openMonitor')),
      },
      {
        name: '打开Xshell',
        icon: 'right-circle-o',
        path: '/openXshell',
        component: dynamicWrapper(app, ['octopenXshell', 'common'], () => import('../routes/Oct/openXshell')),
      },
      {
        name: '区域详情',
        icon: 'right-circle-o',
        path: '/AreaDetail',
        component: dynamicWrapper(app, ['octAreaDetail', 'common'], () => import('../routes/Oct/AreaDetail')),
      },
      // {
      //   name: '过车流量历史记录',
      //   icon: 'right-circle-o',
      //   path: '/AverageTrafficFlowHistoryRecord',
      //   component: dynamicWrapper(app, ['octAverageTrafficFlowHistoryRecord', 'common'],
      // () => import('../routes/Oct/AverageTrafficFlowHistoryRecord')),
      // },
      {
        name: '车籍分类历史记录',
        icon: 'right-circle-o',
        path: '/ClassificationHistory',
        component: dynamicWrapper(app, ['octClassificationHistory', 'common'], () => import('../routes/Oct/ClassificationHistory')),
      },
      {
        name: '号牌颜色历史记录',
        icon: 'right-circle-o',
        path: '/HistoricalofNumberColor',
        component: dynamicWrapper(app, ['octHistoricalofNumberColor', 'common'], () => import('../routes/Oct/HistoricalofNumberColor')),
      },
      {
        name: '车辆类型历史记录',
        icon: 'right-circle-o',
        path: '/HistorVehicletype',
        component: dynamicWrapper(app, ['octHistorVehicletype', 'common'], () => import('../routes/Oct/HistorVehicletype')),
      },
      {
        name: '检测设备详情',
        icon: 'right-circle-o',
        path: '/ProjectDeviceDetail',
        component: dynamicWrapper(app, ['octProjectDeviceDetail', 'common'], () => import('../routes/Oct/ProjectDeviceDetail')),
      },
      // {
      //   name: '设备状态历史记录',
      //   icon: 'right-circle-o',
      //   path: '/HistorDevicestatus',
      //   component: dynamicWrapper(app, ['octHistorDevicestatus', 'common'],
      // () => import('../routes/Oct/HistorDevicestatus')),
      // },
      {
        name: '版本上传',
        icon: 'right-circle-o',
        path: '/versionUpload',
        component: dynamicWrapper(app, ['octVersionUpload', 'common'], () => import('../routes/Oct/versionUpload')),
      },
      {
        name: '版本状态',
        icon: 'right-circle-o',
        path: '/VersionStatus',
        component: dynamicWrapper(app, ['octVersionStatus', 'common'], () => import('../routes/Oct/VersionStatus')),
      },
      {
        name: '设备校时',
        icon: 'right-circle-o',
        path: '/CheckDeviceTime',
        component: dynamicWrapper(app, ['octCheckDeviceTime', 'common'], () => import('../routes/Oct/CheckDeviceTime')),
      },
      {
        name: '号牌分类',
        icon: 'right-circle-o',
        path: '/NumberType',
        component: dynamicWrapper(app, ['octNumberType', 'common'], () => import('../routes/Oct/NumberType')),
      },
      {
        name: '设备信息管理',
        icon: 'right-circle-o',
        path: '/DeviceInfo',
        component: dynamicWrapper(app, ['octDeviceInfo', 'common'], () => import('../routes/Oct/DeviceInfo')),
      },
      {
        name: '设备分组管理',
        icon: 'right-circle-o',
        path: '/DeviceGroup',
        component: dynamicWrapper(app, ['octDeviceGroup', 'common'], () => import('../routes/Oct/DeviceGroup')),
      },
      {
        name: '设备分组对应统计查询',
        icon: 'right-circle-o',
        path: '/DeviceGroupSta',
        component: dynamicWrapper(app, ['octDeviceGroupSta', 'common'], () => import('../routes/Oct/DeviceGroupSta')),
      },
      {
        name: '设备调整GIS位置',
        icon: 'right-circle-o',
        path: '/GIS',
        component: dynamicWrapper(app, ['octGis', 'common'], () => import('../routes/Oct/Gis')),
      },
      {
        name: 'GIS轨迹回放',
        icon: 'right-circle-o',
        path: '/GISTrackReplay',
        component: dynamicWrapper(app, ['octGisTrackReplay', 'common'], () => import('../routes/Oct/GisTrackReplay')),
      },
      {
        name: '路段管理',
        icon: 'right-circle-o',
        path: '/RoadSection',
        component: dynamicWrapper(app, ['octRoadSection', 'common'], () => import('../routes/Oct/RoadSection')),
      },
      {
        name: '警务区管理',
        icon: 'right-circle-o',
        path: '/PoliceArea',
        component: dynamicWrapper(app, ['octPoliceArea', 'common'], () => import('../routes/Oct/PoliceArea')),
      },
      {
        name: '消息日志',
        icon: 'right-circle-o',
        path: '/MsgLog',
        component: dynamicWrapper(app, ['messagelog', 'common'], () => import('../routes/MessageLog')),
      },
      {
        name: 'IP白名单',
        icon: 'right-circle-o',
        path: '/IPWhite',
        component: dynamicWrapper(app, ['IpWhiteList', 'common'], () => import('../routes/IPWhiteList')),
      },
      {
        name: '数据字典管理',
        icon: 'right-circle-o',
        path: '/Dictionary',
        component: dynamicWrapper(app, ['dictionarymanage', 'common'], () => import('../routes/DictionaryManage')),
      },
      {
        name: '机动车出行量统计查询',
        icon: 'right-circle-o',
        path: '/QueryTravel',
        component: dynamicWrapper(app, ['octQueryTravel', 'common'], () => import('../routes/Oct/QueryTravel')),
      },
      {
        name: '月均车速统计',
        icon: 'right-circle-o',
        path: '/AverageSpeed',
        component: dynamicWrapper(app, ['octAverageSpeed', 'common'], () => import('../routes/Oct/AverageSpeed')),
      },
      {
        name: '早晚高峰断面流量统计',
        icon: 'right-circle-o',
        path: '/QueryPeak',
        component: dynamicWrapper(app, ['octQueryPeak', 'common'], () => import('../routes/Oct/QueryPeak')),
      },
      {
        name: '日均机动车出行量',
        icon: 'right-circle-o',
        path: '/DailyTravel',
        component: dynamicWrapper(app, ['octDailyTravel', 'common'], () => import('../routes/Oct/DailyTravel')),
      },
      // {
      //   name: '采集设备统计查询',
      //   icon: 'right-circle-o',
      //   path: '/QueryEquipment',
      //   component: dynamicWrapper(app, ['octQueryEquipment', 'common'],
      //  () => import('../routes/Oct/QueryEquipment')),
      // },
      {
        name: '日均出行频率查询',
        icon: 'right-circle-o',
        path: '/DayFrequency',
        component: dynamicWrapper(app, ['octDayFrequency', 'common'], () => import('../routes/Oct/DayFrequency')),
      },
      {
        name: '高峰期机动车通行效率',
        icon: 'right-circle-o',
        path: '/QueryMainRoad',
        component: dynamicWrapper(app, ['octQueryMainRoad', 'common'], () => import('../routes/Oct/QueryMainRoad')),
      },
      {
        name: '账号管理',
        icon: 'right-circle-o',
        path: '/AccountManage',
        component: dynamicWrapper(app, ['accountmanage', 'common'], () => import('../routes/AccountManage/AccountManage')),
      },
      {
        name: '菜单管理',
        icon: 'right-circle-o',
        path: '/MenuManage',
        component: dynamicWrapper(app, ['MenuManageModel', 'common'], () => import('../routes/MenuManage/MenuManage')),
      },
      {
        name: '角色权限',
        icon: 'right-circle-o',
        path: '/role',
        component: dynamicWrapper(app, ['roleauthorization', 'common'], () => import('../routes/RoleAuthorization')),
      },
      {
        name: '部门管理',
        icon: 'right-circle-o',
        path: '/DepartmentManage',
        component: dynamicWrapper(app, ['departmentmanage', 'common'], () => import('../routes/DepartmentManage')),
      },
      {
        name: '交通流统计',
        icon: 'right-circle-o',
        path: '/TrafficFlow',
        component: dynamicWrapper(app, ['octTrafficFlow', 'common'], () => import('../routes/Oct/TrafficFlow')),
      },
      {
        name: '交通事件统计报表',
        icon: 'right-circle-o',
        path: '/TrafficReport',
        component: dynamicWrapper(app, ['octTrafficReport', 'common'], () => import('../routes/Oct/TrafficReport')),
      },
      {
        name: '违法事件统计报表',
        icon: 'right-circle-o',
        path: '/IllegalReport',
        component: dynamicWrapper(app, ['octIllegalReport', 'common'], () => import('../routes/Oct/IllegalReport')),
      },
      {
        name: '号牌识别率统计报表',
        icon: 'right-circle-o',
        path: '/NumReport',
        component: dynamicWrapper(app, ['octNumReport', 'common'], () => import('../routes/Oct/NumReport')),
      },
      {
        name: '黑名单管理',
        icon: 'right-circle-o',
        path: '/BlackList',
        component: dynamicWrapper(app, ['octBlackList', 'common'], () => import('../routes/Oct/BlackList')),
      },
      {
        name: '白名单管理',
        icon: 'right-circle-o',
        path: '/WhiteList',
        component: dynamicWrapper(app, ['octWhiteList', 'common'], () => import('../routes/Oct/WhiteList')),
      },
      {
        name: '套牌车管理',
        icon: 'right-circle-o',
        path: '/FakePlate',
        component: dynamicWrapper(app, ['octFakePlate', 'common'], () => import('../routes/Oct/FakePlate')),
      },
      {
        name: 'GIS测试',
        icon: 'right-circle-o',
        path: '/gistest',
        component: dynamicWrapper(app, ['departmentmanage', 'common'], () => import('../routes/policeDeploy/BaseInfo')),
      },
      {
        name: '数据监控',
        icon: 'right-circle-o',
        path: '/DataMonitor',
        component: dynamicWrapper(app, ['octDataMonitor', 'common'], () => import('../routes/Oct/DataMonitor')),
      },
      {
        name: '流量变化趋势',
        icon: 'right-circle-o',
        path: '/StaFlow',
        component: dynamicWrapper(app, ['octStaFlow', 'common'], () => import('../routes/Oct/OctStaFlow')),
      },
      {
        name: '车籍分类趋势',
        icon: 'right-circle-o',
        path: '/StaOrigin',
        component: dynamicWrapper(app, ['octStaOrigin', 'common'], () => import('../routes/Oct/OctStaOrigin')),
      },
      {
        name: '外场设备监控',
        icon: 'right-circle-o',
        path: '/DeviceMonitor',
        component: dynamicWrapper(app, ['octDeviceMonitor', 'common'], () => import('../routes/Oct/DeviceMonitor')),
      },
      {
        name: '接口服务管理',
        icon: 'right-circle-o',
        path: '/InterfaceServer',
        component: dynamicWrapper(app, ['octInterfaceServer', 'common'], () => import('../routes/Oct/InterfaceServer')),
      },
      {
        name: '设备事件屏蔽',
        icon: 'right-circle-o',
        path: '/DeviceEventShield',
        component: dynamicWrapper(app, ['octDeviceEventShield', 'common'], () => import('../routes/Oct/DeviceEventShield')),
      },
      {
        name: '设备功能配置',
        icon: 'right-circle-o',
        path: '/DeviceFunctionConfig',
        component: dynamicWrapper(app, ['octDeviceFunctionConfig', 'common'], () => import('../routes/Oct/DeviceFunctionConfig')),
      },
      // {
      //   // 暂时不展示
      //   name: '传输日志',
      //   icon: 'right-circle-o',
      //   path: '/TransferLog',
      //   component: dynamicWrapper(app, ['transferlog', 'common'],
      // () => import('../routes/LogManage/TransferLog')),
      // },
      {
        // 设备相关信息日志，从接口来
        name: '设备日志',
        icon: 'right-circle-o',
        path: '/DeviceLog',
        component: dynamicWrapper(app, ['devicelog', 'common'], () => import('../routes/LogManage/DeviceLog')),
      },
      // {
      //   name: '报警日志',
      //   icon: 'right-circle-o',
      //   path: '/AlarmQuery',
      //   component: dynamicWrapper(app, ['alarmquery', 'common'],
      // () => import('../routes/AlarmQuery')),
      // },
      // {
      //   // 暂时不要
      //   name: '主机日志',
      //   icon: 'right-circle-o',
      //   path: '/HostLogQuery',
      //   component: dynamicWrapper(app, ['hostlogquery', 'common'],
      // () => import('../routes/HostLogQuery')),
      // },
      {
        // 本系统操作日志
        name: '操作日志',
        icon: 'right-circle-o',
        path: '/LogQuery',
        component: dynamicWrapper(app, ['logquery', 'common'], () => import('../routes/LogQuery')),
      },
      {
        // 仅仅是接口程序状态日志
        name: '接口程序日志',
        icon: 'right-circle-o',
        path: '/InterfaceLogQuery',
        component: dynamicWrapper(app, ['logquery', 'common'], () => import('../routes/LogQuery')),
      },

      /* {
        name: __modulename,
        icon: 'right-circle-o',
        path: __modulename,
        children: getCustomNav(app),
      }, */
      {
        name: '异常',
        path: 'exception',
        icon: 'right-circle-o',
        children: [
          {
            name: '403',
            path: '403',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
          },
          {
            name: '404',
            path: '404',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '500',
            path: '500',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, ['setting'], () => import('../layouts/IndexPage')),
    layout: 'BasicLayout', // 标记，生成路由时会用到
    path: '/view',
    children: [
    ],
  },
];
