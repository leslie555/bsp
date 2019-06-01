/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { chesu } from '../services/octAverageSpeed';

export default {
  namespace: 'octAverageSpeed',
  state: {
    list: [],
    excel: false,
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
    // 查询
    *query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(chesu, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            resultlist: data.list,
            excel: data.excel,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
};
