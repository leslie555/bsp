/**
 * Created by Administrator on 2018/7/25.
 */
import request from '../../utils/request';

export async function queryPoliceListService(params) {
  return request('/HiatmpPro/bsp/police/getPolice4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryPoliceListService1(params) {
  return request('/HiatmpPro/bsp/police/getPolice14React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}


export async function queryDepartmentListService(params) {
  return request('/HiatmpPro/bsp/police/getDept4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryGpsListService(params) {
  return request('/HiatmpPro/bsp/police/getGps4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryAllDepartMent() {
  return request('/HiatmpPro/bsp/police/queryAllDepartMent', {
    method: 'POST',
    body: JSON.stringify(),
  });
}

// 添加和修改警员信息
export async function savePolice(params) {
  return request('/HiatmpPro/bsp/police/savePolice4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 删除警员
export async function deletePolice(params) {
  return request('/HiatmpPro/bsp/police/updatePolicesStatus4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 提交审批
export async function auditPolice(params) {
  return request('/HiatmpPro/bsp/police/updateAuditStatus4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 审批
export async function onAudit(params) {
  return request('/HiatmpPro/bsp/police/updateAuditStatus4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 检测GPS设备是否已经被其他警员配置过
export async function checkGPSUnique(params) {
  return request('/HiatmpPro/bsp/police/checkGPSUnique4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
