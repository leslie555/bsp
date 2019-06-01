import { message } from 'antd';
import { queryHotkeys, updateHotkey } from '../services/keycodeservice';

export default {
  namespace: 'keycodemanage',
  state: {
    recordInfo: {},
    keycodelist: [],
  },
  reducers: {
    updateTableList(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    * query({ payload }, { call, put }) {
      const data = yield call(queryHotkeys);
      if (data && data.result) {
        yield put({
          type: 'updateTableList',
          payload: {
            keycodelist: data.hotkeys,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    * update({ payload }, { call, put }) {
      const data = yield call(updateHotkey, payload);
      return data;
    },
  },
  subscriptions: {},
};
