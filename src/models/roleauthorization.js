/**
 * Created by cherry on 2018/7/26.
 */
import { message } from 'antd';
import { getAuthorityTree, getResourceTree, queryRole, deleteRole, findUserRoleList, saveRole } from '../services/roleauthorization';

export default {
  namespace: 'roleauthorization',
  state: {
    rolelist: [],
    roleinfo: {},
    authtree: [],
    authChecked: [],
    resourcetree: [],
    resourceChecked: [],
    userlist: [],
    queryobj: {
      rolename: '',
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
    changeDevice(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    // 获取功能授权树
    *getAuthorityTree({ payload }, { call, put }) {
      const { roleinfo = {} } = payload;
      const data = yield call(getAuthorityTree, { editRoleID: roleinfo.roleid });
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            roleinfo,
            authtree: data.doc.children,
            authChecked: data.checkedArr ? data.checkedArr : [],
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 获取资源授权树
    *getResourceTree({ payload }, { call, put }) {
      const { roleinfo = {} } = payload;
      const data = yield call(getResourceTree, { editRoleID: roleinfo.roleid });
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            resourcetree: data.doc.children,
            resourceChecked: data.checkedArr ? data.checkedArr : [],
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 获取拥有某角色的人员列表
    *getUserRoleList({ payload }, { call, put }) {
      const { roleinfo = {} } = payload;
      const data = yield call(findUserRoleList, { roleId: roleinfo.roleid });
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            userlist: data.userList,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 查询角色
    *queryRole({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryRole, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            rolelist: data.rolelist,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 删除角色
    *deleteRole({ payload }, { call, put }) {
      const { roleIdStr } = payload;
      const data = yield call(deleteRole, { roleIdStr });
      return yield data;
    },
    // 添加、编辑角色
    *saveRole({ payload }, { call, put }) {
      const data = yield call(saveRole, payload);
      return yield data;
    },
  },
  subscriptions: {},
};
