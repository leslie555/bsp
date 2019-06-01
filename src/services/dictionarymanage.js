/**
 * Created by cherry on 2018/7/4.
 */
import request from '../utils/request';
// 查询枚举类型
export async function findAllEnumType(params) {
  return request('/HiatmpPro/bsp/dm/findAllEnumType', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询枚举成员
export async function findEnumMem(params) {
  return request('/HiatmpPro/bsp/dm/findEnumMem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除枚举类型
export async function deleteEnum(params) {
  return request('/HiatmpPro/bsp/dm/deleteEnum', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 添加枚举类型
export async function addEnum(params) {
  return request('/HiatmpPro/bsp/dm/saveEnum', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑枚举类型
export async function editEnum(params) {
  return request('/HiatmpPro/bsp/dm/editEnum', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除枚举成员
export async function deleteEnumMem(params) {
  return request('/HiatmpPro/bsp/dm/delEnumMem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 添加枚举成员
export async function addEnumMem(params) {
  return request('/HiatmpPro/bsp/dm/saveEnumMem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑枚举成员
export async function editEnumMem(params) {
  return request('/HiatmpPro/bsp/dm/editEnumMem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
