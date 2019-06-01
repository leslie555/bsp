/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { findDevicetment, getAllDeviceList, deleteDevice, addDevice, updateDevice } from '../services/octDeviceInfo';
import { HierarchyGetallEx } from '../services/octRoadSection';
import { HierarchyGetallExJ } from '../services/octPoliceArea';

export default {
  namespace: 'octDeviceInfo',
  state: {
    list: [],
    treeData: [],
    treeDataJ: [],
    ftplist: {},
    departmentlist: [],
    departmentinfo: {},
    queryobj: {
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
    addSon(state) {
      return { ...state, departmentinfo: {} };
    },
  },
  effects: {
    // 查询设备
    *queryDevice({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const department = { ...queryobj };
      const obj = { department, pagination };
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
      // const { latitude } = payload.department.latitude;
      // const { longitude } = payload.department.longitude;
      const data = yield call(addDevice, { department });
      return yield data;
    },
    // 编辑设备
    *updateDevice({ payload }, { call, put }) {
      const { department } = payload;
      const data = yield call(updateDevice, { department });
      return yield data;
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
    // 警务区树形结构
    *queryMenuListJ({ payload }, { call, put }) {
      const data = yield call(HierarchyGetallExJ, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            treeDataJ: data.list,
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
