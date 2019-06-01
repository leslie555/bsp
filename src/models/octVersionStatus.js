/**
 * Created by cherry on 2018/7/20.
 */
import { Select, message } from 'antd';
import { getServerStatus, getVersionDetailed, getServerVersion, GetServiceDevice, GetDeviceForServiceIp } from '../services/octCollectionReportService';

export default {
  namespace: 'octVersionStatus',
  state: {
    treeData: [],
    departmentlist: [],
    departmentinfo: {},
    detailSource: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 10,
      total: null,
      onShowSizeChange: (() => {
        setTimeout(() => {
          window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
        }, 1000);
      }),
    },
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    // 查询接口服务器状态
    *getServerStatus({ payload }, { call, put }) {
      const data = yield call(getServerStatus, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            resultlist: data.list,
          },
        });
      }
    },
    // 查询接口服务器详情By ip
    *GetServiceDevice({ payload }, { call, put }) {
      const data = yield call(GetServiceDevice, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            detailSource: data.list,
            detailCount: data.count,
          },
        });
      }
    },
    // 通过接口ip查询服务器下的设备
    *GetDeviceForServiceIp({ payload }, { call, put }) {
      const data = yield call(GetDeviceForServiceIp, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            detailSource: data.list,
            detailCount: data.count,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/department') {
          dispatch({
            type: 'getAllDeviceList',
          });
        }
      });
    },
  },
};
