/**
 * Created by cherry on 2018/7/2.
 */
import { message } from 'antd';
import { findAllEnumType, findEnumMem, deleteEnum, addEnum, editEnum, deleteEnumMem, addEnumMem, editEnumMem } from '../services/dictionarymanage';

export default {
  namespace: 'dictionarymanage',
  state: {
    dictionarylist: [],
    dictionaryinfo: {},
    queryobj: {
      name: '',
    },
    queryMemObj: {
      enumMemName: '',
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
    paginationMem: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 5,
      total: null,
      size: 'small',
      pageSizeOptions: ['5', '10', '20', '30', '40'],
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
    getDictionaryInfoSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    // 查询枚举类型
    *queryEnumTypes({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(findAllEnumType, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            dictionarylist: data.enumTypes,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 查询枚举详细信息
    *getDictionaryInfo({ payload }, { call, put }) {
      const { paginationMem = {} } = payload;
      const { queryMemObj = {} } = payload;
      const obj = { ...queryMemObj, paginationMem };
      const data = yield call(findEnumMem, obj);
      if (data && data.result) {
        const dictionaryinfo = { ...queryMemObj, members: data.enumMems };
        yield put({
          type: 'getDictionaryInfoSuccess',
          payload: {
            queryMemObj,
            dictionaryinfo,
            paginationMem: data.paginationMem,
          },
        });
      } else {
        message.error('详情查询失败，请联系管理员！');
      }
    },
    // 枚举类型删除
    *deleteEnum({ payload }, { call, put }) {
      const { desObj } = payload;
      // delete desObj[ROWNUM_];
      const data = yield call(deleteEnum, { desObj });
      return yield data;
    },
    // 枚举类型添加
    *addEnum({ payload }, { call, put }) {
      const { desObj } = payload;
      const data = yield call(addEnum, { desObj });
      return yield data;
    },
    // 枚举类型编辑
    *editEnum({ payload }, { call, put }) {
      const { desObj, srcObj } = payload;
      const data = yield call(editEnum, { srcObj, desObj });
      return yield data;
    },
    // 枚举成员删除
    *deleteEnumMem({ payload }, { call, put }) {
      const { desObj } = payload;
      const data = yield call(deleteEnumMem, { desObj });
      return yield data;
    },
    // 枚举成员添加
    *addEnumMem({ payload }, { call, put }) {
      const { desObj } = payload;
      const data = yield call(addEnumMem, { desObj });
      return yield data;
    },
    // 枚举成员编辑
    *editEnumMem({ payload }, { call, put }) {
      const { desObj, srcObj } = payload;
      const data = yield call(editEnumMem, { srcObj, desObj });
      return yield data;
    },
  },
  subscriptions: {},
};
