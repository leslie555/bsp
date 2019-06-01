/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
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
// 查询某个分组的设备
export async function queryDeviceByGroup(params) {
  return request('/HiatmpPro/bsp/devicegroup/queryDeviceByGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 保存某个分组的设备排序
export async function saveSort(params) {
  return request('/HiatmpPro/bsp/devicegroup/saveSort', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询某个路段的设备
export async function GetDeviceByRoadIDSum(params) {
  return request('/HiatmpPro/bsp/road/GetDeviceByRoadID', {
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
  return request('/HiatmpPro/bsp/devicegroup/HierarchyGetall', {
    method: 'POST',
    body: '',
  });
}
// 线路分组
export async function AreaChildren() {
  return request('/HiatmpPro/bsp/tempFlow/GetTreeExecptLeaf_children', {
    method: 'POST',
    body: '',
  });
}
// 得到非叶子节点的树形结构
export async function HierarchyGetallExceptLeaf() {
  return request('/HiatmpPro/bsp/devicegroup/HierarchyGetall1', {
    method: 'POST',
    body: '',
  });
}
// 增加设备到分组
export async function addDeviceToGroup(params) {
  return request('/HiatmpPro/bsp/devicegroup/addDeviceToGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 测试：李俊锋
export async function addTest() {
  return request('/HiatmpPro/bsp/devicegroup/HierarchyGetall', {
    method: 'POST',
    body: '',
  });
}
// 通过ID查询设备
export async function findDeviceById(params) {
  return request('/HiatmpPro/bsp/octdevice/getDeviceInfoByID', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 角色删除
export async function deleteDevice(params) {
  return request('/HiatmpPro/bsp/devicegroup/delDeviceFromGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 增加分组
export async function addSonService(params) {
  return request('/HiatmpPro/bsp/devicegroup/HierarchyAdd', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 分组修改
export async function updateGroupListService(params) {
  return request('/HiatmpPro/bsp/devicegroup/HierarchyEdit', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 分组删除
export async function deleteGroupService(params) {
  console.log('分组删除');
  return request('/HiatmpPro/bsp/devicegroup/HierarchyDelete', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 保存按钮
export async function save(params) {
  return request('/HiatmpPro/bsp/devicegroup/saveQueryResult', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 通过左边id查询中间id
export async function queryid(params) {
  // console.log(JSON.stringify(params));
  console.log('通过左边id查询中间id');
  console.log(params);
  // return params;
  return request('/HiatmpPro/bsp/devicegroup/deviceGroupId', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 路段树
export async function getResourceAllTree(params) {
  return request('/HiatmpPro/bsp/auth/getResourceAllTree', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 保存分组对应查询关系
export async function SaveStatisticQuery(params) {
  return request('/HiatmpPro/bsp/devicegroup/saveStatisticQuery', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 区域
export async function AreaDetail(params) {
  return request('/HiatmpPro/bsp/tempFlow/queryFlowBy', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
