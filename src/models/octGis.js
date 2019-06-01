/**
 * Created by Administrator on 2018/7/12.
 */

import { queryDevices, updateMonitorPoint, addOrUpdatePoint, policeStruct, weihujianse, queryAllDevices } from '../services/octGIS';

export default {
  namespace: 'octGis',
  state: {
    devicelist: [],
    dold: [],
    policearea: [],
    weihu: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 7,
      total: null,
      onShowSizeChange: (() => {
        setTimeout(() => {
          window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
        }, 1000);
      }),
    },
    allDevice: [],
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
    * filterName ({ payload }, { select, call, put }) {
      const { did } = payload;
      const stateArr = yield select(state => state);
      console.log(stateArr);
    },
    * queryDevices ({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryDevices, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            devicelist: data.list,
            dold: data.list,
          },
        });
      } else {
        // message.error('查询失败，请联系管理员！');
      }
    },
    * updateMonitorPoint ({ payload }, { call, put }) {
      const { queryobj = {} } = payload;
      const obj = { ...queryobj };
      const data = yield call(updateMonitorPoint, obj);
      return data;
    },
    * addOrUpdatePoint ({ payload }, { call, put }) {
      const result = yield call(addOrUpdatePoint, payload);
      return result;
      // const { queryobj = {} } = payload;
      // const obj = { ...queryobj };
      // const data = yield call(addOrUpdatePoint, obj);
      // return data;
    },
    *getWeiHu({ payload }, { call, put }) {
      const data = yield call(weihujianse);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            weihu: data.list,
          },
        });
      }
    },
    *policeStruct({ payload }, { call, put }) {
      const data = yield call(policeStruct);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            policearea: data.list,
          },
        });
      }
    },
    // 拿到所有的设备
    *queryAllDevices({ payload }, { call, put }) {
      const data = yield call(queryAllDevices);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            allDevice: data.list,
          },
        });
      }
    },
  },
};
