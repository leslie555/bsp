import request from '../utils/request';
// 查询列表名单, 用于添加，修改，删除后的查询，不记录日志。
export async function query(params) {
  return request('/HiatmpPro/api/loginrestrict/findToJson', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询列表名单  用于查询，记录日志。
export async function queryToLog(params) {
  return request('/HiatmpPro/api/loginrestrict/queryToJson', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删 除
export async function IPDelete(params) {
  return request('/HiatmpPro/api/loginrestrict/doDeleteToJson', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 批量删除
export async function mulDel(params) {
  return request('/HiatmpPro/api/loginrestrict/doMulDeleteToJson', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 修改
export async function IpEdit(params) {
  return request('/HiatmpPro/api/loginrestrict/editOneToJson', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 添加
export async function IPAdd(params) {
  return request('/HiatmpPro/api/loginrestrict/addOneToJson', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 获取用户信息，用于IP修改和显示
export async function getOperatorList(params) {
  return request('/HiatmpPro/api/loginrestrict/getOperatorList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
