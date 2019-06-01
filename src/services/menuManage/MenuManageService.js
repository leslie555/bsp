/**
 * Created by Administrator on 2018/7/12.
 */
import request from '../../utils/request';

// 任务列表查询
export async function queryMenuListService(params) {
  return request('/HiatmpPro/bsp/menu/findMenuJson4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 任务列表查询
export async function queryOperateService(params) {
  return request('/HiatmpPro/bsp/menu/findOperate4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 菜单更新
export async function updateMenuListService(params) {
  return request('/HiatmpPro/bsp/devicegroup/HierarchyEdit', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 菜单更新
export async function addSonService(params) {
  return request('/HiatmpPro/bsp/menu/addSon4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 菜单删除
export async function deleteMenuListService(params) {
  return request('/HiatmpPro/bsp/menu/deleteMenu4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 权限增加
export async function addOperateService(params) {
  return request('/HiatmpPro/bsp/menu/addOperate4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 权限增加
export async function updateOperate(params) {
  return request('/HiatmpPro/bsp/menu/updateOperate4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 权限增加
export async function deleteOperateService(params) {
  return request('/HiatmpPro/bsp/menu/deleteOperate4react', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
