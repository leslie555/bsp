import { message } from 'antd';
import { getAllLayers } from '../services/layerConfig';

export default {
  namespace: 'layerConfigModel',
  state: {
    list: [],
    info: {},
    flag: false,
    showJtsb: [], // 交通设备
    showJtlk: [], // 交通路况
    showQwfq: [], // 勤务分区
    showJgxx: [], // 交管信息
    showJtss: [], // 交通设施
    showJjxq: [], // 交警辖区
    showJtjc: [], // 交通基础
    showYjzy: [], // 应急资源
    showAll: [], // 所有的图层
    allJtsb: [], // 所有交通设备
    allJtlk: [],
    allQwfq: [],
    allJgxx: [],
    allJtss: [],
    allJjxq: [],
    allJtjc: [],
    allYjzy: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showtotal: total => `共 ${total} 条`,
      current: 1,
      pagesize: 10,
      total: null,
      onShowSizeChange: () => {
        setTimeout(() => {
          window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
        }, 1000);
      },
    },
    queryobj: {
      userId: '',
    },
    checkedarr: [],
  },
  reducers: {
    getSelectedRows(state, action) {
      return { ...state };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    showLayers(state, action) {
      const { list,
        flag,
        allLayer,
        showJtsb,
        showJtlk,
        showQwfq,
        showJgxx,
        showJtss,
        showJjxq,
        showJtjc,
        allJtsb,
        allJtlk,
        allQwfq,
        allJgxx,
        allJtss,
        allJjxq,
        allJtjc,
        allYjzy,
        showYjzy } = action.payload;
      console.log(state);
      return {
        ...state,
        flag,
        list,
        showJtsb,
        showJtlk,
        showQwfq,
        showJgxx,
        showJtss,
        showJjxq,
        showJtjc,
        showYjzy,
        allLayer,
        allJtsb,
        allJtlk,
        allQwfq,
        allJgxx,
        allJtss,
        allJjxq,
        allJtjc,
        allYjzy,
      };
    },
  },
  effects: {
    // 获取选中的行数组
    *returnSelectedKeys({ payload }, { put }) {
      yield put({
        type: 'getSelectedRows',
        payload: {
        },
      });
    },
    // 获取图层列表
    *queryAllLayers({ payload }, { call, put }) {
      const data = yield call(getAllLayers, payload);
      console.log('12344');
      if (data.result) {
        const flag = data.auth;
        if (data.auth) {
          console.log(data);
          const showJtsb = []; // 交通设备
          const showJtlk = [];// 交通路况
          const showQwfq = [];// 勤务分区
          const showJgxx = [];// 交管信息
          const showJtss = [];// 交通设施
          const showJjxq = [];// 交警辖区
          const showJtjc = [];// 交通基础
          const showYjzy = [];// 应急资源
          const allLayer = []; // 所有的图层
          const allJtsb = []; // 所有交通设备
          const allJtlk = [];
          const allQwfq = [];
          const allJgxx = [];
          const allJtss = [];
          const allJjxq = [];
          const allJtjc = [];
          const allYjzy = [];
          for (let i = 0; i < data.result.length; i += 1) {
            if (data.result[i].lidstr.length != 1) {
              if (data.result[i].ishiddenstr == '0') {
                if (data.result[i].lidstr[0] == '1') {
                  showJtsb.push(data.result[i].lidstr);
                } else if (data.result[i].lidstr[0] == '2') {
                  showJtlk.push(data.result[i].lidstr);
                } else if (data.result[i].lidstr[0] == '3') {
                  showQwfq.push(data.result[i].lidstr);
                } else if (data.result[i].lidstr[0] == '4') {
                  showJgxx.push(data.result[i].lidstr);
                } else if (data.result[i].lidstr[0] == '5') {
                  showJtss.push(data.result[i].lidstr);
                } else if (data.result[i].lidstr[0] == '6') {
                  showJjxq.push(data.result[i].lidstr);
                } else if (data.result[i].lidstr[0] == '7') {
                  showJtjc.push(data.result[i].lidstr);
                } else {
                  showYjzy.push(data.result[i].lidstr);
                }
              }
              if (data.result[i].lidstr[0] == '1') {
                allJtsb.push(data.result[i].lidstr);
              } else if (data.result[i].lidstr[0] == '2') {
                allJtlk.push(data.result[i].lidstr);
              } else if (data.result[i].lidstr[0] == '3') {
                allQwfq.push(data.result[i].lidstr);
              } else if (data.result[i].lidstr[0] == '4') {
                allJgxx.push(data.result[i].lidstr);
              } else if (data.result[i].lidstr[0] == '5') {
                allJtss.push(data.result[i].lidstr);
              } else if (data.result[i].lidstr[0] == '6') {
                allJjxq.push(data.result[i].lidstr);
              } else if (data.result[i].lidstr[0] == '7') {
                allJtjc.push(data.result[i].lidstr);
              } else {
                allYjzy.push(data.result[i].lidstr);
              }
            }

            allLayer.push(data.result[i].lidstr);
          }
          yield put({
            type: 'showLayers',
            payload: {
              flag,
              list: data.result,
              showJtsb,
              showJtlk,
              showQwfq,
              showJgxx,
              showJtss,
              showJjxq,
              showJtjc,
              showYjzy,
              allLayer,
              allJtsb,
              allJtlk,
              allQwfq,
              allJgxx,
              allJtss,
              allJjxq,
              allJtjc,
              allYjzy,
            },
          });
        } else {
          message.error('您没有权限查看此页面，请联系管理员！');
        }
      } else {
        message.error('查询数据出错！');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/layerConfig') {
          dispatch({
            type: 'queryAllLayers',
            payload: {},
          });
        }
      });
    },
  },
};
