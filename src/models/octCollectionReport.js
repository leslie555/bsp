/**
 * Created by xr on 2019/2/27.
 */
import { message, Select } from 'antd';
import { query, querydevicegroup } from '../services/octCollectionReportService';

export default {
  namespace: 'octCollectionReport',
  state: {
    list: [], // 默认的data
    detaileList: [], // 详情list
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
    // 查询质量报告
    *getCollectionReportData({ payload }, { call, put }) {
      const { pagination = {} } = payload;
      const { queryobj = {} } = payload;
      const obj = { ...queryobj, pagination };
      const data = yield call(query, obj);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            list: data.list,
            pagination: data.pagination,
          },
        });
        console.log(data);
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
    // 查询分组
    *querydevicegroup({ payload }, { call, put }) {
      const data = yield call(querydevicegroup, payload);
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
            Data: options,
          },
        });
      }
    },
  },
  subscriptions: {
  },
};
