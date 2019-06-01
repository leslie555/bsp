/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { HierarchyGetall, editRoad, addRoad, deleteRoad } from '../services/octPoliceArea';

export default {
  namespace: 'octPoliceArea',
  state: {
    groupinfo: {},
    expandedKeys: [],
    nodeInfo: {},
    queryobj: {
      policeId: '',
      policeParentId: '',
    },
    selectGroupId: '',
    menuList: [],
    currOperateList: [],
    operateList: [],
    operateRight: {},
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    addSon(state) {
      return { ...state, nodeInfo: [] };
    },
    //  from  menumanagemodel
    selectedRowKeys(state, action) {
      console.error('------------');
      console.log(action.payload);
      console.error('------------');
      const {
        policeId, policeName, policeFullName,
        areaid, level,
      } = action.payload.nodeInfo;
      const tempList = state.operateList;
      const showOperate = [];
      tempList.forEach((n, index) => {
        if (n.MENU_ID === policeId) {
          showOperate.push(n);
        }
      });

      // console.log(showOperate);
      return { ...state,
        selectGroupId: policeId,
        selectGroupName: policeName,
        selectGroupAreaId: areaid,
        selectGroupLevel: level,
        selectGroupFullName: policeFullName,
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
      const { name, fullname, areaid, policeParentId } = payload;
      const data = yield call(addRoad, { name, fullname, areaid, policeParentId });
      return yield data;
    },
    // 编辑
    *editRoad({ payload }, { call, put }) {
      const { name, fullname, areaid, policeId } = payload;
      const data = yield call(editRoad, { name, fullname, areaid, policeId });
      return yield data;
    },
    // 删除
    *deleteRoad({ payload }, { call, put }) {
      const { policeId } = payload;
      // delete desObj[ROWNUM_];
      const data = yield call(deleteRoad, { policeId });
      return yield data;
    },
  },
  subscriptions: {
  },
};
