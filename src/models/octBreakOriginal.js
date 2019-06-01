/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { queryIllegalInfo, queryIllegalInfoDetail, getAllDeviceList, deleteDevice, addDevice, updateDevice, queryIllegalImages } from '../services/octBreakOriginal';
import { query } from '../services/IPWhiteList';
import { HierarchyGetallEx } from '../services/octRoadSection';

export default {
  namespace: 'octBreakOriginal',
  state: {
    list: [],
    imglist: [], // 详情的图片列表，默认为空数组
    treeData: [],
    departmentlist: [],
    departmentinfo: {},
    pagination: {
      // showSizeChanger: true,
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
    // 查询设备图片List
    *queryDeviceImage({ payload }, { call, put }) {
      const data = yield call(queryIllegalImages, payload);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            imglist: data.list,
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
      const data = yield call(queryIllegalInfo, obj);
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
    // 查询涉嫌违法详情
    *queryDetail({ payload }, { call, put }) {
      // const { pagination = {} } = payload;
      const { id = {} } = payload;
      const { queryobj = {} } = payload;
      // const query = { id };
      const recorddetail = {};
      console.log(id);
      console.log(query);
      const data = yield call(queryIllegalInfoDetail, { id });
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            recorddetail: data.list,
            // pagination: data.pagination,
          },
        });
        console.log(recorddetail);
      } else {
        message.error('显示失败！');
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
