/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { findDepartment, getAllDepartmentsList, deleteDepartment, addDepartment, updateDepartment } from '../services/departmentmanage';

export default {
  namespace: 'departmentmanage',
  state: {
    list: [],
    departmentlist: [],
    departmentinfo: {},
    queryobj: {
      departmentcode: '',
      departmentname: '',
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
    // 查询上级部门
    *getAllDepartmentsList({ payload }, { call, put }) {
      const data = yield call(getAllDepartmentsList);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.list,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 查询部门
    *queryDepartment({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(findDepartment, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            departmentlist: data.departmentlist,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 删除部门
    *deleteDepartment({ payload }, { call, put }) {
      const { dptCode } = payload;
      const data = yield call(deleteDepartment, { dptCode });
      return yield data;
    },
    // 添加部门
    *addDepartment({ payload }, { call, put }) {
      const { department } = payload;
      const data = yield call(addDepartment, { department });
      return yield data;
    },
    // 编辑部门
    *updateDepartment({ payload }, { call, put }) {
      const { department } = payload;
      const data = yield call(updateDepartment, { department });
      return yield data;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/department') {
          dispatch({
            type: 'getAllDepartmentsList',
          });
        }
      });
    },
  },
};
