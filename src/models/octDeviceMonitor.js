/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { findDevicetment, getAllDeviceList, deleteDevice, addDevice, updateDevice } from '../services/octDeviceInfo';

export default {
  namespace: 'octDeviceMonitor',
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
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    // 查询上级设备
    *getAllDeviceList({ payload }, { call, put }) {
      const data = yield call(getAllDeviceList);
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
    // 查询设备
    *queryDevice({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(findDevicetment, obj);
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
    // 删除设备
    *deleteDevice({ payload }, { call, put }) {
      const { deviceid } = payload;
      const data = yield call(deleteDevice, { deviceid });
      return yield data;
    },
    // 添加设备
    *addDevice({ payload }, { call, put }) {
      const { department } = payload;
      const data = yield call(addDevice, { department });
      return yield data;
    },
    // 编辑设备
    *updateDevice({ payload }, { call, put }) {
      const { department } = payload;
      const data = yield call(updateDevice, { department });
      return yield data;
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
