import { message } from 'antd';
import { querySysparam, updateSysparam } from '../services/sysparamservice';

export default {
  namespace: 'sysparammanage',
  state: {
    sysparmlist: [],
    recordInfo: {},
    queryobj: {
      sysparamcode: '',
      sysparamname: '',
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showtotal: total => `共 ${total} 条`,
      current: 1,
      pagesize: 10,
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
    * query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const { queryflag } = payload;
      const obj = { ...queryobj, pagination, queryflag };
      const data = yield call(querySysparam, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            sysparamlist: data.sysparamlist,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    * update({ payload }, { call, put }) {
      const data = yield call(updateSysparam, payload);
      return data;
    },


  },
  subscriptions: {},
};
