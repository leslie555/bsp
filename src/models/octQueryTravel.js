/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { chuXingChuan } from '../services/octQueryTravel';

export default {
  namespace: 'octQueryTravel',
  state: {
    list: [],
    excel: false,
    pagination: {
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 100,
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
      const data = yield call(chuXingChuan, obj);
      console.log(data);
      if (data && data.result) {
        // 处理data.list
        const NewArr = [];
        data.list.forEach(e => {
          const o = {};
          o.pdate = e.pdate;
          e.datas.forEach(ex => {
            o[ex.key] = ex.value;
          });
          NewArr.push(o);
        });
        console.error(NewArr);
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            resultlist: NewArr,
            excel: data.excel,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
};
