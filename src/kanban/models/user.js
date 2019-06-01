import {
  queryCurrent,
  menusSaveUpdate,
  getIllegalCount,
  getAllCharts,
  getNoticeList,
  getNoticeInfo,
  updateNoticeReadStatus,
  getToDoList,
  cancelTodo,
  getMapUrl,
  getUserTheme,
  saveUserTheme,
  getEventCount2Audit,
  getVedioPatrolCount,
  getEventReportCount,
  getPwdComplexityParam,
} from '../services/user';
import ItemTypes from '../layouts/ItemTypes';

const R = require('ramda');

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    bcompoentSize: [],
    acomponent: [],
    bcomponent: [],
    parameterconfig: [],
    droppedABoxNames: [],
    droppedBBoxNames: [],
    illegalCount: {},
    queryobj: {},
    allCharts: {},
    noticeList: [],
    noticeInfo: {},
    noticeReadStatus: {},
    toDoList: [], // 待办事项
    tongzhiData: [], // 通知数据
    signIn: {}, // 签收
    mapUrl: '',
    userTheme: '',
    bcomponentNum: 0, // 用户选中的b区域图表的数量,工作区配置时点击加号自动加1
    toDoPagination: {
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 100,
      total: null,
    },
    menuShowType: 'other', // 跳转menu展现形式
    event2AuditCount: {},
    vedioPatrolCount: {},
    eventReportCount: {},
    eventCountAudited: {},
    pwdComplexity: '0', // 密码复杂度校验开关
  },

  effects: {
    *menusSaveUpdate({ type, payload }, { call, put }) {
      const response = yield call(menusSaveUpdate, payload);
      return response || {};
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response?.returnCode == 0) {
        const { selectedComponents = [] } = response;

        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
        yield put({
          type: 'saveBcomponentNum',
          payload: selectedComponents,
        });
      }
    },
    *getUserTheme(_, { call, put }) {
      const response = yield call(getUserTheme);
      if (response?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: { userTheme: response },
        });
      }
      return response;
    },
    *saveUserTheme({ type, payload }, { call, put }) {
      const response = yield call(saveUserTheme, payload);
      const userTheme = payload.queryobj;
      if (response.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: { userTheme },
        });
      }

      return response;
    },
    *getAllCharts(_, { call, put }) {
      const response = yield call(getAllCharts);

      if (response?.returnCode == 0) {
        const allCharts = response.userChartList;
        yield put({
          type: 'updateState',
          payload: {
            allCharts,
          },
        });
      }
    },
    *getIllegalCount({ type, payload }, { call, put }) {
      const response = yield call(getIllegalCount, payload);
      if (response?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: { illegalCount: response.data },
        });
      }
    },
    *getNoticeInfo({ type, payload }, { call, put }) {
      const response = yield call(getNoticeInfo, payload);
      if (response?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: { noticeInfo: response.noticeInfo },
        });
      }
    },
    *getNoticeList({ type, payload }, { call, put, select }) {
      const response = yield call(getNoticeList, payload);
      if (response?.returnCode == 0) {
        yield put({
          type: 'saveNoticeList',
          payload: response,
        });
      }
    },
    *getToDoList({ type, payload }, { call, put }) {
      const pagination = {
        ...{
          current: 1,
          pageSize: 100,
          total: null,
        },
        ...payload?.pagination,
      };
      const response = yield call(getToDoList, { pagination });
      if (response?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: {
            toDoList: response.toDoList,
            toDoPagination: response.page,
          },
        });
      }

      return response;
    },
    *cancelTodo({ type, payload }, { call, put }) {
      const result = yield call(cancelTodo, payload);
    },
    *updateNoticeReadStatus({ type, payload }, { call, put }) {
      const response = yield call(updateNoticeReadStatus, payload);
      if (response?.returnCode == 0) {
        yield put({
          type: 'getNoticeList',
          payload: {},
        });
      }
    },

    *getMapUrl({ payload }, { call, put }) {
      const result = yield call(getMapUrl, payload);

      if (result?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: {
            mapUrl: result.mapUrl,
          },
        });
      }
    },
    *getEventCount2Audit({ payload }, { call, put }) {
      const result = yield call(getEventCount2Audit, payload);
      if (result?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: {
            event2AuditCount: result.event2AuditCount,
          },
        });
      }
    },
    *getVedioPatrolCount({ payload }, { call, put }) {
      const result = yield call(getVedioPatrolCount, payload);
      if (result?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: {
            vedioPatrolCount: result.vedioPatrolCount,
          },
        });
      }
    },
    *getEventReportCount({ payload }, { call, put }) {
      const result = yield call(getEventReportCount, payload);
      if (result?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: {
            eventReportCount: result.eventReportCount,
          },
        });
      }
    },
    *getPwdComplexityParam({ payload }, { call, put }) {
      const data = yield call(getPwdComplexityParam);
      if (data) {
        yield put({
          type: 'getPwdComplexityParamSuccess',
          payload: {
            pwdComplexity: data.result,
          },
        });
      }
    },
  },

  reducers: {
    saveBcomponentNum(state, action) {
      let bcomponentNum = 0;
      const selectedComponents = action.payload;
      for (let i = 0; i < selectedComponents.length; i += 1) {
        if (action.payload[i].type == ItemTypes.BWORKBENCH) {
          bcomponentNum += 1;
        }
      }
      const acomponent = selectedComponents.filter(element => {
        return element.type == ItemTypes.AWORKBENCH;
      });

      const bcomponent = selectedComponents.filter(element => {
        return element.type == ItemTypes.BWORKBENCH;
      });

      return { ...state, ...{ bcomponentNum, acomponent, bcomponent } };
    },
    updateBcomponentNum(state, action) {
      const { bcomponentNum } = action.payload;
      return { ...state, bcomponentNum };
    },

    /* eslint-disable camelcase */
    /* eslint no-param-reassign: */

    saveCurrentUser(state, action) {
      const currentUser = action.payload;
      currentUser.selectedMenus.forEach(x => {
        x.menuId = x?.menu_id;
        x.menuName = x?.menu_name;
        x.onClick = x?.onclick;
      });

      return {
        ...state,
        currentUser,
      };
    },

    saveparameterconfig(state, action) {
      return {
        ...state,
        parameterconfig: action.payload,
      };
    },

    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    bcompmentSizeUpdate(state, action) {
      return {
        ...state,
        bcompoentSize: action.sizePayload,
        acomponent: action.saveABoxNames,
        bcomponent: action.saveBBoxNames,
      };
    },

    saveNoticeList(state, action) {
      const istongZhi = n => n.notice_type == '2' && n.is_read == 0; // 截取未读通知数据
      const tongzhiData = R.filter(istongZhi, action?.payload?.noticeList || []); //

      return {
        ...state,
        noticeList: action?.payload?.noticeList || [],
        tongzhiData,
      };
    },
    noticeReadStatus(state, action) {
      return {
        ...state,
        noticeReadStatus: action.payload.noticeReadStatus,
      };
    },

    boxUpdate(state, action) {
      const { currentUser } = state;
      return {
        ...state,
        acomponent: action.apayload,
        bcomponent: action.bpayload,
        currentUser: {
          ...currentUser,
          selectedComponents: [...action.apayload, ...action.bpayload],
        },
      };
    },

    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },

    toggleMenuShowType(state, action) {
      return { ...state, menuShowType: state.menuShowType == 'pingpu' ? 'other' : 'pingpu' };
    },
    getPwdComplexityParamSuccess(state, action) {
      const { pwdComplexity } = action.payload;
      return { ...state, pwdComplexity };
    },
  },
  subscriptions: {},
};
