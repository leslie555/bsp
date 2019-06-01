/*eslint-disable*/
/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import moment from 'moment';
import { findDevicetment, deleteDevice, addDevice } from '../services/octCheckDeviceTime';
import { HierarchyGetallEx } from '../services/octRoadSection';
import { HierarchyGetallExJ } from '../services/octPoliceArea';

export default {
  namespace: 'octCheckDeviceTime',
  state: {
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
      // console.log('updateState', action.payload);
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
      // const { pagination = {}, deviceid = '', startTime, endTime, projectid } = payload;
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      // const obj = { projectid, deviceid, pagination, startTime, endTime };
      const obj = { ...queryobj, pagination };
      const data = yield call(findDevicetment, obj);
      if (data && data.list) {
        data.list.map(item => {
          if (0 <= item.diff && 1 >= item.diff) {
            item.status = '无需校时';
          } else {
            item.status = '需要校时';
          }
        });
      }
      // console.log('7777777777', data.list);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            departmentlist: data.list,
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
