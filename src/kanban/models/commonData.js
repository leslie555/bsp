/**
 * Created by 曹禹 on 2018/2/3 0003.
 */
import * as commonService from '../services/commonService';

export default {
  namespace: 'commonData',
  state: {
    enums: null,
    depts: null,
  },

  reducers: {
    updateEnums(
      state,
      {
        payload: { enums },
      }
    ) {
      const enumMap = new Map();
      if (enums != null && enums.length > 0) {
        for (const enuma of enums) {
          const key = `${enuma.enumtypeid}-${enuma.enumvalue}`; // 大小写关注点
          enumMap.set(key, enuma.enumname); // 大小写关注点
        }
      }
      return {
        ...state,
        enums: enumMap,
      };
    },
    updateDepts(
      state,
      {
        payload: { depts },
      }
    ) {
      const deptMap = new Map();
      if (depts != null && depts.length > 0) {
        for (const dept of depts) {
          const key = dept.cdepartmentcode; // 大小写关注点
          const names = {
            shot: dept.deptshortname,
            full: dept.cdepartmentname,
            nlevel: dept.nlevel,
          }; // 大小写关注点
          deptMap.set(key, names);
        }
      }
      return {
        ...state,
        depts: deptMap,
      };
    },
  },

  effects: {
    *fetch({ type, payload = {} }, { call, put }) {
      yield put({
        type: 'updateLoading',
        payload: { loading: true },
      });
      const response = yield call(commonService.queryDepts);
      if (response && response.depts) {
        const list = response.depts || [];
        yield put({ type: 'updateDepts', payload: { depts: list } });
      }
      yield put({
        type: 'updateLoading',
        payload: { loading: false },
      });
    },
    *fetchEnums({ type, payload = {} }, { call, put }) {
      yield put({
        type: 'updateLoading',
        payload: { loading: true },
      });
      const response = yield call(commonService.queryEnums);
      if (response.enums) {
        const list = response.enums || [];
        yield put({ type: 'updateEnums', payload: { enums: list } });
      }
      yield put({
        type: 'updateLoading',
        payload: { loading: false },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      /*      history.listen((location) => {
        if (location.pathname === '/home') {
          dispatch({
            type: 'fetchEnums',
          });
          dispatch({
            type: 'fetch',
          });
        }
      }
      ) */
    },
  },
};
