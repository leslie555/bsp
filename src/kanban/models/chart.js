import {
  getSemCount,
  getVamCount,
  getUintDistribution,
  getCaseNumByStage,
  getCaseOrderByRoad,
  getDdmCount,
  getDutyChartData,
  getDigroadNum,
  getDigroadChartData,
  getEventCountsAudited,
} from '../services/chartService';
/* eslint-disable   */
/**
 * 重点企业
 * unitCount:重点企业总数
 * vehCount:重点车辆总数
 * driverCount:驾驶人总数
 * totalAlarmCount:预警总数
 * taskCount:本日任务完成数
 * newAlarmCount:本日新增预警数 */
/**
 * 事故管理统计数集合
 * @return
 * 本日新增事故数	：caseNumToday
 * 本月结案事故数	：endCaseNumThisMonth
 * 本月事故总数：	caseNumThisMonth
 * 本月简易事故数：simpleCaseNumThisMonth
 * 本月一般事故数	：nomalCaseNumThisMonth
 * 本月逃逸事故数	：escapeCaseNumThisMonth
 */
/**
 * 交通勤务的统计数
 * @param @return
 * @return JSONObject
 * onlineDutyNum:在线民警总数
 * dutyPoliceNum:执勤警力总数
 * punishNum:本日简易处罚数量
 * forceNum:本日强制措施数量
 * checkNum:本日查车数量
 * dutyRatio:民警到岗率
 * 格式：
 * {"onlineDutyNum":"1","dutyPoliceNum":"2","punishNum":"1","forceNum":"91","checkNum":"127","dutyRatio":"1"}
 */
/**
 * 占路施工
 * monthAddNum：本月新增申请数
 *noApproveNum：待审批总数
 * digroadNum：正在施工数
 * delayDigroadNum：施工延期数
 *
 */
/**
 * B11待办事项
 * toDoList：待办事项
 */


