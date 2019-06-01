/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { duanmian } from '../services/octQueryPeak';

export default {
  namespace: 'octQueryPeak',
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
    // 查询设备
    *query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(duanmian, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            excel: data.excel,
            resultlist: data.list,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
};
