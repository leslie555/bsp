/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { queryOriginal } from '../services/octQueryOriginal';
import { HierarchyGetallEx } from '../services/octRoadSection';

export default {
  namespace: 'octQueryOriginal',
  state: {
    list: [],
    treeData: [],
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
      console.log(action.payload);
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
      const data = yield call(queryOriginal, obj);
      if (data && data.result) {
        console.log(data.list);
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
    // 路段树形结构
    *queryMenuList({ payload }, { call, put }) {
      const data = yield call(HierarchyGetallEx, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: data.list,
          },
        });
      }
    },
  },
};
