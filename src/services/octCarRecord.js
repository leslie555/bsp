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
// 过车记录
export async function queryVehicleRecordBy(params) {
  return request('/HiatmpPro/bsp/vehiclerecord/queryVehicleRecordBy', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 设备id模糊查询
export async function getDeviceinfoByID(params) {
  return request('/HiatmpPro/bsp/octdevice/getDeviceInfoByID', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 过车记录详情
export async function queryVehicleRecordByDetail(params) {
  return request('/HiatmpPro/bsp/vehiclerecord/getOne', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
