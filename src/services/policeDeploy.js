/**
 * gps警员 相关后台请求 提取自王凤磊的msgtomds.js
 * jingzy 18/7/18
 */
import request from 'utils/request';

export async function sendMsgToMdsRequest(params) {
  return request('/HiatmpPro/assets/request/ist/mds/sendMessage?_g=ist', {
    method: 'get',
    body: JSON.stringify(params),
  });
}
export async function initVideoCtrlRequest(params) {
  return request('/HiatmpPro/assets/request/ist/mds/initMdsConf?_g=ist', {
    method: 'get',
    body: JSON.stringify(params),
  });
}
export async function setCtrlUnUsedRequest(params) {
  return request('/HiatmpPro/assets/request/ist/mds/setCtrlUnUsed?_g=ist', {
    method: 'get',
    body: JSON.stringify(params),
  });
}
export async function setCtrlUsedRequest(params) {
  return request('/HiatmpPro/assets/request/ist/mds/setCtrlUsed?_g=ist', {
    method: 'get',
    body: JSON.stringify(params),
  });
}

export async function saveCaseProcessRequest(params) {
  return request('/HiatmpPro/advancemap/sendToIST', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getSurroundInfoRequest(params) {
  return request('/HiatmpPro/dtpms/expert/getSurroundInfo', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getRootQuestionRequest(params) {
  return request('/HiatmpPro/dtpms/expert/getRootQuestion', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getCaseDetailRequest(params) {
  return request('/HiatmpPro/dtpms/expert/getCaseDetail', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
