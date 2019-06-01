import moment from 'moment';
import 'moment/locale/zh-cn';
import { getEnumList, getOperatorInfo, getSysParamsList } from '../services/common';
import * as ENUMS from '../config/enums';
import * as SYSPARMS from '../config/sysparms';

moment.locale('zh-cn');

export default {
  namespace: 'common',
  state: {
    enumList: [],
    sysParamList: [],
    operatorInfo: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getEnumList({ payload }, { call, put }) {
      const result = yield call(getEnumList, payload);
      if (!!result && !!result) {
        if (result.result) {
          yield put({
            type: 'updateState',
            payload: {
              enumList: result.enumlist,
            },
          });
          return result.enumlist;
        } else {
          return [];
        }
      }
    },
    *getOperatorInfo({ payload }, { call, put }) {
      const result = yield call(getOperatorInfo, payload);
      if (result) {
        if (result.result) {
          yield put({
            type: 'updateState',
            payload: {
              operatorInfo: result.operatorinfo,
            },
          });
        } else {
          // confirm({
          //   title: '无法获取当前用户数据，请重新登录',
          // });
        }
      }
    },
    *getSysParamsList({ payload }, { call, put }) {
      const result = yield call(getSysParamsList, payload);
      if (result) {
        if (result.result) {
          yield put({
            type: 'updateState',
            payload: {
              sysparam: result,
            },
          });
          return result.params;
        } else {
          return [];
        }
      }
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
};
