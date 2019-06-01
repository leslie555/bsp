/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/requestEx';
// 查询部门列表
export async function findDepartment(params) {
  return request('/HiatmpPro/bsp/department/queryDepartmentByPro', {
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
// 删除
export async function deleteDepartment(params) {
  return request('/HiatmpPro/bsp/department/deleteDepartments', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 添加部门
export async function addDepartment(params) {
  return request('/HiatmpPro/bsp/department/saveDepartment', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 某个分组的设备
export async function queryDeviceByGroup(params) {
  return request('/HiatmpPro/bsp/devicegroup/queryDeviceByGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 得到所有分组信息
export async function queryAllGroup() {
  return request('/HiatmpPro/bsp/devicegroup/queryAllGroup', {
    method: 'POST',
    body: '',
  });
}
// 得到树形结构
export async function HierarchyGetall() {
  return request('/HiatmpPro/bsp/road/HierarchyGetall', {
    method: 'POST',
    body: '',
  });
}
// 得到某个节点下的所有设备
export async function GetDeviceByRoadID(params) {
  return request('/HiatmpPro/bsp/road/GetDeviceByRoadID', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 得到树形结构:for Search
export async function HierarchyGetallEx() {
  return request('/HiatmpPro/bsp/road/HierarchyGetallEx', {
    method: 'POST',
    body: '',
  });
}
// 添加
export async function addRoad(params) {
  return request('/HiatmpPro/bsp/road/HierarchyAdd', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑
export async function editRoad(params) {
  return request('/HiatmpPro/bsp/road/HierarchyEdit', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除
export async function deleteRoad(params) {
  return request('/HiatmpPro/bsp/road/HierarchyDelete', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 图片下载请求
export async function downloadPic(params) {
  return request('/HiatmpPro/bsp/vehiclerecord/downloadFilePic', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
