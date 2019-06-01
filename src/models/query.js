import { message } from 'antd';
import { queryUnit, gethistoryById, saveCustomData, queryDetails } from '../services/octQueryOriginal';

export default {
  namespace: 'query',
  state: {
    list0: [],
    danweiHistory: [], // 单位历史记录
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
    // 施工维护单位查询
    *query({ payload }, { call, put }) {
      const data = yield call(queryUnit);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            list0: data.list,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 详情里的保存按钮
    *saveCustomData({ payload, callback }, { call, put }) {
      const data = yield call(saveCustomData, payload);
      if (data && data.result) {
        if (callback && typeof callback === 'function') {
          callback(data);
        }
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 施工维护单位查询历史记录
    *gethistoryById({ payload }, { call, put }) {
      const data = yield call(gethistoryById, payload);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            danweiHistory: data.list,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 项目分类统计详情
    *queryDetails({ payload }, { call, put }) {
      const data = yield call(queryDetails, payload);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            dataSource: data.list,
            paginations: data.pagination, // 详情里的分页
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
};
