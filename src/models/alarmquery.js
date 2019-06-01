/**
 * Created by cherry on 2018/7/10.
 */
import { message } from 'antd';
import { queryLogList, exportLogList, logExportRecord, getFirstMenuList, logDetailRecord } from '../services/alarmquery';

export default {
  namespace: 'alarmquery',
  state: {
    alarmlist: [],
    alarminfo: {},
    menus: [],
    queryobj: {
      deviceid: '',
      alarmtime: '',
      alarmtype: '',
      orgtype: '',
      dealflag: '',
      dealtime: '',
      operator: '',
      alarminfo: '',
    },
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
    // 查询日志
    *queryLog({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const { queryflag } = payload;
      const obj = { ...queryobj, pagination, queryflag };
      const data = yield call(queryLogList, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            alarmlist: data.alarmList,
            pagination: data.pagination,
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
        if (location.pathname === '/alarmquery') {
          dispatch({
            type: 'getFirstMenuList',
            payload: {},
          });
        }
      });
    },
  },
};
