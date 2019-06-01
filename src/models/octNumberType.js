/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { queryAllByParam } from '../services/octNumberType';
import { HierarchyGetallEx } from '../services/octRoadSection';

export default {
  namespace: 'octNumberType',
  state: {
    treeData: [],
    list: [],
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
    // 查询设备
    *queryAllByParam({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryAllByParam, obj);
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
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/department') {
          dispatch({
            type: 'getAllDeviceList',
          });
        }
      });
    },
  },
};
