import request from '../utils/request';

// 枚举所有查询
export async function getAllEnumList() {
  return request('/HiatmpPro/bsp/export/getEnumTypeList', {
    method: 'GET',
  });
}
// 查询枚举值列表
export async function getEnumList(params) {
  return request('/HiatmpPro/bsp/common/getEnumList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询用户角色可操作码
export async function getOperateCodes() {
  return request('/HiatmpPro/bsp/common/getOperateCodes', {
    method: 'GET',
  });
}
