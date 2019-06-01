/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { queryAllGroup, queryDeviceByGroup, HierarchyGetall, save } from '../services/octDeviceGroup';

export default {
  namespace: 'octDeviceGroupSta',
  state: {
    groupinfo: {},
    nodeInfo: {},
    queryobj: {
      id: '',
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
    devicelist: [],
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
    // 所有分组
    *queryAllGroup({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryAllGroup, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            resultlist: data.list,
            // pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 分组下的设备
    *queryDeviceByGroup({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryDeviceByGroup, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            devicelist: data.list,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 得到树形结构
    *queryMenuList({ payload }, { call, put }) {
      const data = yield call(HierarchyGetall, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            menuList: data.list,
          },
        });
      }
    },
    // 保存按钮
    *save({ payload }, { call, put }) {
      const data = yield call(save, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          // payload: {
          //   menuList: data.list,
          // },
        });
      }
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
