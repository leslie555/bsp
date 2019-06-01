/**
 * Created by cherry on 2018/7/20.
 */
import { Select, message } from 'antd';
import { queryGetTreeOnlyLeaf, queryProjectDeviceDetail, queryDetails } from '../services/octCollectionReportService';

export default {
  namespace: 'octProjectDeviceDetail',
  state: {
    treeData: [],
    departmentlist: [],
    departmentinfo: {},
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
    // 获取设备分组
    *queryMenuList({ payload }, { call, put }) {
      const data = yield call(queryGetTreeOnlyLeaf, payload);
      const { Option } = Select;
      const options = [];
      if (data.result) {
        if (data.list) {
          options.push(<Option value="">全部类型</Option>);
          for (let i = 0; i < data.list.length; i += 1) {
            options.push(
              <Option
                key={data.list[i].id}
                value={data.list[i].id}
              >
                {data.list[i].groupName}
              </Option>
            );
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            treeData: options,
          },
        });
      }
    },
    // 查询采集设备详情
    *queryProjectDeviceDetail({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(queryProjectDeviceDetail, obj);
      console.log(data);
      console.log(obj);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            resultlist: data.list,
            pagination: data.pagination,
          },
        });
      }
    },
    // 查询采集设备详情
    *queryDetails({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { obj1 = {} } = payload;
      const obj = { ...obj1, pagination };
      const data = yield call(queryDetails, obj);
      console.log(data);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            obj1, // 导出的参数
            dataSource: data.list,
            pagination: data.pagination,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/department') {
          dispatch({
            type: 'getAllDeviceList',
          });
        }
      });
    },
  },
};
