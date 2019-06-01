/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { queryTrafficEventBy, queryTrafficEventByDetail, getAllDeviceList, deleteDevice, addDevice, updateDevice, queryTrafficimgvideo } from '../services/octTrafficIncident';
import { HierarchyGetallEx } from '../services/octRoadSection';
import { TRAFFIC, DIRECTION } from '../config/enums';

export default {
  namespace: 'octTrafficIncident',
  state: {
    list: [],
    imgvideo: [], // 图片和视频，默认空数组
    img: [], // 图片
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
    // 查询详情图片视频
    *queryTrafficimgvideo({ payload }, { call, put }) {
      const data = yield call(queryTrafficimgvideo, payload);
      console.log(data);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            img: data.listimg, // TODO:修改http返回值
            imgvideo: data.list,
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
      const data = yield call(queryTrafficEventBy, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            resultlist: data.list,
            pagination: data.pagination,
          },
        });
        console.log(data);
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 查询过车记录详情
    *queryDetail({ payload }, { call, put }) {
      // const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj };
      const data = yield call(queryTrafficEventByDetail, obj);
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
