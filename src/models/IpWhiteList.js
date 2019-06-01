import { message } from 'antd';
import { query, getOperatorList, queryToLog } from '../services/IPWhiteList';

export default {
  namespace: 'IpWhiteList',
  state: {
    list: [],
    info: {},
    userList: [],
    totalCount: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showtotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 10,
      total: 0,
      onShowSizeChange: () => {
        setTimeout(() => {
          window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
        }, 1000);
      },
    },
    queryobj: {
      userId: '',
    },
    checkedarr: [],
  },
  reducers: {
    getSelectedRows(state, action) {
      return { ...state };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateUserList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    // 获取查询结果-白名单
    // 查询列表名单, 用于添加，修改，删除后的查询，不记录日志。
    * query({ payload }, { call, put }) {
      const { queryobj = {} } = payload;
      const { page = {} } = payload;
      const obj = { ...queryobj, page };
      const data = yield call(query, obj);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            list: data.result,
            totalCount: data.total ? data.total : 0,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },

    * queryToLog({ payload }, { call, put }) {
      // 查询列表名单  用于查询，记录日志。
      const { queryobj = {} } = payload;
      const { page = {} } = payload;
      const obj = { ...queryobj };
      const data = yield call(queryToLog, obj);
      if (data.result) {
        console.log(data);
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            list: data.result,
            totalCount: data.total ? data.total : 0,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },

    // 获取 选中的行数组
    * returnSelectedKeys({ payload }, { put }) {
      yield put({
        type: 'getSelectedRows',
        payload: {},
      });
    },
    // 获取用户信息
    * queryUser({ payload }, { call, put }) {
      const obj = { };
      const data = yield call(getOperatorList, obj);
      if (data.result) {
        console.log(data);
        yield put({
          type: 'updateUserList',
          payload: {
            userList: data.result,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen((location) => {
  //       console.log(location.pathname);
  //       // if (location.pathname === '/IPWhiteList') {
  //       dispatch({
  //         type: 'queryUser',
  //         payload: {},
  //       });
  //       // }
  //     });
  //   },
  // },
};
