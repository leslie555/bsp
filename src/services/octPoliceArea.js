/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 得到警务区树形结构
export async function HierarchyGetall() {
  return request('/HiatmpPro/bsp/policearea/policeStruct', {
    method: 'POST',
    body: '',
  });
}
// 得到警务区树形结构:for Search  ????
export async function HierarchyGetallExJ() {
  return request('/HiatmpPro/bsp/policearea/policeStructNo', {
    method: 'POST',
    body: '',
  });
}
// 添加
export async function addRoad(params) {
  return request('/HiatmpPro/bsp/policearea/addPoliceArea', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑
export async function editRoad(params) {
  return request('/HiatmpPro/bsp/policearea/updatePoliceArea', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除
export async function deleteRoad(params) {
  return request('/HiatmpPro/bsp/policearea/deletePoliceArea', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
