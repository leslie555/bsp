/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 查询部门列表
export async function getAllDeviceList(params) {
  return request('/HiatmpPro/bsp/octdevice/getAllDeviceList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询部门列表
export async function findDevicetment(params) {
  return request('/HiatmpPro/bsp/octdevice/queryDeviceByPro', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除
export async function deleteDevice(params) {
  return request('/HiatmpPro/bsp/octdevice/deleteDevices', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 添加部门
export async function addDevice(params) {
  return request('/HiatmpPro/bsp/octdevice/saveDevice', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑部门
export async function updateDevice(params) {
  return request('/HiatmpPro/bsp/octdevice/updateDevice', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 涉嫌违法详情：图片列表
export async function queryIllegalImages(params) {
  return request('/HiatmpPro/bsp/illegalevent/queryPic', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 涉嫌违法查询
export async function queryIllegalInfo(params) {
  return request('/HiatmpPro/bsp/illegalevent/queryIllegalInfo', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 涉嫌违法详情查询
export async function queryIllegalInfoDetail(params) {
  return request('/HiatmpPro/bsp/illegalevent/getOne', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
