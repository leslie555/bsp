/**
 * Created by cherry on 2018/7/20.
 */
import { message } from 'antd';
import { GaoFeng } from '../services/octQueryMainRoad';

export default {
  namespace: 'octQueryMainRoad',
  state: {
    list: [],
    excel: false,
    groupCount: 0,
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
    // 查询主要干道高峰期机动车通行效率
    *query({ payload }, { call, put }) {
      const { queryobj = {} } = payload;
      const obj = { ...queryobj };
      const data = yield call(GaoFeng, obj);
      if (data && data.result) {
        console.log(data.list);
        const NewArr1 = []; // 早高峰
        const NewArr2 = []; // 晚高峰
        data.list[0].forEach(e => {
          const item0 = {};
          const item1 = {};
          item0.cdate = e.collection_date;
          item1.cdate = e.collection_date;
          item0.ctime = e.time_frame;
          item1.ctime = e.time_frame;
          item0.groupname = e.groupname;
          item1.groupname = e.groupname;
          item0.speedtype = '最大速度';
          item1.speedtype = '最小速度';
          item0.speeddeviceid = e.max_speed_device;
          item1.speeddeviceid = e.min_speed_device;
          item0.speedvalue = e.max_speed;
          item1.speedvalue = e.min_speed;
          item0.speedaverage = e.avg_speed;
          item1.speedaverage = e.avg_speed;
          item0.flowtype = '最大流量';
          item1.flowtype = '最小流量';
          item0.flowdeviceid = e.max_flow_device;
          item1.flowdeviceid = e.min_flow_device;
          item0.flowvalue = e.max_flow;
          item1.flowvalue = e.min_flow;

          NewArr1.push(item0);
          NewArr1.push(item1);
        });
        data.list[1].forEach(e => {
          const item2 = {};
          const item3 = {};
          item2.cdate = e.collection_date;
          item3.cdate = e.collection_date;
          item2.ctime = e.time_frame;
          item3.ctime = e.time_frame;
          item2.groupname = e.groupname;
          item3.groupname = e.groupname;
          item2.speedtype = '最大速度';
          item3.speedtype = '最小速度';
          item2.speeddeviceid = e.max_speed_device;
          item3.speeddeviceid = e.min_speed_device;
          item2.speedvalue = e.max_speed;
          item3.speedvalue = e.min_speed;
          item2.speedaverage = e.avg_speed;
          item3.speedaverage = e.avg_speed;
          item2.flowtype = '最大流量';
          item3.flowtype = '最小流量';
          item2.flowdeviceid = e.max_flow_device;
          item3.flowdeviceid = e.min_flow_device;
          item2.flowvalue = e.max_flow;
          item3.flowvalue = e.min_flow;

          NewArr2.push(item2);
          NewArr2.push(item3);
        });
        yield put({
          type: 'updateState',
          payload: {
            queryobj,
            resultlist1: NewArr1,
            resultlist2: NewArr2,
            excel: data.excel,
            groupCount: data.groupCount,
          },
        });
      } else {
        message.error('查询失败，请联系管理员！');
      }
    },
  },
};
