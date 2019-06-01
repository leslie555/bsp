/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { chuXingDevice } from '../services/octQueryEquipment';

export default {
  namespace: 'octQueryEquipment',
  state: {
    list: [],
    excel: false,
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
    // 查询设备
    *query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(chuXingDevice, obj);
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
