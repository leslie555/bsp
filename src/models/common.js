import moment from 'moment';
import 'moment/locale/zh-cn';
import { Modal } from 'antd/lib/index';
import { getEnumList, getOperateCodes } from '../services/common';
import * as ENUMS from '../config/enums';
import { getCurrentUserInfo } from '../services/accmservice';

moment.locale('zh-cn');
export default {
  namespace: 'common',
  state: {
    enumList: [],
    curUser: {}, // 当前登录用户信息
    codeList: [], // 当前用户角色的操作码
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const enumsArr = [];
        for (const enuma in ENUMS) {
          if (typeof ENUMS[enuma] === 'number') {
            enumsArr.push(ENUMS[enuma]);
          }
        }
        dispatch({
          type: 'getEnumList',
          payload: { enumtypeid: enumsArr.join(',') },
        });
        dispatch({
          type: 'getCurrentUserInfo',
          payload: {},
        });
        dispatch({
          type: 'getOperateCodes',
          payload: {},
        });
      });
    },
  },

  effects: {
    *getEnumList({ payload }, { call, put }) {
      const result = yield call(getEnumList, payload);
      if (result && result.result) {
        yield put({
          type: 'getEnumListSuccess',
          payload: {
            enumList: result.enumlist,
          },
        });
      }
    },
    *getCurrentUserInfo({ payload }, { call, put }) {
      const result = yield call(getCurrentUserInfo, payload);
      if (result && result.user) {
        yield put({
          type: 'getCurrentUserInfoSuccess',
          payload: {
            curUser: result.user,
          },
        });
      }
    },
    *getOperateCodes({ payload }, { call, put }) {
      const result = yield call(getOperateCodes, payload);
      if (result && result.result) {
        yield put({
          type: 'getOperateCodesSuccess',
          payload: {
            codeList: result.codelist,
          },
        });
      }
    },
  },

  reducers: {
    getEnumListSuccess(state, action) {
      const { enumList } = action.payload;
      return { ...state, enumList };
    },
    getCurrentUserInfoSuccess(state, action) {
      const { curUser } = action.payload;
      return { ...state, curUser };
    },
    getOperateCodesSuccess(state, action) {
      const { codeList } = action.payload;
      return { ...state, codeList };
    },
  },
};
