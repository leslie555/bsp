/**
 * Created by Administrator on 2018/7/11.
 */
import request from '../utils/request';

// 根据用户ID查询用户信息
export async function queryUserById(params) {
  return request('/HiatmpPro/bsp/queryUserById', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 获取部门信息
export async function getDepartmentList() {
  return request('/HiatmpPro/api/usermgr/getDepartmentListToJson', {
    method: 'GET',
  });
}
// 获取部门信息：只有交管局
export async function getDepartmentListJGJ() {
  return request('/HiatmpPro/api/usermgr/getDepartmentListOnlyJGJToJson', {
    method: 'GET',
  });
}
// 获取部门信息：只有维护/建设单位
export async function getDepartmentListWeiHuJianShe() {
  return request('/HiatmpPro/api/usermgr/getDepartmentListWhSgToJson', {
    method: 'GET',
  });
}
// 条件查询用户
export async function getOperatorList(params) {
  return request('/HiatmpPro/api/usermgr/getOperatorList4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
//
export async function deleteOperator(params) {
  return request('/HiatmpPro/api/usermgr/deleteOperator4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 批量删除用户
export async function deleteOperators(params) {
  return request('/HiatmpPro/api/usermgr/deleteOperators4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 新增用户
export async function addOperator(params) {
  return request('/HiatmpPro/api/usermgr/addOperator4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 获取角色信息列表
export async function getRoleList() {
  return request('/HiatmpPro/api/usermgr/getRoleListToJson', {
    method: 'GET',
  });
}
// 获取角色信息列表
export async function getRoleListLikeRolenameToJson(params) {
  return request('/HiatmpPro/api/usermgr/getRoleListLikeRolenameToJson', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 获取用户可支配角色列表
export async function getDistributAbleRoles(params) {
  return request('/HiatmpPro/api/usermgr/getDistributAbleRoles', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 获取用户角色名
export async function getUserRoles(params) {
  return request('/HiatmpPro/api/usermgr/getUserRoles4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 修改选中用户
export async function updateOperator(params) {
  return request('/HiatmpPro/api/usermgr/updateOperator4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询绑定IP信息
export async function findIPList(params) {
  return request('/HiatmpPro/api/loginrestrict/find4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除
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
// 获取当前用户登录信息
export async function getCurrentUserInfo() {
  return request('/HiatmpPro/api/usermgr/getCurrentUserInfo', {
    method: 'GET',
  });
}
// 修改密码
export async function updatePwdForOperator(params) {
  return request('/HiatmpPro/api/usermgr/updatePwdForOperator4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 重置密码
export async function resetPwd(params) {
  return request('/HiatmpPro/api/usermgr/resetPwd4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 根据警员姓名查询警员信息
export async function queryPoliceListService(params) {
  return request('/HiatmpPro/bsp/police/getPoliceByName4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