export default {
  namespace: 'chart',
  state: {
    // 重点企业
    unitCount: null,
    vehCount: null,
    driverCount: null,
    totalAlarmCount: null,
    taskCount: null,
    newAlarmCount: null,
    // 重点企业分布柱状图
    unitDistribution: null,
    // 事故管理
    caseNumToday: null,
    endCaseNumThisMonth: null,
    caseNumThisMonth: null,
    simpleCaseNumThisMonth: null,
    nomalCaseNumThisMonth: null,
    escapeCaseNumThisMonth: null,
    // 事故警情数组成
    caseNumByStage: null,
    // 本月事故地点排名
    caseOrderByRoad: null,
    // 勤务管理
    onlineDutyNum: null,
    dutyPoliceNum: null,
    punishNum: null,
    forceNum: null,
    checkNum: null,
    dutyRatio: null,
    // 勤务管理-实时警力分布趋势
    dutyChartData: null,
    // 占路施工
    monthAddNum: null,
    noApproveNum: null,
    digroadNum: null,
    delayDigroadNum: null,
    digroadChartData: null,
 //获取当天到当前时刻警情审核总数以及有效警情数、无效警情数、相关警情数、误报警情数、无法确认警情数
    eventCountAudited:{}
  },
  effects: {
    // 查询所有重点企业的统计数数据
    *querySemCount({ payload }, { call, put }) {
      const data = yield call(getSemCount);
      if (data.returnCode === 0) {
        const unitCount = data.data.unitCount;
        const vehCount = data.data.vehCount;
        const driverCount = data.data.driverCount;
        const totalAlarmCount = data.data.totalAlarmCount;
        const taskCount = data.data.taskCount;
        const newAlarmCount = data.data.newAlarmCount;
        yield put({
          type: 'updateSemCount',
          payload: {
            unitCount,
            vehCount,
            driverCount,
            totalAlarmCount,
            taskCount,
            newAlarmCount,
          },
        });
      }
    },
    // 查询事故管理的统计数数据
    *queryVamCount({ payload }, { call, put }) {
      const data = yield call(getVamCount);
      if (data.returnCode === 0) {
        const caseNumToday = data.data.caseNumToday;
        const endCaseNumThisMonth = data.data.endCaseNumThisMonth;
        const caseNumThisMonth = data.data.caseNumThisMonth;
        const simpleCaseNumThisMonth = data.data.simpleCaseNumThisMonth;
        const nomalCaseNumThisMonth = data.data.nomalCaseNumThisMonth;
        const escapeCaseNumThisMonth = data.data.escapeCaseNumThisMonth;
        yield put({
          type: 'updateVamCount',
          payload: {
            caseNumToday,
            endCaseNumThisMonth,
            caseNumThisMonth,
            simpleCaseNumThisMonth,
            nomalCaseNumThisMonth,
            escapeCaseNumThisMonth,
          },
        });
      }
    },
    // 重点企业分布柱状图
    *queryUnitDistribution({ payload }, { call, put }) {
      const data = yield call(getUintDistribution);
      if (data.returnCode === 0) {
        const unitDistribution = data.data;
        yield put({
          type: 'updateUnitDistribution',
          payload: {
            unitDistribution,
          },
        });
      }
    },
    // 事故警情数组成
    *queryCaseNumByStage({ payload }, { call, put }) {
      const data = yield call(getCaseNumByStage);
      if (data.returnCode === 0) {
        const caseNumByStage = data.data;
        yield put({
          type: 'updateCaseNumByStage',
          payload: {
            caseNumByStage,
          },
        });
      }
    },
    // 本月事故地点排名
    *queryCaseOrderByRoad({ payload }, { call, put }) {
      const data = yield call(getCaseOrderByRoad);
      if (data.returnCode === 0) {
        const caseOrderByRoad = data.data;
        yield put({
          type: 'updateCaseOrderByRoad',
          payload: {
            caseOrderByRoad,
          },
        });
      }
    },
    // 勤务管理统计数
    *queryDdmCount({ payload }, { call, put }) {
      const data = yield call(getDdmCount);
      if (data.returnCode === 0) {
        const dutyPoliceNum = data.data.dutyPoliceNum;
        const punishNum = data.data.punishNum;
        const forceNum = data.data.forceNum;
        // const onlineDutyNum = data.data.onlineDutyNum;
        // const checkNum = data.data.checkNum;
        // const dutyRatio = data.data.dutyRatio;
        yield put({
          type: 'updateDdmCount',
          payload: {
            dutyPoliceNum,
            punishNum,
            forceNum,
            // onlineDutyNum,
            // checkNum,
            // dutyRatio
          },
        });
      }
    },
    // 勤务管理-实时警力分布趋势
    *queryDutyChartData({ payload }, { call, put }) {
      const data = yield call(getDutyChartData);
      if (data.returnCode === 0) {
        const dutyChartData = data.data;
        yield put({
          type: 'updateDutyChartData',
          payload: {
            dutyChartData,
          },
        });
      }
    },
    // 占路施工统计数集合
    *queryDigroadNum({ payload }, { call, put }) {
      const data = yield call(getDigroadNum);
      if (data.returnCode === 0) {
        const monthAddNum = data.data.monthAddNum;
        const noApproveNum = data.data.noApproveNum;
        const digroadNum = data.data.digroadNum;
        const delayDigroadNum = data.data.delayDigroadNum;
        yield put({
          type: 'updateDigroadNum',
          payload: {
            monthAddNum,
            noApproveNum,
            digroadNum,
            delayDigroadNum,
          },
        });
      }
    },
    // 勤务管理-实时警力分布趋势
    *queryDigroadChartData({ payload }, { call, put }) {
      const data = yield call(getDigroadChartData);
      if (data.returnCode === 0) {
        const digroadChartData = data.data;
        yield put({
          type: 'updateDigroadChartData',
          payload: {
            digroadChartData,
          },
        });
      }
    },
    *getEventCountsAudited({ payload }, { call, put }) {
      const result = yield call(getEventCountsAudited, payload);
      if (result?.returnCode == 0) {
        yield put({
          type: 'updateState',
          payload: {
            eventCountAudited: result.eventCountAudited,
          },
        });
      }
    },


  },
  reducers: {
    updateSemCount(state, action) {
      const {
        unitCount,
        vehCount,
        driverCount,
        totalAlarmCount,
        taskCount,
        newAlarmCount,
      } = action.payload;
      return {
        ...state,
        unitCount,
        vehCount,
        driverCount,
        totalAlarmCount,
        taskCount,
        newAlarmCount,
      };
    },
    updateVamCount(state, action) {
      const {
        caseNumToday,
        endCaseNumThisMonth,
        caseNumThisMonth,
        simpleCaseNumThisMonth,
        nomalCaseNumThisMonth,
        escapeCaseNumThisMonth,
      } = action.payload;
      return {
        ...state,
        caseNumToday,
        endCaseNumThisMonth,
        caseNumThisMonth,
        simpleCaseNumThisMonth,
        nomalCaseNumThisMonth,
        escapeCaseNumThisMonth,
      };
    },
    updateUnitDistribution(state, action) {
      const { unitDistribution } = action.payload;
      return { ...state, unitDistribution };
    },
    updateCaseNumByStage(state, action) {
      const { caseNumByStage } = action.payload;
      return { ...state, caseNumByStage };
    },
    updateCaseOrderByRoad(state, action) {
      const { caseOrderByRoad } = action.payload;
      return { ...state, caseOrderByRoad };
    },
    updateDdmCount(state, action) {
      const { dutyPoliceNum, punishNum, forceNum } = action.payload;
      return { ...state, dutyPoliceNum, punishNum, forceNum };
    },
    updateDutyChartData(state, action) {
      const { dutyChartData } = action.payload;
      return { ...state, dutyChartData };
    },
    updateDigroadNum(state, action) {
      const { monthAddNum, noApproveNum, digroadNum, delayDigroadNum } = action.payload;
      return { ...state, monthAddNum, noApproveNum, digroadNum, delayDigroadNum };
    },
    updateDigroadChartData(state, action) {
      const { digroadChartData } = action.payload;
      return { ...state, digroadChartData };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
