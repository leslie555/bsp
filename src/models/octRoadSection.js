/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { HierarchyGetall, editRoad, addRoad, deleteRoad, GetDeviceByRoadID } from '../services/octRoadSection';

export default {
  namespace: 'octRoadSection',
  state: {
    groupinfo: {},
    expandedKeys: [],
    nodeInfo: {},
    queryobj: {
      id: '',
      pid: '',
    },
    selectGroupId: '',
    menuList: [],
    currOperateList: [],
    operateList: [],
    operateRight: {},
    devicelist: [],
    devicelistOld: [],
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    searchLocal(state, action) {
      const { devicelist, devicelistOld } = state;
      const { payload } = action;
      const { searchValue } = payload;
      const obj = searchValue.trim();
      if (obj == null || obj.length == 0) {
        return {
          ...state,
          devicelist: devicelistOld,
        };
      } else {
        const devicelistNew = [];
        devicelist.forEach(e => {
          if (e.deviceid.indexOf(obj) >= 0) {
            devicelistNew.push(e);
          }
        });
        return {
          ...state,
          devicelist: devicelistNew,
        };
      }
    },
    addSon(state) {
      return { ...state, nodeInfo: [] };
    },
    //  from  menumanagemodel
    selectedRowKeys(state, action) {
      console.error('------------');
      console.log(action.payload);
      console.error('------------');
      const { id, name, fullname, englishname, areaid } = action.payload.nodeInfo;
      const tempList = state.operateList;
      const showOperate = [];
      tempList.forEach((n, index) => {
        if (n.MENU_ID === id) {
          showOperate.push(n);
        }
      });

      // console.log(showOperate);
      return { ...state,
        selectGroupId: id,
        selectGroupName: name,
        selectGroupEnglishName: englishname,
        selectGroupAreaId: areaid,
        selectGroupFullName: fullname,
        currOperateList: showOperate,
        operateRight: [],
      };
    },
  },
  effects: {
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
    // 添加
    *addRoad({ payload }, { call, put }) {
      const { name, fullname, areaid, pid } = payload;
      const data = yield call(addRoad, { name, fullname, areaid, pid });
      return yield data;
    },
    // 编辑
    *editRoad({ payload }, { call, put }) {
      const { name, fullname, areaid, id } = payload;
      const data = yield call(editRoad, { name, fullname, areaid, id });
      return yield data;
    },
    // 删除
    *deleteRoad({ payload }, { call, put }) {
      const { id } = payload;
      // delete desObj[ROWNUM_];
      const data = yield call(deleteRoad, { id });
      return yield data;
    },
    // 拿到所有的设备
    *queryDevice({ payload }, { call, put }) {
      const data = yield call(GetDeviceByRoadID, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            devicelistOld: data.list,
          },
        });
      }
    },
  },
  subscriptions: {
  },
};
