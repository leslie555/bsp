/**
 * Created by Administrator on 2018/7/25.
 */
import { message } from 'antd';
import { queryPoliceListService, queryDepartmentListService, queryGpsListService, savePolice, deletePolice, auditPolice, onAudit } from '../services/policeManage/policeManageService';

export default {
  namespace: 'policemanage',
  state: {
    queryobj: { auditstate: '-1', isEffective: '-1', policeid: '', policename: '', policetype: '-1' },
    currentDepartmentId: '-1',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showtotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 10,
      total: 0,
      onShowSizeChange: () => {
        setTimeout(() => {
          window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
        }, 1000);
      },
    },
    deptList: [], // 部门列表
    departmentList: [], // 组织架构树
    gpsList: [],
    expandedKeys: [], // 默认展开的节点
    policeList: [],
    recordInfo: {},
    allDepartmentList: [],
    gpsSelectList: [],
    defaultDeptId: '', // 若有值 则说明是大队、中队用户登录 值为大队deptid
  },


  reducers: {
    getDepartmentListSuccess(state, action) {
      const { departmentList, allDeptList } = action.payload;
      const expandedKeys = [];
      const rootNode = {};
      const rootArray = [];
      const nodes = [];
      // 生成组织架构树 方法取自5.0
      for (let i = 0; i < departmentList.length; i += 1) {
        if (departmentList[i].nlevel === '1') {
          rootNode.id = departmentList[i].cdepartmentid;
          rootNode.name = departmentList[i].deptshortname;
          rootNode.grade = '1';
          expandedKeys.push(departmentList[i].cdepartmentid);
        } else if (departmentList[i].nlevel === '2') {
          const aNode = {};
          aNode.id = departmentList[i].cdepartmentid;
          aNode.name = departmentList[i].deptshortname;
          aNode.grade = '2';
          expandedKeys.push(departmentList[i].cdepartmentid);
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
        } else if (!rootNode.id) {
          rootNode.id = departmentList[i].cdepartmentid;
          rootNode.name = departmentList[i].deptshortname;
          rootNode.grade = '1';
          expandedKeys.push(departmentList[i].cdepartmentid);
        }
      }
      rootNode.children = nodes;
      rootArray.push(rootNode);
      let defaultDeptId = '-2';
      if (departmentList.length > 1) { // 全部
        defaultDeptId = '-1';//
      } else if (departmentList.length === 1) {
        defaultDeptId = departmentList[0].cdepartmentid;
      }
      return { ...state,
        departmentList: rootArray,
        deptList: departmentList,
        expandedKeys,
        currentDepartmentId: defaultDeptId,
        allDepartmentList: allDeptList,
        defaultDeptId };
    },

    getGpsListSuccess(state, action) {
      const { gpsList } = action.payload;
      return { ...state, gpsList };
    },


    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  effects: {
    *queryDepartmentList({ payload }, { call, put }) {
      const result = yield call(queryDepartmentListService, payload);
      if (result && result.result.result) {
        console.log(result);
        yield put({
          type: 'getDepartmentListSuccess',
          payload: {
            departmentList: result.result.departmentList,
            allDeptList: result.result.allDeptList,
          },
        });
      }
    },


    *getGpsList({ payload }, { call, put }) {
      const result = yield call(queryGpsListService, payload);
      if (result && result.result.result) {
        yield put({
          type: 'getGpsListSuccess',
          payload: {
            gpsList: result.result.gpstList,
          },
        });
      }
    },
    * query({ payload }, { call, put }) {
      const { query = {} } = payload;
      const { currentDepartmentId } = payload;
      const { page = {} } = payload;
      const params = { ...query, currentDepartmentId, page };
      console.log(params);
      const data = yield call(queryPoliceListService, params);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj: query,
            currentDepartmentId,
            policeList: data.policeList,
            recordInfo: {},
            gpsSelectList: [],
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    *savePolice({ payload }, { call, put }) {
      const data = yield call(savePolice, payload);
      return yield data;
    },
    // 删除警员
    *deletePolice({ payload }, { call, put }) {
      const data = yield call(deletePolice, payload);
      return yield data;
    },
    // 提交审批
    *submitAuditPolice({ payload }, { call, put }) {
      const data = yield call(auditPolice, payload);
      return yield data;
    },
    // 审批
    *auditPolice({ payload }, { call, put }) {
      const data = yield call(onAudit, payload);
      return yield data;
    },
  },

  /* subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        console.log(location.pathname);
        if (location.pathname === '/policeManage') {
          dispatch({
            type: 'queryDepartmentList',
          });
        }
      });
      history.listen((location) => {
        if (location.pathname === '/policeManage') {
          dispatch({
            type: 'getGpsList',
          });
        }
      });
    },
  }, */

};
