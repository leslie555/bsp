/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 查询所有设备
export async function getAllDeviceList(params) {
  return request('/HiatmpPro/bsp/octdevice/getAllDeviceList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 按条件查询设备
export async function findDevicetment(params) {
  return request('/HiatmpPro/bsp/octdevice/queryDeviceByPro', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除设备
export async function deleteDevice(params) {
  return request('/HiatmpPro/bsp/octdevice/deleteDevices', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 添加设备
export async function addDevice(params) {
  return request('/HiatmpPro/bsp/octdevice/saveDevice', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑设备
export async function updateDevice(params) {
  return request('/HiatmpPro/bsp/octdevice/updateDevice', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
