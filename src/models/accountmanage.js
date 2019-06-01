/**
 * Created by Administrator on 2018/7/11.
 */
import { notification } from 'antd';
import {
  getDepartmentListJGJ, getDepartmentListWeiHuJianShe,
  getDepartmentList, getOperatorList,
  deleteOperator, addOperator,
  getUserRoles, updateOperator,
  findIPList } from '../services/accmservice';

export default {
  namespace: 'accountmanage',
  state: {
    departmentList: [], // 组织架构树
    departmentListwh: [], // 维护施工单位的组织结构树
    deptList: [], // 部门列表
    expandedKeys: [], // 默认展开的节点
    selDeptInfo: '', // 组织架构树中当前选中的部门信息
    userList: [], // 用户结果集
    userTotalCount: 0, // 用户结果集总数
    selectedUser: {}, // 当前选中用户
    userEditFlag: 1, // 用户信息窗口状态   1查看  2新增  3编辑
    queryParams: {
      userid: '',
      username: '',
    }, // 用户列表查询条件
    selectedRoleKeys: [], // 角色选择窗口当前选中的角色ID集合
    selectedUserKeys: [], // 用户列表中当前选中项(id)
    selectedUserRows: [], // 用户列表中当前选中项(详情)
    userListPagenation: {
      pageSize: 15,
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '15', '20', '25', '30', '35', '40'],
      total: 0,
    }, // 用户列表分页
  },
  reducers: {
    getDepartmentSuccess(state, action) {
      const { departmentList } = action.payload;
      const expandedKeys = [];
      const rootNode = {};
      const rootArray = [];
      const nodes = [];
      // 生成组织架构树 方法取自5.0
      for (let i = 0; i < departmentList.length; i += 1) {
        if (departmentList[i].nlevel.trim() === '1') {
          rootNode.id = departmentList[i].cdepartmentid;
          rootNode.name = departmentList[i].deptshortname;
          rootNode.grade = '1';
          expandedKeys.push(departmentList[i].cdepartmentid);
        } else if (departmentList[i].nlevel.trim() === '2') {
          const aNode = {};
          aNode.id = departmentList[i].cdepartmentid;
          aNode.name = departmentList[i].deptshortname;
          aNode.grade = '2';
          expandedKeys.push(departmentList[i].cdepartmentid);
          const nodesChildren = [];
          for (let j = 0; j < departmentList.length; j += 1) {
            if (departmentList[j].parentdepartment === departmentList[i].cdepartmentid && departmentList[j].nlevel.trim() === '3') {
              const cnode = {};
              cnode.id = departmentList[j].cdepartmentid;
              cnode.name = departmentList[j].deptshortname;
              cnode.grade = '3';
              const thirdChildren = [];
              for (let k = 0; k < departmentList.length; k += 1) {
                if (departmentList[k].parentdepartment === departmentList[j].cdepartmentid && departmentList[k].nlevel.trim() === '4') {
                  const tnode = {};
                  tnode.id = departmentList[k].cdepartmentid;
                  tnode.name = departmentList[k].deptshortname;
                  tnode.grade = '4';
                  // 没有子节点,只有三级,所以下级(3级的node)children设置null
                  tnode.children = null;
                  thirdChildren.push(tnode);
                }
              }
              cnode.children = thirdChildren;
              nodesChildren.push(cnode);
            }
          }
          aNode.children = nodesChildren;
          nodes.push(aNode);
        }
      }
      rootNode.children = nodes;
      rootArray.push(rootNode);

      return { ...state, departmentList: rootArray, deptList: departmentList, expandedKeys };
    },
    getDepartmentSuccessWHSG(state, action) {
      const { departmentListwh } = action.payload;
      const expandedKeys = [];
      const rootNode = {};
      const rootArray = [];
      const nodes = [];
      // 生成组织架构树 方法取自5.0
      for (let i = 0; i < departmentListwh.length; i += 1) {
        if (departmentListwh[i].nlevel === '1') {
          rootNode.id = departmentListwh[i].cdepartmentid;
          rootNode.name = departmentListwh[i].deptshortname;
          rootNode.grade = '1';
          expandedKeys.push(departmentListwh[i].cdepartmentid);
        } else if (departmentListwh[i].nlevel === '2') {
          const aNode = {};
          aNode.id = departmentListwh[i].cdepartmentid;
          aNode.name = departmentListwh[i].deptshortname;
          aNode.grade = '2';
          expandedKeys.push(departmentListwh[i].cdepartmentid);
          const nodesChildren = [];
          for (let j = 0; j < departmentListwh.length; j += 1) {
            if (departmentListwh[j].parentdepartment === departmentListwh[i].cdepartmentid && departmentListwh[j].nlevel === '3') {
              const cnode = {};
              cnode.id = departmentListwh[j].cdepartmentid;
              cnode.name = departmentListwh[j].deptshortname;
              cnode.grade = '3';
              const thirdChildren = [];
              for (let k = 0; k < departmentListwh.length; k += 1) {
                if (departmentListwh[k].parentdepartment === departmentListwh[j].cdepartmentid && departmentListwh[k].nlevel === '4') {
                  const tnode = {};
                  tnode.id = departmentListwh[k].cdepartmentid;
                  tnode.name = departmentListwh[k].deptshortname;
                  tnode.grade = '4';
                  // 没有子节点,只有三级,所以下级(3级的node)children设置null
                  tnode.children = null;
                  thirdChildren.push(tnode);
                }
              }
              cnode.children = thirdChildren;
              nodesChildren.push(cnode);
            }
          }
          aNode.children = nodesChildren;
          nodes.push(aNode);
        }
      }
      rootNode.children = nodes;
      rootArray.push(rootNode);

      return { ...state, departmentListwh: rootArray, deptList: departmentListwh, expandedKeys };
    },
    getDepartmentSuccessLJF(state, action) {
      const { departmentList } = action.payload;
      const expandedKeys = [];
      const rootNode = {};
      const rootArray = [];
      const nodes = [];
      let firstID;
      // 李俊锋的方法生成组织架构树 请联系QQ号：182449。避免了空子节点（没有parent的节点）的加载
      for (let i = 0; i < departmentList.length; i += 1) {
        if (departmentList[i].nlevel === '1') {
          rootNode.id = departmentList[i].cdepartmentid;
          rootNode.name = departmentList[i].deptshortname;
          rootNode.grade = '1';
          expandedKeys.push(departmentList[i].cdepartmentid);
          firstID = departmentList[i].cdepartmentid;
        } else if (departmentList[i].parentdepartment === firstID && departmentList[i].nlevel === '2') {
          const aNode = {};
          aNode.id = departmentList[i].cdepartmentid;
          aNode.name = departmentList[i].deptshortname;
          aNode.grade = '2';
          const nodesChildren = [];
          for (let j = 0; j < departmentList.length; j += 1) {
            if (departmentList[j].parentdepartment === departmentList[i].cdepartmentid && departmentList[j].nlevel === '3') {
              const cnode = {};
              cnode.id = departmentList[j].cdepartmentid;
              cnode.name = departmentList[j].deptshortname;
              cnode.grade = '3';
              const thirdChildren = [];
              for (let k = 0; k < departmentList.length; k += 1) {
                if (departmentList[k].parentdepartment === departmentList[j].cdepartmentid && departmentList[k].nlevel === '4') {
                  const tnode = {};
                  tnode.id = departmentList[k].cdepartmentid;
                  tnode.name = departmentList[k].deptshortname;
                  tnode.grade = '4';
                  // 没有子节点,只有三级,所以下级(3级的node)children设置null
                  tnode.children = null;
                  thirdChildren.push(tnode);
                }
              }
              cnode.children = thirdChildren;
              nodesChildren.push(cnode);
            }
          }
          aNode.children = nodesChildren;
          nodes.push(aNode);
        }
      }
      rootNode.children = nodes;
      rootArray.push(rootNode);

      return { ...state, departmentList: rootArray, deptList: departmentList, expandedKeys };
    },
    getOperatorListSuccess(state, action) {
      const { userList, userTotalCount, userListPagenation } = action.payload;
      // console.log(JSON.stringify(userList));
      return {
        ...state,
        userList,
        userTotalCount,
        userListPagenation: { ...userListPagenation, current: 1, total: userTotalCount },
      };
    },
    handleResetSuccess(state, action) {
      const { selectedUser } = action.payload;
      return { ...state, selectedUser };
    },

    onSelectUserChange(state, action) {
      const { selectedUser, userEditFlag, selectedRoleKeys } = action.payload;
      return { ...state, selectedUser, userEditFlag, selectedRoleKeys };
    },
    addOperatorSuccess(state, action) {
      const { selectedUser, userEditFlag } = action.payload;
      return { ...state, selectedUser, userEditFlag };
    },
    updateOperatorSuccess(state, action) {
      const { selectedUser, userEditFlag } = action.payload;
      return { ...state, selectedUser, userEditFlag };
    },
    updateSelUser(state, action) {
      const { selectedUser } = action.payload;
      return { ...state, selectedUser };
    },
    selDeptInfoChange(state, action) {
      const { dept } = action.payload;
      return { ...state, selDeptInfo: dept };
    },
    queryParamsChange(state, action) {
      const { queryParams } = action.payload;
      return { ...state, queryParams };
    },
    setSelectedRoleKeysSuccess(state, action) {
      const { selectedRoleKeys, selectedUser } = action.payload;
      return { ...state, selectedRoleKeys, selectedUser };
    },
    setSelectedUserKeysSuccess(state, action) {
      const { selectedUserKeys, selectedUserRows } = action.payload;
      return { ...state, selectedUserKeys, selectedUserRows };
    },
    updateUserListPagenation(state, action) {
      const userListPagenation = action.payload;
      return { ...state, userListPagenation };
    },
    changeUserEditFlag(state, action) {
      const { userEditFlag } = action.payload;
      return { ...state, userEditFlag };
    },
  },
  effects: {
    *getDepartmentList({ payload }, { call, put }) {
      const data = yield call(getDepartmentList, payload);
      if (data) {
        yield put({
          type: 'getDepartmentSuccess',
          payload: {
            departmentList: data.deptList,
          },
        });
      }
    },
    *getDepartmentListJGJ({ payload }, { call, put }) {
      const data = yield call(getDepartmentListJGJ, payload);
      if (data) {
        yield put({
          type: 'getDepartmentSuccessLJF',
          payload: {
            departmentList: data.deptList,
          },
        });
      }
    },
    *getDepartmentListWH({ payload }, { call, put }) {
      const data = yield call(getDepartmentListWeiHuJianShe, payload);
      if (data) {
        yield put({
          type: 'getDepartmentSuccessWHSG',
          payload: {
            departmentListwh: data.deptList,
          },
        });
      }
    },
    *getOperatorList({ payload }, { call, put }) {
      yield put({
        type: 'getOperatorListSuccess',
        payload: {
          userList: [],
          userTotalCount: 0,
          queryParams: payload,
        },
      });
      const data = yield call(getOperatorList, payload);
      if (data) {
        yield put({
          type: 'getOperatorListSuccess',
          payload: {
            userList: data.userList,
            userTotalCount: data['x-total-count'],
            queryParams: payload,
          },
        });
        yield put({
          type: 'setSelectedUserKeysSuccess',
          payload: {
            selectedUserKeys: [],
            selectedUserRows: [],
          },
        });
      }
    },
    *handleReset({ payload }, { call, put }) {
      /* yield put({
        type: 'handleResetSuccess',
        payload: {
          /!* userList: [],
          userTotalCount: 0, *!/
        },
      }); */
    },

    *selectUserChange({ payload }, { call, put }) {
      yield put({ // 转换一次flag 防止AccountInfo 下 roleList 刷新无效
        type: 'changeUserEditFlag',
        payload: {
          userEditFlag: 1,
        },
      });
      const data = yield call(getUserRoles, { nuserid: payload.selectedUser.nuserid });
      const selUser = { ...payload.selectedUser };
      let rolenames = '';
      if (data && payload.selectedUser.nuserid) {
        const roleids = [];
        for (let i = 0; i < data.roles.length; i += 1) {
          rolenames += `${data.roles[i].rolename}/`;
          roleids.push(data.roles[i].roleid);
        }
        if (rolenames.length > 0) rolenames = rolenames.substring(0, rolenames.length - 1);
        selUser.role = rolenames;
        selUser.roleids = roleids;
        // selUser.roleList = data.roles;
        selUser.rolelist = data.roles;
      }
      if (payload.userEditFlag !== 2 && payload.selectedUser.nuserid) {
        const ipData = yield call(findIPList, {
          userId: payload.selectedUser.nuserid,
          fuzzy: true,
        });
        if (ipData) {
          selUser.ipList = ipData.list;
        }
      }

      yield put({
        type: 'onSelectUserChange',
        payload: {
          selectedUser: selUser,
          userEditFlag: payload.userEditFlag,
          selectedRoleKeys: selUser.roleids || [],
        },
      });
    },
    *addOperator({ payload }, { call, put, select }) {
      yield put({
        type: 'updateSelUser',
        payload: {
          selectedUser: payload,
        },
      });
      const data = yield call(addOperator, payload);
      console.log(JSON.stringify(data));
      if (data.result === 1) {
        yield put({
          type: 'addOperatorSuccess',
          payload: {
            userEditFlag: 3,
            selectedUser: payload,
          },
        });
        notification.success({ message: '保存成功！' });
        const queryParams = yield select(state => state.accountmanage.queryParams);
        const selDeptInfo = yield select(state => state.accountmanage.selDeptInfo);
        const params = { ...queryParams, ...selDeptInfo };
        yield put({
          type: 'getOperatorList',
          payload: params,
        });
        /* const result = yield call(getOperatorList, params);
        if (result) {
          yield put({
            type: 'getOperatorListSuccess',
            payload: {
              userList: result.userList,
              userTotalCount: result['x-total-count'],
              queryParams,
            },
          });
        } */
      } else if (data.result === 2) {
        notification.error({ message: '用户名已存在，保存失败！' });
      } else if (data.result === 3) {
        notification.error({ message: '授权用户数量达到上限，保存失败！' });
      } else {
        notification.error({ message: '保存失败！' });
      }
    },
    *updateOperator({ payload }, { call, put, select }) {
      yield put({
        type: 'updateSelUser',
        payload: {
          selectedUser: payload,
        },
      });
      const data = yield call(updateOperator, payload);
      if (data.result) {
        yield put({
          type: 'updateOperatorSuccess',
          payload: {
            userEditFlag: 1,
            selectedUser: payload,
          },
        });
        notification.success({ message: '保存成功！' });
        /* const curUser = yield select(state => state.common.curUser);
        if (curUser.nuserid === payload.nuserid) {
          yield put({
            type: 'selDeptInfoChange',
            payload: {
              cdepartmentid: payload.cdepartmentid,
              nlevel: payload.nlevel,
            },
          });
        } */
        const queryParams = yield select(state => state.accountmanage.queryParams);
        const selDeptInfo = yield select(state => state.accountmanage.selDeptInfo);
        const params = { ...queryParams, ...selDeptInfo };
        yield put({
          type: 'getOperatorList',
          payload: params,
        });
        /* const result = yield call(getOperatorList, params);
        if (result) {
          yield put({
            type: 'getOperatorListSuccess',
            payload: {
              userList: result.userList,
              userTotalCount: result['x-total-count'],
              queryParams,
            },
          });
        } */
      } else {
        notification.error({ message: '保存失败！' });
      }
    },
    *findIPList({ payload }, { call, put }) {
      const data = yield call(findIPList, payload);
      if (data) {
        yield put({
          type: 'findIPListSuccess',
          payload: {
          },
        });
      }
    },
    *setSelDeptInfo({ payload }, { call, put }) {
      yield put({
        type: 'selDeptInfoChange',
        payload: { dept: { ...payload } },
      });
    },
    *setQueryParams({ payload }, { call, put }) {
      yield put({
        type: 'queryParamsChange',
        payload,
      });
    },
    *setSelectedRoleKeys({ payload }, { call, put }) {
      yield put({
        type: 'setSelectedRoleKeysSuccess',
        payload,
      });
    },
    *setSelectedUserKeys({ payload }, { call, put }) {
      yield put({
        type: 'setSelectedUserKeysSuccess',
        payload,
      });
    },
    *onUserListPageChange({ payload }, { call, put }) {
      yield put({
        type: 'updateUserListPagenation',
        payload,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/AccountManage') {
          dispatch({
            type: 'getDepartmentList',
          });
          /* dispatch({
            type: 'getOperatorList',
            payload: { userid: '', username: '' },
          }); */
        }
      });
    },
  },
};
