/**
 * Created by cherry on 2018/7/20.
 */
import { message, Modal } from 'antd';
import { queryAllGroup,
  queryDeviceByGroup,
  HierarchyGetall,
  HierarchyGetallExceptLeaf,
  deleteDevice, getResourceAllTree,
  AreaChildren,
  GetDeviceByRoadIDSum, SaveStatisticQuery, AreaDetail } from '../services/octDeviceGroup';

export default {
  namespace: 'octAreaDetail',
  state: {
    nodeInfo: {},
    queryobj: {
      id: '',
    },
    selectGroupId: '',
    selectGroupLevel: null,
    groupinfo: {},

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
    devicelist: [],
    roadtree: [],
    activeKey: '1',
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    initState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    selectedRowKeys(state, action) {
      const { id, desc, name } = action.payload.nodeInfo;
      const tempList = state.operateList;
      const showOperate = [];
      tempList.forEach((n, index) => {
        if (n.MENU_ID === id) {
          showOperate.push(n);
        }
      });
      return {
        ...state,
        selectGroupId: id,
        // selectMenuLevel: desc,
        selectGroupName: name,
        selectGroupDesc: desc,
        currOperateList: showOperate,
        operateRight: [],
      };
    },
    addSon(state) {
      return { ...state, nodeInfo: [] };
    },
  },
  effects: {
    // 所有分组
    // *queryAllGroup({ payload }, { call, put }) {
    //   const { pagination = {} } = payload;
    //   const { queryobj = {} } = payload;
    //   const obj = { ...queryobj, pagination };
    //   const data = yield call(queryAllGroup, obj);
    //   if (data && data.result) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         queryobj,
    //         resultlist: data.list,
    //         // pagination: data.pagination,
    //       },
    //     });
    //   } else {
    //     message.error('查询失败，请联系管理员！');
    //   }
    // },
    // 获取资源授权树
    *getResourceTree({ payload }, { call, put }) {
      const { roleinfo = {} } = payload;
      const data = yield call(getResourceAllTree, { editRoleID: roleinfo.roleid });
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            roadtree: data.doc.children,
            resourceChecked: data.checkedArr ? data.checkedArr : [],
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 分组下的设备
    *queryDeviceByGroup({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryDeviceByGroup, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            devicelist: data.list,
            pagination: data.pagination,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 总的设备
    *queryDeviceByGroupsum({ payload }, { call, put }) {
      const data = yield call(GetDeviceByRoadIDSum, payload);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            devicelistsum: data.list,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 删除设备
    *deleteDevice({ payload }, { call, put }) {
      const { deviceid, id } = payload;
      const data = yield call(deleteDevice, { deviceid, id });
      return yield data;
    },
    // 得到树形结构
    *queryMenuList({ payload }, { call, put }) {
      const data = yield call(AreaChildren, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            menuList: data.treeall,
          },
        });
      }
    },
    // 保存分组对应查询关系
    *SaveStatisticQuery({ payload }, { call, put }) {
      let data = yield call(SaveStatisticQuery, payload);
      if (data.result) {
        Modal.success({
          title: '保存成功',
          content: data.info,
        });
        data = yield call(HierarchyGetall);
        if (data.result) {
          yield put({
            type: 'updateState',
            payload: {
              menuList: data.list,
            },
          });
        }
      } else {
        Modal.error({
          title: '错误',
          content: data.info,
        });
      }
    },
    // 得到非叶子节点的树形结构
    *queryMenuListExceptLeaf({ payload }, { call, put }) {
      const data = yield call(HierarchyGetallExceptLeaf, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            menuList: data.list,
          },
        });
      }
    },
    // 区域
    *AreaDetail({ payload }, { call, put }) {
      const data = yield call(AreaDetail, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            resultlist: data.list,
            statistics: data.statistics,
          },
        });
      }
    },
    // 区域清空
    *AreaDetailClear({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          resultlist: [],
          statistics: null,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/department') {
          dispatch({
            type: 'getAllDepartmentsList',
          });
        }
      });
    },
  },
};
