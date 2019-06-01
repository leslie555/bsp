/**
 * Created by cherry on 2018/7/10.
 */
import { message } from 'antd';
import { queryLogList, exportLogList, logExportRecord, getFirstMenuList, logDetailRecord } from '../services/devicelog';

export default {
  namespace: 'devicelog',
  state: {
    loglist: [],
    loginfo: {},
    menus: [],
    queryobj: {
      username: '',
      deviceid: '',
      logtype: '',
      functionname: '',
      starttime: '',
      endtime: '',
      operatecontent: '',
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      // showTotal: total => `共 ${total} 条`,
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
    // 查询日志
    *queryLog({ payload }, { call, put }) {
      // const { pagination = {} } = payload;
      const { starttime, endtime, deviceid } = payload;
      const queryobj = { starttime, endtime, deviceid };
      // const obj = { ...queryobj, pagination, queryflag };
      const data = yield call(queryLogList, payload);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            loglist: data.logList,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 导出日志
    *exportLog({ payload }, { call, put }) {
      const data = yield call(exportLogList, { ...payload });
      return yield data;
    },
    // 日志导出记录日志
    *exportLogRecord({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      yield call(logExportRecord, obj);
    },
    // 查看日志详情记录日志
    *logDetailLog({ payload }, { call, put }) {
      yield call(logDetailRecord, { ...payload });
    },
    // 查询一级菜单
    *getFirstMenuList({ payload }, { call, put }) {
      const data = yield call(getFirstMenuList);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            menus: data.menus,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/devicelog') {
          dispatch({
            type: 'getFirstMenuList',
            payload: {},
          });
        }
      });
    },
  },
};
