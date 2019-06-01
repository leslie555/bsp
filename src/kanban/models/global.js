import { queryNotices, fetchCommonInfo, queryIlligalDataByPoliceInfo, getVAMData } from '../services/api';
import { saveUserCharts } from '../services/user';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    rightCollapsed: true,
    setMenuCollapsed: true,
    notices: [],
    fetchingNotices: false,
    leftMenus: [],
    loading: false,
    illigalDataByPoliceInfo: [], // 首页柱状图数据 根据分拣员统计  0 待初审  1 待复审   4上传成功
    chatVamInfo: [], // 首页饼状图事故数据统计
  },

  effects: {
    *saveUserCharts({ type, payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(saveUserCharts, payload);
      return response;
    },
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count.data,
      });

      yield put({
        type: 'saveClearedNotices',
        payload,
      });
    },
    *fetchCommonInfo(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchCommonInfo);
      if (response?.returnCode == 0) {
        yield put({
          type: 'saveCommonInfo',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchIlligalDataByPoliceInfo(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(queryIlligalDataByPoliceInfo);

      if (response?.returnCode == 0) {
        yield put({
          type: 'saveIlligalDataByPoliceInfo',
          payload: response,
        });
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *getVAMData({ type, payload = {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getVAMData, payload);
      if (response.returnCode == 0) {
        yield put({
          type: 'saveChartVAM',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: !payload,
      };
    },
    changeRightCollapsed(state, { payload }) {
      return {
        ...state,
        rightCollapsed: payload,
      };
    },
    changeSetMenuCollapsed(state, { payload }) {
      return {
        ...state,
        setMenuCollapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
    saveCommonInfo(state, { payload }) {
      return {
        ...state,
        leftMenus: payload?.menuStr,
      };
    },
    saveIlligalDataByPoliceInfo(state, { payload }) {
      return {
        ...state,
        illigalDataByPoliceInfo: payload.data,
      };
    },
    saveChartVAM(state, { payload }) {
      return {
        ...state,
        chatVamInfo: payload.data,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
