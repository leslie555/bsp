/**
 * Created by cherry on 2018/7/13.
 */
import { message } from 'antd';
import { queryMessageLog } from '../services/messagelog';

export default {
  namespace: 'messagelog',
  state: {
    messagelist: [],
    queryobj: {
      telnumber: '',
      strmessage: '',
      starttime: '',
      endtime: '',
      submitstate: '',
    },
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
    // 查询日志
    *queryMessage({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryMessageLog, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            messagelist: data.messageList,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
  subscriptions: {},
};
