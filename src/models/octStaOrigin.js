/**
 * Created by Administrator on 2018/7/12.
 */

import { getStaOrigin } from '../services/octService';

export default {
  namespace: 'octStaOriginModel',
  state: {
    list: '',
  },


  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    * getStaOrigin({ payload }, { call, put }) {
      const data = yield call(getStaOrigin);
      if (data && data.result) {
        yield put({
          type: 'save',
          payload: {
            list: data.list,
          },
        });
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
    },
  },
};
