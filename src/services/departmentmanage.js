/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 查询部门列表
export async function getAllDepartmentsList(params) {
  return request('/HiatmpPro/bsp/department/getAllDepartmentsList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询部门列表
export async function findDepartment(params) {
  return request('/HiatmpPro/bsp/department/queryDepartmentByPro', {
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
// 编辑部门
export async function updateDepartment(params) {
  return request('/HiatmpPro/bsp/department/updateDepartment', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
