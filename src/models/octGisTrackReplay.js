/**
 * Created by Administrator on 2018/7/12.
 */

import { queryDeviceList, queryUrlInfo } from '../services/octGIS';

export default {
  namespace: 'octGisTrackReplay',
  state: {
    devicelist: [],
    urlList: [],
    dold: [],
    policearea: [],
    weihu: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 7,
      total: null,
      onShowSizeChange: (() => {
        setTimeout(() => {
          window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
        }, 1000);
      }),
    },
    allDevice: [],
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
    *queryDeviceList({ payload }, { call, put }) {
      const data = yield call(queryDeviceList, payload);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            devicelist: data.list,
          },
        });
      }
    },
    *queryDownloadInfo({ payload }, { call, put }) {
      const data = yield call(queryUrlInfo, payload);
      if (data && data.result) {
        yield put({
          type: 'updateState',
          payload: {
            urlList: data.pic,
          },
        });
      }
    },
  },
};
