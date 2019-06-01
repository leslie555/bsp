/**
 * Created by cherry on 2018/7/20.
 */
import { message, Select } from 'antd';
import { getServerVersion, getVersionDetailed, uploadFile } from '../services/octCollectionReportService';

export default {
  namespace: 'octVersionUpload',
  state: {
    treeData: [],
    departmentlist: [],
    departmentinfo: {},
    versionArr: [],
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
    // 查询接口服务器版本号
    *getServerVersion({ payload }, { call, put }) {
      const data = yield call(getServerVersion, payload);
      const arr = []; // versionArr
      if (data.result) {
        if (data.list) {
          for (let i = 0; i < data.list.length; i += 1) {
            arr.push(data.list[i].version);
          }
          console.log(arr);
          yield put({
            type: 'updateState',
            payload: {
              resultlist: data.list,
              versionArr: arr,
            },
          });
        }
      }
    },
    // 查询接口服务器版本号详情
    *getVersionDetailed({ payload }, { call, put }) {
      const data = yield call(getVersionDetailed, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            Detailedresultlist: data.list,
          },
        });
      }
    },
    // 新增
    *uploadFile({ payload }, { call, put }) {
      const data = yield call(uploadFile, payload);
      if (data.result) {
        console.log(data);
        //   yield put({
        //     type: 'updateState',
        //     payload: {
        //       Detailedresultlist: data.list,
        //     },
        //   });
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
