/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { queryVehicleRecordBy, queryVehicleRecordByDetail, getAllDeviceList, deleteDevice, addDevice, getDeviceinfoByID } from '../services/octCarRecord';
import { HierarchyGetallEx } from '../services/octRoadSection';

export default {
  namespace: 'octopenMonitor',
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
      const data = yield call(queryVehicleRecordBy, obj);
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
    // 查询过车记录详情
    *queryDetail({ payload }, { call, put }) {
      // const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj };
      const data = yield call(queryVehicleRecordByDetail, obj);
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
        message.error('显示失败！');
      }
    },
    // 模糊查询设备
    *getDeviceID({ payload }, { call, put }) {
      const { queryobj = {} } = payload;
      const obj = { ...queryobj };
      const data = yield call(getDeviceinfoByID, obj);
      return data;
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
    // 路段树形结构
    *queryMenuList({ payload }, { call, put }) {
      const data = yield call(HierarchyGetallEx, payload);
      if (data.result) {
        console.log(data.list);
        yield put({
          type: 'updateState',
          payload: {
            treeData: data.list,
          },
        });
      }
    },
    // // 编辑设备
    // *updateDevice({ payload }, { call, put }) {
    //   const { department } = payload;
    //   const data = yield call(updateDevice, { department });
    //   return yield data;
    // },
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
