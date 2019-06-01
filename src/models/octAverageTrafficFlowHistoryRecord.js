/**
 * Created by xr on 2019/2/27.
 */
import { message, Select } from 'antd';
import { queryGetTreeOnlyLeaf, queryAverageTrafficFlowHistoryRecord } from '../services/octCollectionReportService';

export default {
  namespace: 'octAverageTrafficFlowHistoryRecord',
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
    // 得到设备分组
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
    // 查询过车历史记录
    *queryAverageTrafficFlowHistoryRecord({ payload }, { call, put }) {
      const data = yield call(queryAverageTrafficFlowHistoryRecord, payload);
      if (data.result) {
        yield put({
          type: 'updateState',
          payload: {
            resultlist: data.list,
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
