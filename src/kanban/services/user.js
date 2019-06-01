import request from 'utils/request';

export async function queryCurrent() {
  return request('/HiatmpPro/wbc/common/currentUser', {
    method: 'post',
    body: '',
  });
}
export async function getUserTheme() {
  return request('/HiatmpPro/wbc/theme/getUserTheme', {
    method: 'post',
    body: '',
  });
}
export async function saveUserTheme(params) {
  return request('/HiatmpPro/wbc/theme/saveUserTheme', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function menusSaveUpdate(params) {
  return request('/HiatmpPro/wbc/fastMenu/updateFastMenuList', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function saveUserCharts(params) {
  return request('/HiatmpPro/wbc/chart/saveUserCharts', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function getIllegalCount(params) {
  return request('/HiatmpPro/wbc/chart/getIllegalCount', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function getAllCharts() {
  return request('/HiatmpPro/wbc/chart/getAllCharts', {
    method: 'post',
    body: '',
  });
}
export async function getNoticeList() {
  return request('/HiatmpPro/wbc/common/getNoticeList', {
    method: 'post',
    body: '',
  });
}
export async function getToDoList(params) {
  return request('wbc/common/getToDoList', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function cancelTodo(params) {
  return request('/HiatmpPro/wbc/common/cancelTodo', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function getNoticeInfo(params) {
  return request('/HiatmpPro/wbc/common/getNoticeInfo', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function updateNoticeReadStatus(params) {
  return request('/HiatmpPro/wbc/common/updateNoticeReadStatus', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function signIn(params) {
  return request('/HiatmpPro/wbc/common/signIn', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function getMapUrl() {
  return request('/HiatmpPro/wbc/common/getMapUrl', {
    method: 'post',
    body: '',
  });
}
// 获取当前时刻两小时之内的待审核警情数 5.8需求
export async function getEventCount2Audit() {
  return request('/HiatmpPro/wbc/chart/getEventCount2Audit', {
    method: 'post',
    body: '',
  });
}
// 当前时刻视频巡检总量 5.8需求
export async function getVedioPatrolCount() {
  return request('/HiatmpPro/wbc/chart/getVedioPatrolCount', {
    method: 'post',
    body: '',
  });
}
// 获取当天到当前时刻警情上报数 5.8需求
export async function getEventReportCount() {
  return request('/HiatmpPro/wbc/chart/getEventReportCount', {
    method: 'post',
    body: '',
  });
}
// 获取密码复杂度校验开关系统参数
export async function getPwdComplexityParam() {
  return request('/HiatmpPro/wbc/common/getPwdComplexityParam', {
    method: 'GET',
  });
}
