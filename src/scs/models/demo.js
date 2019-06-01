import { message } from 'antd';
import { query } from '../services/demo';

export default {
  namespace: 'demo',
  state: {
    list: [],
    info: {},
    selectedrows: [],
    selectedRowKeys: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showtotal: total => `共 ${total} 条`,
      current: 1,
      pagesize: 10,
      total: null,
      onShowSizeChange: () => {
        setTimeout(() => {
          window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
        }, 1000);
      },
    },
    queryobj: {
      carno: '',
      cartype: '',
      controllevel: '',
      controltype: '',
      carbrand: '',
      source: '',
      infostatus: '',
      alarmstatus: '',
      interceptflag: '',
      pushuser: '',
    },
    record: {
      carno: '',
      cartype: '',
      carbrand: '',
      carcolor: '',
      source: '',
      controllevel: '',
      controltype: '',
      controlprop: '',
      controlscope: '',
      btime: '',
      etime: '',
      infostatus: '',
      alarmstatus: '',
      interceptflag: '',
      contact: '',
      telphone: '',
      pushphone: '',
      pushdptmt: '',
      puship: '',
      pushuser: '',
      charcdesc: '',
      matterdetail: '',
      createuserid: '',
      createtime: '',
      charcpic1: '',
      charcpic2: '',
      charcpic3: '',
    },
    checkedarr: [],
  },
  reducers: {
    getSelectedRows(state, action) {
      this.state.selectedRowKeys = action.payload.selectedRowKeys;
      return { ...state };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    // 获取查询结果-黑名单
    *query({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      pagination.current -= 1;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(query, obj);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            list: data.blacklist,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },

    // 获取选中的行数组
    *returnSelectedKeys({ payload }, { put }) {
      yield put({
        type: 'getSelectedRows',
        payload: {
          selectedRowKeys: payload.selectedRowKeys,
        },
      });
    },
  },
  subscriptions: {},
};
