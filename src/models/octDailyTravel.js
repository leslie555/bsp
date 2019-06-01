/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { chuXingTotal } from '../services/octDailyTravel';

export default {
  namespace: 'octDailyTravel',
  state: {
    list: [],
    excel: false,
    departmentlist: [],
    departmentinfo: {},
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
    // 日军机动车出行量
    *query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(chuXingTotal, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            resultlist: data.list,
            pagination: data.pagination,
            excel: data.excel,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
};
