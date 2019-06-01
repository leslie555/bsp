/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { chuXingNotChuan } from '../services/octQueryTraOutside';

export default {
  namespace: 'octQueryTraOutside',
  state: {
    list: [],
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
    // 机动车省内出行量统计查询
    *query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(chuXingNotChuan, obj);
      console.log(data);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
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
