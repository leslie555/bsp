import request from 'utils/request';
// 重点企业统计数
export async function getSemCount() {
  return request('/HiatmpPro/wbc/chart/getSemCount', {
    method: 'post',
  });
}
// 事故统计数
export async function getVamCount() {
  return request('/HiatmpPro/wbc/chart/getVamCount', {
    method: 'post',
  });
}
// 重点企业分布柱状图
export async function getUintDistribution() {
  return request('/HiatmpPro/wbc/chart/getUintDistribution', {
    method: 'post',
  });
}
// 事故警情数组成
export async function getCaseNumByStage() {
  return request('/HiatmpPro/wbc/chart/getCaseNumByStage', {
    method: 'post',
  });
}
// 本月事故地点排名
export async function getCaseOrderByRoad() {
  return request('/HiatmpPro/wbc/chart/getCaseOrderByRoad', {
    method: 'post',
  });
}
// 勤务管理统计数
export async function getDdmCount() {
  return request('/HiatmpPro/wbc/chart/getDdmCount', {
    method: 'post',
  });
}
// 勤务管理-实时警力分布趋势
export async function getDutyChartData() {
  return request('/HiatmpPro/wbc/chart/getDutyChartData', {
    method: 'post',
  });
}
// 占路施工统计数
export async function getDigroadNum() {
  return request('/HiatmpPro/wbc/chart/getDigroadNum', {
    method: 'post',
  });
}
// 占路施工申请趋势
export async function getDigroadChartData() {
  return request('/HiatmpPro/wbc/chart/getDigroadChartData', {
    method: 'post',
  });
}
// 5.8需求
// 获取当天到当前时刻警情审核总数以及有效警情数、无效警情数、相关警情数、误报警情数、无法确认警情数 5.8需求
export async function getEventCountsAudited() {
  return request('/HiatmpPro/wbc/chart/getEventCountsAudited', {
    method: 'post',
    body: '',
  });
}
