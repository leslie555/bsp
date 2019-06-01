/**
 * Created by Administrator on 2018/7/12.
 */

import { queryMenuListService, queryOperateService } from '../services/menuManage/MenuManageService';

export default {
  namespace: 'octIllegalReport',
  state: {
    selectMenuId: '',
    selectMenuLevel: null,
    selectMenuInfo: {},

    currOperateList: [],
    menuList: [],
    operateList: [],
    operateRight: {},
    loading: false,
    expandedKeys: [],
  },


  reducers: {
    // 获取选择的复选框（更新state中的值）
    // 查询成功后查询
    queryMenuSuccess(state, action) {
      const { menuList } = action.payload;
      const expandedKeys = [];
      const rootArray = [];
      const rootNode = {};

      rootNode.id = '0';
      rootNode.name = '总菜单';
      rootNode.grade = 0;
      expandedKeys.push('0');

      const fisrtArray = [];
      for (let i = 0; i < menuList.length; i += 1) {
        const firstNode = {};
        firstNode.id = menuList[i].id;
        firstNode.name = menuList[i].title;
        firstNode.grade = 1;
        firstNode.info = menuList[i];
        const secondArr = [];
        const subLevelList = menuList[i].subMenuList; // sub l
        if (!!subLevelList && subLevelList.length > 0) { // second level
          for (let j = 0; j < subLevelList.length; j += 1) {
            const secondNode = {};
            secondNode.id = subLevelList[j].id;
            secondNode.name = subLevelList[j].title;
            secondNode.grade = 2;
            secondNode.info = subLevelList[j];
            const thirdLevelList = subLevelList[j].subMenuList; // sub l
            const nodesChildren = [];
            if (!!thirdLevelList && thirdLevelList.length > 0) { // second level
              for (let k = 0; k < thirdLevelList.length; k += 1) {
                const thirdNode = {};
                thirdNode.id = thirdLevelList[k].id;
                thirdNode.name = thirdLevelList[k].title;
                thirdNode.grade = 3;
                thirdNode.info = thirdLevelList[k];
                nodesChildren.push(thirdNode);
              }
            }
            secondNode.children = nodesChildren;
            secondArr.push(secondNode);
          }
        }

        firstNode.children = secondArr;
        fisrtArray.push(firstNode);
      }
      rootNode.children = fisrtArray;
      rootArray.push(rootNode);


      return { ...state, menuList: rootArray, expandedKeys };
    },

    queryOperateSuccess(state, action) {
      const { operateList } = action.payload;
      const upCaseOperateList = [];
      operateList.forEach((n, index) => {
        const upCaseOperate = {};
        upCaseOperate.TITLE = n.title;
        upCaseOperate.MENU_ID = n.menu_id;
        upCaseOperate.NAME = n.name;
        upCaseOperate.ID = n.id;
        upCaseOperate.ORDER_ID = n.order_id;
        upCaseOperateList.push(upCaseOperate);
      });
      // operateList.map((items) => {
      //   console.log(items);
      // });
      // console.log(operateList);
      return { ...state, operateList: upCaseOperateList };
    },


    selectedRowKeys(state, action) {
      const { menuId, nLevel, menuInfo } = action.payload;
      const tempList = state.operateList;
      const showOperate = [];
      tempList.forEach((n, index) => {
        if (n.MENU_ID === menuId) {
          showOperate.push(n);
        }
      });

      // console.log(showOperate);
      return { ...state,
        selectMenuId: menuId,
        selectMenuLevel: nLevel,
        selectMenuInfo: menuInfo,
        currOperateList: showOperate,
        operateRight: [],
      };
    },

    addSon(state) {
      return { ...state, selectMenuInfo: [] };
    },

    addOperate(state) {
      return { ...state, operateRight: [] };
    },


    selectOneOperate(state, action) {
      const { selectOneOperate } = action.payload;
      return { ...state, operateRight: selectOneOperate };
    },
  },
  effects: {
    * queryMenuList({ payload }, { call, put }) {
      const data = yield call(queryMenuListService, payload);
      if (data.result) {
        yield put({
          type: 'queryMenuSuccess',
          payload: {
            menuList: JSON.parse(data.json),
          },
        });
      }
      const operate = yield call(queryOperateService, payload);
      if (operate) {
        yield put({
          type: 'queryOperateSuccess',
          payload: {
            operateList: operate,
          },
        });
      }
    },

    * updateMenu({ payload }, { call, put }) {
      const data = yield call(queryMenuListService, payload);
      if (data.result) {
        yield put({
          type: 'queryMenuSuccess',
          payload: {
            menuList: JSON.parse(data.json),
          },
        });
      }
    },

  },
};
