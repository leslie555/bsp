import { message } from 'antd';
import { queryIllegal, updateIllegal, addIllegal, deleteIllegal } from '../services/illegalservice';

export default {
  namespace: 'illegalmanage',
  state: {
    illegallist: [],
    illegalinfo: {},
    queryobj: {
      illegalkeywork: '',
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showtotal: total => `共 ${total} 条`,
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
    updateTableList(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    * query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryIllegal, obj);
      if (data && data.result) {
        yield put({
          type: 'updateTableList',
          payload: {
            queryobj,
            illegallist: data.illegallist,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    * update({ payload }, { call, put }) {
      const data = yield call(updateIllegal, payload);
      return data;
    },
    * add({ payload }, { call, put }) {
      const data = yield call(addIllegal, payload);
      return data;
    },
    * delete({ payload }, { call, put }) {
      const data = yield call(deleteIllegal, payload);
      return data;
    },


  },
  subscriptions: {},
};
