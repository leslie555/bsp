/**
 * Created by cherry on 2018/7/26.
 */
import request from '../utils/request';
// 查询功能授权树
export async function getAuthorityTree(params) {
  return request('/HiatmpPro/bsp/auth/getAuthorityAllTree', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询资源树
export async function getResourceTree(params) {
  return request('/HiatmpPro/bsp/auth/getResourceAllTree', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 角色查询
export async function queryRole(params) {
  return request('/HiatmpPro/bsp/role/queryRolesByPro', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 角色删除
export async function deleteRole(params) {
  return request('/HiatmpPro/bsp/role/deleteRoles', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 拥有某角色的人员查询
export async function findUserRoleList(params) {
  return request('/HiatmpPro/bsp/role/findUserRoleList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 添加、编辑角色
export async function saveRole(params) {
  return request('/HiatmpPro/bsp/role/saveRole', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
